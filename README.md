# astraa / Interfaces in motion

A personal portfolio for Astraa, a fullstack developer in Vietnam focused on expressive UI and thoughtful motion. The experimental studio direction uses Archivo typography, ivory, ink and lime, with a custom open A assembled from three cut ribbons.

## Run

Use Node.js 22.18+; the unit checks use native TypeScript stripping.

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

Open http://localhost:3000. Work is local on `feat/cinematic-portfolio`; it has not been pushed or publicly deployed.

## Personal content and artwork

Identity, email, LinkedIn, professional focus and background are taken from [the GitHub profile README](https://github.com/5erax/5erax/blob/main/README.md), read on 2026-10-08. Selected work is ProZ0, MediMate AI and FinGenie, with additional links to GeoConnect, CVmate, Ecommerce Mobile and MLN Web. No client attribution, institutional name, product metrics or individual ownership of team outcomes is assumed.

Descriptions and stacks were checked against the [ProZ0 README](https://github.com/5erax/ProZ0/blob/main/README.md), [MediMate README](https://github.com/5erax/SEP490_FE_MedicalAIAssistant/blob/main/README.md) and [FinGenie README](https://github.com/5erax/FinGenie/blob/main/README.md). The profile's Phase 1 wording for ProZ0 is older than its project README; this portfolio uses the broader, accurate status “in development” and links to the repository for current milestones.

ProZ0 and MediMate covers reuse Astraa's original SVG artwork from the profile repository. Their ambient animation loops are frozen; the portfolio owns the cut-and-reassemble transitions. Covers are illustrations, not product screenshots. FinGenie has a typographic project study rather than an invented application screenshot.

## Authored motion

Five horizontal cuts of “astraa” separate in alternating directions, shear in perspective, and reassemble while the hero is still pinned. The three-ribbon A unfolds in a matching seekable geometric study. Six alternating vertical cuts carry the previous surface into each chapter, then open onto the next. Project covers use the same registration language with individually timed image bands.

GSAP/ScrollTrigger and Lenis coordinate one reversible scroll timeline. The video stays paused; its `currentTime` follows the held hero's portion of smoothed master progress. There is no autoplay or simulated playback. Transform and clip-path animate the cuts; no per-frame React state or new rendering framework is involved. GSAP owns chapter transforms; Motion owns nested project interactions; CSS owns the orbits and the mobile ribbon toggle.

`public/media/study.mp4` is 518,548 bytes: H.264, 960 square, six seconds, 30 fps, 45 keyframes, GOP4 and fast-start metadata. The poster is 8,902 bytes. It is authored geometric artwork, pre-rendered for efficient seeking. There is no claim that the motion is unprecedented across every portfolio on the web.

Mobile uses normal document flow and a native tap-to-unfold control without downloading the video. Reduced motion uses static identity art and normal flow. Preferences can change while the page is open. Save-Data and 2G skip the video; failures leave the poster. Tickers, transforms, listeners and smooth scrolling clean up on mode changes. No artificial intro loading screen is used.

The poster uses a static Next.js image import, so its filename changes with its content. This prevents the image optimizer from serving an earlier identity after a media revision. The browser check also inspects rendered poster pixels.

The original generator is `tools/generate-study.py`. Optional regeneration needs Python, Pillow and FFmpeg on PATH, or `FFMPEG_BINARY`:

```sh
python tools/generate-study.py
```

`tools/verify-motion.mjs` is a real-browser check for visible separation, early reassembly, exact reverse paths, paused video seeking, live reduced-motion changes, actual project dialogs and mobile unfolding. It needs Playwright as an optional QA tool, not a runtime dependency. Set `PLAYWRIGHT_PATH` to its module URL if using a shared installation, and `PREVIEW_URL` to test a different preview:

```sh
node tools/verify-motion.mjs
```

## Edit

- `src/data/portfolio.ts`: personal details, real project descriptions and background.
- `src/components/identity-mark.tsx`: the three cut ribbons; keep the generator and favicon geometry in sync.
- `src/lib/use-master-timeline.ts`: centralized scroll motion and media seeking.
- `src/lib/timeline.ts`: six contiguous checkpoints and shared math.
- `src/components/projects.tsx`: real project gallery, cut artwork, gestures and native dialogs.
- `src/app/globals.css`: typography, surfaces, cuts and responsive layouts.

## Real source integrations

Adapted source is retained from VengeanceUI GlassDock, PerspectiveCarousel and SolarSystem; Animate UI Cursor/CursorFollow; ForgeUI Animated Tabs; and Nicolas Jesenberger's Uiverse physical toggle. Original authors, source links and complete notices are in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). UILora source is account/license gated and is not included. No runtime dependencies were added for this revision. These integrations belong to a personal website, not a redistributable component library or template.

## Contact

The public email `lagna0175@gmail.com` and LinkedIn link come from the profile README. The direct email link works independently of the optional form receiver.

The native form keeps validation, loading/error/success states, a honeypot, origin checks, size bounds and timeouts. An unconfigured form explicitly reports that it was not sent and retains Copy draft / Save draft. No external message was sent during verification.

Copy `.env.example` to `.env.local` and configure `CONTACT_WEBHOOK_URL` with a receiver accepting `{ name, email, message }` JSON. `CONTACT_WEBHOOK_TOKEN` is optional. Provider acceptance confirms submission, not that the recipient has read it.

See [VERIFICATION.md](./VERIFICATION.md) for current checks and measurement limits.
