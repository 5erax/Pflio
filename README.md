# astraa / Portfolio Experience

A cinematic first portfolio, built from an empty repository. It uses a dark metallic orbital world, ivory editorial type, and one lime accent. Content reflects astraa's actual starting point: this portfolio is the first project; the other two spaces are explicitly pending work.

## Run

Node.js 22.18+ is recommended (the small test runner uses native TypeScript stripping).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production:

```sh
npm test
npm run check
npm run build
npm start
```

The repository is prepared on the local `feat/cinematic-portfolio` branch. Publication and GitHub push are separate from this local deliverable.

## Content and visual controls

- `src/data/portfolio.ts`: name, social links, project stories, technologies, journey, and background tabs. No invented client projects, experience, statistics, or education.
- `src/lib/timeline.ts`: six contiguous checkpoint ranges, overall scroll distance, timing, and seek math. Selected work receives 30% of the master timeline.
- `src/app/globals.css`: centralized colors, typography, spacing, material, radii, layer order, and CSS motion tokens. Change `--accent` to recolor the entire experience.
- `src/lib/use-master-timeline.ts`: desktop timeline and smooth, reversible media seeking. GSAP/ScrollTrigger/Lenis load only on desktop without reduced motion. Mobile and reduced motion use normal flow, static art, and independently controllable projects.

Desktop scroll advances or reverses the six-second camera sequence; it never calls `video.play()`. A time-based interpolation smooths the target, avoids overlapping seeks, and stays below the duration endpoint. Checkpoint navigation and project controls use the same timeline. The poster remains usable when video loading fails or the connection requests reduced data.

The project gallery supports ordinary page scrolling, horizontal pointer/touch gestures, Left/Right keys, and visible buttons. The fullscreen native dialog traps focus, closes with Escape, restores focus, and retains the page's scroll position. Journey files and Experience/Education/Now tabs work with the keyboard.

## Contact delivery

The form has native validation, server validation, loading/error/success states, a honeypot, an origin check, request-size bounds, and delivery timeouts.

**Delivery is intentionally unconfigured because no receiving email/provider was supplied.** Submit displays an honest error and provides copy/save-draft controls. GitHub remains a working contact alternative.

To enable delivery, copy `.env.example` to `.env.local`, set `CONTACT_WEBHOOK_URL` to a server-side provider that accepts `{ name, email, message }` JSON, and optionally set `CONTACT_WEBHOOK_TOKEN`. A successful provider response confirms acceptance, not that a recipient has read the message. Add hosting-edge rate limiting/bot protection before opening a configured receiver publicly.

## Animation ownership

GSAP owns the hero exit, scene shading, orbital exit, and master scroll progress. Motion owns nested project slide positions, project-button hover, magnetic CTA, cursor, dialog entrance, and tab transitions. CSS owns appearance, inner image hover, and orbit rotation. Two systems do not control the same transform or opacity on the same element. Listeners, observers, contexts, tickers, and Lenis are cleaned up when modes change or components unmount; hidden-page and offscreen orbit work pauses.

## Media

`public/media/orbital.webp` is approximately 100 KB; `orbital.mp4` is approximately 3.4 MB. The video is H.264, 1280×720, 30 fps, with a keyframe every four frames and fast-start metadata for seeking. It is a deliberate camera push/pan through the generated orbital artwork, not a claimed real-time 3D simulation. Touch/mobile, reduced-motion, Save-Data, and 2G modes avoid loading the video.

The artwork was generated with the built-in image-generation tool. Final prompt: “Wide photorealistic cinematic 3D art: one massive finely ribbed dark brushed-chrome orbital torus, tilted diagonally in a #050505 void, silver/ivory rim light, subtle lime reflections, center-right composition with empty dark space at left; no text, logos, or UI.” The WebP and short video are the retained project assets.

## Component reference notes

No proprietary component source was copied. Behaviors were adapted into local components with the portfolio's own styling:

- [Vengeance UI Glass Dock](https://www.vengenceui.com/components/glass-dock), [Perspective Carousel](https://www.vengenceui.com/components/perspective-carousel), and [Solar System](https://www.vengenceui.com/components/solar-system): chapter navigation, spatial project selection, and toolkit orbits.
- [Animate UI](https://animate-ui.com/): cursor states, immersive dialogs, files, and tabs. Native `<dialog>` supplies browser focus handling.
- [ForgeUI](https://forgeui.in/), [Uiverse](https://uiverse.io/), and [UILora](https://www.uilora.com/): supporting component/material references. No premium source or extra runtime package was added from these libraries.

## Verification

Production build and TypeScript checks pass. Native Node tests cover contiguous checkpoints, project boundaries, forward/backward smoothing, seek bounds, and contact input validation. Browser QA covers desktop navigation, reversible video, toolkit selection, gallery controls, modal focus/Escape/scroll restoration, filesystem selection, keyboard tabs, contact draft recovery, 320/390/768/1024 px layouts, and reduced motion. Contact delivery success and upstream failure were verified against a local mock receiver; no external message was sent.

Automated accessibility scans found no WCAG A/AA violations in the scanned desktop and mobile states. These scans do not replace a complete manual accessibility audit. Lighthouse results are local lab measurements and can vary with hosting and hardware; see the included verification report for the final scores and measured limitations.
