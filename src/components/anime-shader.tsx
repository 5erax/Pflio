'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { clamp, HERO_HOLD } from '@/lib/timeline';

const vertex = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() { vUv = aPosition * .5 + .5; gl_Position = vec4(aPosition, 0., 1.); }
`;

// Ripple wave / exponential falloff adapted from VengeanceUI's MIT-licensed
// ripple-displacement-slider. The atmosphere and depth camera are specific to this scene.
const fragment = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uCity, uFilm;
uniform vec2 uResolution, uCamera;
uniform float uTime, uReveal, uFilmReady;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
    mix(hash(i + vec2(0., 1.)), hash(i + vec2(1.)), f.x), f.y);
}
vec2 cover(vec2 uv) {
  float aspect = uResolution.x / uResolution.y;
  vec2 scale = vec2(min(1., aspect / (16. / 9.)), min(1., (16. / 9.) / aspect));
  return (uv - .5) * scale * .92 + .5;
}
float depth(vec2 uv) {
  // ponytail: an authored 2.5D depth field for this one artwork; use a painted
  // depth texture if the scene or camera travel grows beyond this bounded view.
  float street = smoothstep(.49, .94, 1. - uv.y);
  float wall = smoothstep(.56, .76, uv.x);
  return .12 + .56 * street + .30 * wall;
}
void main() {
  vec2 uv = cover(vUv);
  vec2 camera = uCamera * vec2(.037, .025);
  float d = depth(uv);
  // Two depth refinements keep foreground walls travelling further than the skyline.
  vec2 cityUv = uv + camera * d;
  cityUv = uv + camera * depth(cityUv);
  float plume = (1. - smoothstep(.045, .12, abs(cityUv.x - .13 - cityUv.y * .22)))
    * smoothstep(.15, .35, cityUv.y) * (1. - smoothstep(.72, .88, cityUv.y));
  vec2 smokeFlow = vec2(cityUv.x * 18., cityUv.y * 13. - uTime * .16);
  float smoke = noise(smokeFlow) * .6 + noise(smokeFlow * 1.9) * .4;
  cityUv.x += (smoke - .5) * plume * .012;
  vec3 city = texture2D(uCity, cityUv).rgb;
  city = mix(city, vec3(.19, .22, .23), smoke * plume * .18);
  vec2 air = cityUv * vec2(7., 4.) + vec2(uTime * .045, -uTime * .018);
  float mist = noise(air) * .65 + noise(air * 2.13) * .35;
  float streetAir = (1. - d) * smoothstep(.18, .65, 1. - uv.y);
  city = mix(city, vec3(.64, .70, .70), mist * streetAir * .28);
  float light = pow(max(0., 1. - abs(cityUv.x - .24 - (cityUv.y - .18) * .15) * 3.), 4.);
  city += vec3(.24, .105, .035) * light * (1. - d) * (.55 + .10 * sin(uTime * .9));
  // Three camera-relative rain planes, each with a different speed and size.
  for (int layer = 0; layer < 3; layer++) {
    float z = float(layer) + 1.;
    vec2 rainUv = vUv + camera * z * 1.5;
    vec2 grid = rainUv * vec2(72. / z, 18. / z);
    float column = floor(grid.x);
    float seed = hash(vec2(column, z));
    float line = pow(max(0., 1. - abs(fract(grid.x) - seed) * 21.), 3.);
    float drop = fract(grid.y + uTime * (1.2 + z * .55) + seed * 15.);
    float streak = smoothstep(.80, .93, drop) * (1. - smoothstep(.93, 1., drop));
    city += vec3(.50, .59, .62) * line * streak * .09 * z;
  }
  float aspect = uResolution.y / uResolution.x;
  vec2 coord = vec2(vUv.x, vUv.y * aspect);
  vec2 center = vec2(.26, .48 * aspect);
  float dist = distance(coord, center), radius = uReveal * 1.65 - .12;
  float trailing = dist - radius;
  vec2 displaced = coord;
  float brightness = 0.;
  if (trailing < 0. && trailing > -.5) {
    float age = -trailing, decay = exp(-age * 10.);
    float wave = sin(age * 25.) * decay;
    displaced += (coord - center) / max(dist, .001) * wave * .035;
    brightness = abs(wave) * .35 * decay;
  }
  vec2 filmUv = cover(vec2(displaced.x, displaced.y / aspect)) + camera * .16;
  vec3 film = texture2D(uFilm, filmUv).rgb;
  float blend = smoothstep(0., .075, -trailing) * uFilmReady;
  vec3 color = mix(city, film, blend);
  color += color * brightness * blend;
  float vignette = 1. - .18 * dot(vUv - .5, vUv - .5);
  gl_FragColor = vec4(color * vignette, 1.);
}
`;

