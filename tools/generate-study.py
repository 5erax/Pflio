"""Author astraa's cut-ribbon A; stream a reversible fold study to FFmpeg."""
from pathlib import Path
from math import cos, sin, radians, pi
import json
import os
import shutil
import re
import subprocess

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
FFMPEG = os.environ.get("FFMPEG_BINARY") or shutil.which("ffmpeg")
if not FFMPEG:
    raise RuntimeError('Install FFmpeg or set FFMPEG_BINARY before regenerating media.')
MEDIA = ROOT / "public/media"
VIDEO = MEDIA / "study.mp4"
POSTER = MEDIA / "study-poster.webp"
SIZE, FPS, SECONDS, PADDING = 960, 30, 6, .22
LIME, INK, EDGE = (198, 255, 51), (5, 5, 5), (25, 29, 16)
# Same three paths as src/components/identity-mark.tsx.
RIBBONS = [[(18, 180), (86, 20), (111, 20), (44, 180)],
           [(117, 20), (139, 20), (194, 180), (168, 180)],
           [(59, 117), (158, 117), (167, 141), (49, 141)]]


def project(x, y, z, progress, ribbon):
    split = sin(pi * progress) ** 2
    rz = radians([-35, 28, -20][ribbon] * split)
    rx = radians([58, -48, 72][ribbon] * split)
    ry = radians(-35 * split)
    x, y = x * cos(rz) - y * sin(rz), x * sin(rz) + y * cos(rz)
    y, z = y * cos(rx) - z * sin(rx), y * sin(rx) + z * cos(rx)
    x, z = x * cos(ry) + z * sin(ry), -x * sin(ry) + z * cos(ry)
    x += [-58, 58, 0][ribbon] * split
    y += [24, -24, 62][ribbon] * split
    perspective = 700 / (700 + z)
    return x * perspective, y * perspective, z


def render(progress, supersample=2):
    shapes = [([project(x - 100, y - 100, 0, progress, index) for x, y in vertices],
               [project(x - 100, y - 100, 10, progress, index) for x, y in vertices])
              for index, vertices in enumerate(RIBBONS)]
    # A gentle camera adjustment keeps the rotating tips inside the same square margin.
    extent = max(96, *(max(abs(x), abs(y)) for front, back in shapes for x, y, _ in front + back))
    scale = SIZE * (.5 - PADDING) / extent
    def pixels(points):
        return [((SIZE / 2 + x * scale) * supersample,
                 (SIZE / 2 + y * scale) * supersample) for x, y, _ in points]
    canvas = Image.new("RGB", (SIZE * supersample, SIZE * supersample), LIME)
    draw = ImageDraw.Draw(canvas)
    faces = []
    for front, back in shapes:
        front_pixels, back_pixels = pixels(front), pixels(back)
        for x, y in front_pixels + back_pixels:
            assert SIZE * PADDING * supersample - .01 <= x <= SIZE * (1 - PADDING) * supersample + .01
            assert SIZE * PADDING * supersample - .01 <= y <= SIZE * (1 - PADDING) * supersample + .01
        faces.extend([(sum(p[2] for p in back) / 4, back_pixels, EDGE),
                      (sum(p[2] for p in front) / 4, front_pixels, INK)])
        for i in range(4):
            j = (i + 1) % 4
            depth = (front[i][2] + front[j][2] + back[i][2] + back[j][2]) / 4
            faces.append((depth, [front_pixels[i], front_pixels[j], back_pixels[j], back_pixels[i]], EDGE))
    for _, face, color in sorted(faces, key=lambda item: item[0], reverse=True):
        draw.polygon(face, fill=color)
    return canvas.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def main():
    MEDIA.mkdir(parents=True, exist_ok=True)
    poster = render(0, supersample=4)
    poster.save(POSTER, "WEBP", lossless=True, method=6)
    assert poster.getpixel((0, 0)) == LIME and INK in poster.getdata()
    command = [str(FFMPEG), "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
               "-pixel_format", "rgb24", "-video_size", f"{SIZE}x{SIZE}", "-framerate", str(FPS),
               "-i", "pipe:0", "-an", "-vf", "scale=out_color_matrix=bt709:out_range=tv",
               "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
               "-g", "4", "-keyint_min", "4", "-sc_threshold", "0", "-color_primaries", "bt709",
               "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
               "-movflags", "+faststart", "-frames:v", str(FPS * SECONDS), str(VIDEO)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    try:
        for frame in range(FPS * SECONDS):
            process.stdin.write(render(frame / (FPS * SECONDS - 1)).tobytes())
    finally:
        process.stdin.close()
    diagnostic = process.stderr.read().decode("utf-8", errors="replace")
    if process.wait() != 0:
        raise RuntimeError(diagnostic)
    probe = subprocess.run([str(FFMPEG), "-hide_banner", "-i", str(VIDEO), "-map", "0:v:0", "-f", "null", "-"],
                           capture_output=True, text=True, check=True)
    assert "960x960" in probe.stderr and "30 fps" in probe.stderr
    assert "Duration: 00:00:06.00" in probe.stderr and re.search(r"frame=\s*180", probe.stderr)
    keys = subprocess.run([str(FFMPEG), "-hide_banner", "-skip_frame", "nokey", "-i", str(VIDEO),
                           "-vf", "showinfo", "-f", "null", "-"], capture_output=True, text=True, check=True)
    keyframes = sum("iskey:1" in line for line in keys.stderr.splitlines())
    assert keyframes == FPS * SECONDS // 4, f"Expected 45 keyframes, found {keyframes}"
    raw = VIDEO.read_bytes()
    assert 0 <= raw.find(b"moov") < raw.find(b"mdat"), "Metadata must precede media for fast start"
    samples = []
    for timestamp in (0, 2.8, 5.8, 0):
        decoded = subprocess.run([str(FFMPEG), "-loglevel", "error", "-ss", str(timestamp), "-i", str(VIDEO),
                                  "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"],
                                 capture_output=True, check=True).stdout
        assert len(decoded) == SIZE * SIZE * 3
        assert max(abs(decoded[i] - LIME[i]) for i in range(3)) <= 3, "Decoded lime must match the poster"
        samples.append(decoded)
    assert samples[0] != samples[1], "The encoded study must contain changing geometry"
    assert samples[0] == samples[-1], "Reverse seeking must reproduce the first frame"
    print(json.dumps({"video": str(VIDEO), "poster": str(POSTER), "size": [SIZE, SIZE], "seconds": SECONDS,
                      "fps": FPS, "frames": FPS * SECONDS, "keyframes": keyframes, "gop": 4,
                      "faststart": True, "padding": PADDING, "video_bytes": VIDEO.stat().st_size,
                      "poster_bytes": POSTER.stat().st_size, "verified": "FFmpeg full decode and bidirectional seek samples"}, indent=2))


if __name__ == "__main__":
    main()
