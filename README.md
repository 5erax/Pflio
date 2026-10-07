# astraa / From zero

A first portfolio built from an empty repository. The experimental studio direction uses Archivo typography, an ivory cover, black editorial spreads, lime interaction fields, and one original six-arm identity mark. There is one real project: this portfolio, presented through Interface, Motion, and System studies.

## Run

Use Node.js 22.18+; the tests use native TypeScript stripping.

```sh
npm ci
npm run dev
```

Production checks and preview:

```sh
npm test
npm run check
npm run build
npm start
```

Open http://localhost:3000. Changes are local on `feat/cinematic-portfolio`; they have not been pushed or publicly deployed.

## Edit

- `src/data/portfolio.ts`: identity, project story, tools, learning notes, and background. Education details remain pending; client work and experience are not invented.
- `src/lib/timeline.ts`: six contiguous checkpoints and shared progress, project-view, and media-seek math.
- `src/lib/use-master-timeline.ts`: GSAP/ScrollTrigger/Lenis coordination. Desktop uses sticky scenes and actual bidirectional `video.currentTime` seeking. It never calls `video.play()`.
- `src/components/projects.tsx`: three views of one project, not three claimed projects. Native buttons, arrow keys, Home/End, and horizontal gestures control the sourced perspective track.
- `src/app/globals.css`: palette, spacing, rail, compositions, and explicit responsive layouts.

Mobile and reduced-motion use normal document flow, static art, and independent view controls. Desktop-only motion libraries load dynamically. Video is also skipped for Save-Data and 2G. Native dialogs contain focus, close with Escape, restore focus, and preserve scroll position. The system motion preference can change while the page is open.

## Real source integrations

Adapted source is retained from VengeanceUI GlassDock, PerspectiveCarousel, and SolarSystem; Animate UI Cursor/CursorFollow; ForgeUI Animated Tabs; and Nicolas Jesenberger's Uiverse physical toggle. The vertical rail retains the directional spring tooltip. The toolkit retains 3D orbit and inverse billboard mechanics with verified tool logos. Tabs retain ForgeUI's moving highlight. The native pointer remains available alongside the decorative follower.

Each integration has a source comment. Exact source links, authors, and complete notices are in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). UILora source is account/license gated and is not included. No additional runtime dependencies were introduced for the redesign. These integrations belong to a personal website, not a redistributable component library or template product.

## Original motion study

`public/media/study.mp4` is 598,370 bytes: H.264, 960 square, six seconds, 30 fps, a keyframe every four frames, and fast-start metadata. `study-poster.webp` is 4,118 bytes. The authored six-arm geometry rotates with a mild perspective tilt and extrusion. It is a pre-rendered geometric study, not a real-time WebGL simulation.

The video remains paused while one smoothed timeline seeks it forward or backward. Seeking is bounded below the endpoint and avoids overlapping requests. Poster art remains if loading fails. GSAP owns chapter transforms; Motion owns nested interaction elements; CSS owns the orbits. Observers, tickers, listeners, and smooth scrolling clean up on mode changes and unmount. Hidden-page and offscreen orbit work pauses.

The original generator is `tools/generate-study.py`. Optional regeneration requires Python, Pillow, and FFmpeg on PATH (or `FFMPEG_BINARY`):

```sh
python tools/generate-study.py
```

## Contact

The native form has client/server validation, loading/error/success states, a honeypot, origin checks, size bounds, and delivery timeouts. **Delivery needs configuration:** no receiving email/provider was supplied. An unconfigured submission explicitly reports that it was not sent and offers Copy draft / Save draft. The GitHub link works independently.

Copy `.env.example` to `.env.local` and configure `CONTACT_WEBHOOK_URL` with a provider accepting `{ name, email, message }` JSON. `CONTACT_WEBHOOK_TOKEN` is optional. Provider acceptance confirms submission, not that the recipient has read it. Use hosting-edge rate limiting when publicly enabling the receiver.

See [VERIFICATION.md](./VERIFICATION.md) for the current production checks and measurement limits.
