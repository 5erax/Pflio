# astraa / Interfaces in motion

Personal portfolio for Astraa, a fullstack developer in Vietnam. Identity, contact details, background and selected projects are grounded in [5erax’s profile README](https://github.com/5erax/5erax). Projects: ProZ0, MediMateAI and FinGenie, plus four linked repositories. No invented client results or metrics.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build` then `npm start`. Validation: `npm run check` and `npm test`.

## Anime art and motion

One native WebGL scene uses Morevna Project's ruined city and a short licensed Episode 3 excerpt. An authored 2.5D depth field moves foreground walls further than the skyline. Animated smoke, fog, light and three rain planes share one fragment pass. The radial transition adapts VengeanceUI's MIT RippleDisplacementSlider GLSL. Sources and licenses appear in **Visual credits** and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). The film and poster are CC BY-SA 4.0 adaptations; the city is CC BY 4.0, with shader parallax and atmospheric changes.

About is a personal folio. Worlds, Interfaces and Systems select ProZ0, MediMate AI and FinGenie, with original profile cover art, implementation details, source links and actual case dialogs.

Desktop keeps one GSAP/ScrollTrigger timeline following Lenis's eased position. GPU transition, paused video seeking and continuous gallery travel read the same progress. There is no second scroll easing or per-frame React state. The GPU's render clock supplies ambient time and stops offscreen, in hidden tabs or when Pause atmosphere settles. A single pass caps the backbuffer at about 420,000 pixels and lowers resolution on a slow renderer. This is stylized 2.5D, not reconstructed 3D geometry.

Video textures update only on decoded frames or completed seeks. Context loss exposes DOM media; restoration rebuilds GPU resources. Reduced motion, Save-Data and absent WebGL retain real static media. Mobile uses normal flow and opt-in Play/Pause playback. Leaving the hero pauses the film. Save-Data/2G skips automatic video loading. No artificial loading screen or new runtime library.

`anime-eye.mp4`: 960×540, three seconds, 30 fps, H.264 GOP4 and fast-start metadata. Static Next image imports give revised posters fresh content filenames.

## Edit

- `src/data/portfolio.ts`: personal details and real projects.
- `src/components/experience.tsx`: anime composition, chapters and visual credits.
- `src/components/anime-shader.tsx`: native GPU scene, depth camera and resource lifecycle.
- `src/components/about.tsx`: profile and interactive project folio.
- `src/lib/use-master-timeline.ts`: shared scroll progress, project travel and video seeking.
- `src/lib/timeline.ts`: chapter ranges, continuous project position and media bounds.
- `src/app/globals.css`: responsive composition and animation fallback.

## Browser regression

`tools/verify-motion.mjs` checks actual WebGL draws and uniforms, atmosphere pause, context recovery, offscreen idle, reversible film seeking, folio cases, continuous gallery travel, live reduced motion and mobile/media/GPU fallbacks. Playwright is an optional QA dependency. Supply `PLAYWRIGHT_PATH` as a module URL and `PREVIEW_URL` to test a different server:

```sh
node tools/verify-motion.mjs
```

## Component sources

Application adaptations retain VengeanceUI GlassDock, PerspectiveCarousel, SolarSystem and RippleDisplacementSlider GLSL; Animate UI Cursor/CursorFollow; ForgeUI Animated Tabs; and Nicolas Jesenberger's Uiverse physical toggle. Notices and restrictions remain in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). UILora source requires account/license access and is not included. These are integrations into a personal application, not a component-library product. No runtime dependency was added for this revision.

## Contact

The public email `lagna0175@gmail.com` and LinkedIn link come from the profile README. Direct email works independently of the optional form receiver.

The form keeps validation, pending/error/success states, a honeypot, origin checks, size limits and timeouts. Without configuration it reports that the message was not sent and offers Copy draft / Save draft.

Copy `.env.example` to `.env.local` and configure `CONTACT_WEBHOOK_URL` with a receiver accepting `{ name, email, message }` JSON. `CONTACT_WEBHOOK_TOKEN` is optional. No external message was sent during verification.

See [VERIFICATION.md](./VERIFICATION.md) for measurements and their limits.