export function AnimeShader({ progress, video }: { progress: RefObject<number>; video: RefObject<HTMLVideoElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const paused = useRef(false), wake = useRef<(() => void) | null>(null);
  const [still, setStill] = useState(false);
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const surface = canvas.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const restart = () => setEpoch(value => value + 1);
    reduced.addEventListener('change', restart);
    surface.dataset.state = 'fallback';
    if (reduced.matches || connection?.saveData) return () => reduced.removeEventListener('change', restart);
    const gl = surface.getContext('webgl', { antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!gl) return () => reduced.removeEventListener('change', restart);
    const shaders: WebGLShader[] = [], textures: WebGLTexture[] = [];
    const program = gl.createProgram()!, buffer = gl.createBuffer()!;
    let disposed = false, lost = false, visible = false, loaded = false, frame = 0, decodedFrame = 0;
    let videoDirty = true, filmReady = false, previous = 0, time = 0, lastMediaTime = -1;
    let width = 1, height = 1, pixelBudget = 420_000, slowFrames = 0;
    const target = [0, 0], camera = [0, 0];
    function compile(source: string, type: number) {
      const shader = gl!.createShader(type)!; shaders.push(shader);
      gl!.shaderSource(shader, source); gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(shader) ?? 'Shader compilation failed');
      gl!.attachShader(program, shader);
    }
    try {
      compile(vertex, gl.VERTEX_SHADER); compile(fragment, gl.FRAGMENT_SHADER);
      gl.bindAttribLocation(program, 0, 'aPosition'); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader linking failed');
    } catch (error) {
      console.warn('Anime scene uses its static fallback:', error);
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); gl.deleteBuffer(buffer);
      return () => reduced.removeEventListener('change', restart);
    }
    gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(['uCity', 'uFilm', 'uResolution', 'uCamera', 'uTime', 'uReveal', 'uFilmReady'].map(name => [name, gl.getUniformLocation(program, name)]));
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    for (let unit = 0; unit < 2; unit++) {
      const texture = gl.createTexture()!; textures.push(texture);
      gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([40, 44, 48, 255]));
    }
    gl.uniform1i(uniforms.uCity, 0); gl.uniform1i(uniforms.uFilm, 1);
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 1.25, Math.sqrt(pixelBudget / (width * height)));
      surface.width = Math.max(1, Math.round(width * ratio)); surface.height = Math.max(1, Math.round(height * ratio));
      gl.viewport(0, 0, surface.width, surface.height); gl.uniform2f(uniforms.uResolution, width, height);
    };
    const observer = new ResizeObserver(([entry]) => { width = entry.contentRect.width; height = entry.contentRect.height; resize(); }); observer.observe(surface);
    const film = video.current;
    const dirty = () => { videoDirty = true; schedule(); };
    const onDecoded = () => {
      videoDirty = true;
      schedule();
      if (!disposed && !lost && film) decodedFrame = film.requestVideoFrameCallback(onDecoded);
    };
    if (film) {
      film.addEventListener('seeked', dirty); film.addEventListener('loadeddata', dirty);
      if ('requestVideoFrameCallback' in film) decodedFrame = film.requestVideoFrameCallback(onDecoded);
    }
    const draw = (now: number) => {
      if (disposed || lost || !visible || document.hidden || !loaded) { frame = 0; return; }
      const elapsed = previous ? now - previous : 16.7; previous = now; if (!paused.current) time += Math.min(elapsed, 40) / 1000;
      // Lower only the backbuffer resolution on a slow GPU; preserve the full effect.
      slowFrames = elapsed > 27 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 25 && pixelBudget > 180_000) { pixelBudget *= .75; slowFrames = 0; resize(); }
      const smoothing = 1 - Math.exp(-Math.min(elapsed, 40) / 110);
      for (let axis = 0; axis < 2; axis++) camera[axis] += (target[axis] - camera[axis]) * smoothing;
      if (film && film.readyState >= 2 && !film.seeking && (videoDirty || lastMediaTime !== film.currentTime)) {
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, film);
        videoDirty = false; lastMediaTime = film.currentTime; filmReady = true;
      }
      gl.uniform2f(uniforms.uCamera, camera[0] + Math.sin(time * .22) * .22, camera[1] + Math.sin(time * .17) * .12); gl.uniform1f(uniforms.uTime, time);
      gl.uniform1f(uniforms.uReveal, film?.loop && filmReady ? 1 : clamp(progress.current / HERO_HOLD));
      gl.uniform1f(uniforms.uFilmReady, filmReady ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      surface.dataset.state = 'ready';
      frame = !paused.current || camera.some((value, axis) => Math.abs(value - target[axis]) > .005) ? requestAnimationFrame(draw) : 0;
    };
    const schedule = () => { if (!frame && visible && loaded && !lost && !document.hidden) { previous = 0; frame = requestAnimationFrame(draw); } };
    wake.current = schedule;
    window.addEventListener('scroll', schedule, { passive: true });
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; } }); visibility.observe(surface);
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule(); };
    document.addEventListener('visibilitychange', onVisibility);
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const pointer = (event: PointerEvent) => {
      if (!fine.matches) return;
      const rect = surface.getBoundingClientRect();
      target[0] = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      target[1] = clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1);
      schedule();
    };
    const reset = () => { target[0] = 0; target[1] = 0; schedule(); };
    const stage = surface.parentElement!; stage.addEventListener('pointermove', pointer); stage.addEventListener('pointerleave', reset);
    const image = new Image();
    image.onload = () => {
      if (disposed || lost) return;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      loaded = true; schedule();
    }; image.src = '/media/anime-city.webp';
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; surface.dataset.state = 'fallback'; };
    surface.addEventListener('webglcontextlost', contextLost); surface.addEventListener('webglcontextrestored', restart);
    return () => {
      disposed = true; cancelAnimationFrame(frame); if (decodedFrame) film?.cancelVideoFrameCallback(decodedFrame);
      wake.current = null; window.removeEventListener('scroll', schedule);
      observer.disconnect(); visibility.disconnect(); image.onload = null;
      film?.removeEventListener('seeked', dirty); film?.removeEventListener('loadeddata', dirty);
      stage.removeEventListener('pointermove', pointer); stage.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', onVisibility); reduced.removeEventListener('change', restart);
      surface.removeEventListener('webglcontextlost', contextLost); surface.removeEventListener('webglcontextrestored', restart);
      textures.forEach(texture => gl.deleteTexture(texture)); shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      surface.dataset.state = 'fallback';
    };
  }, [epoch, progress, video]);
  return <><canvas ref={canvas} className="anime-shader" aria-hidden="true" data-state="fallback" /><button className="anime-atmosphere mono" type="button" aria-pressed={still} onClick={() => { paused.current = !paused.current; setStill(paused.current); wake.current?.(); }}>{still ? 'RESUME ATMOSPHERE' : 'PAUSE ATMOSPHERE'} <span aria-hidden>{still ? '▶' : 'Ⅱ'}</span></button></>;
}
