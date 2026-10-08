# astraa / Interfaces in motion

Personal portfolio for Astraa, a fullstack developer in Vietnam. Identity, contact details, background and selected projects are grounded in [5erax’s profile README](https://github.com/5erax/5erax). Projects: ProZ0, MediMateAI and FinGenie, plus four linked repositories. No invented client results or metrics.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build` then `npm start`. Validation: `npm run check` and `npm test`.

## Anime art and motion

The hero pairs a Morevna cyberpunk background with a silent film excerpt. About uses Anastasia Mayzhegisheva’s Marya illustration. Original artists, sources, licenses and media changes appear in the site's **Visual credits** dialog and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

The MP4 and extracted poster are adaptations under CC BY-SA 4.0; the two gallery artworks are CC BY 4.0. These licenses apply to the identified media, with no implied endorsement. Artwork is visually cropped through CSS and technically resized/encoded; no generated replacement art is used.

Desktop uses one GSAP/ScrollTrigger timeline following Lenis's eased position. Static diagonal masks, camera transforms and continuous project travel follow that same position. Video stays paused and its `currentTime` follows the held hero. Scrolling backwards retraces both camera and film. There is no second scrub easing or per-frame React state. Orbit animation pauses through Lenis's existing scroll class, then resumes where it stopped.

Mobile uses normal document flow and a native opt-in Play/Pause film button. Reduced motion uses posters and normal flow; live preference changes remove cinematic transforms. Save-Data/2G skips automatic video loading. A failed video keeps the poster visible. No artificial loading screen.

`anime-eye.mp4`: 960×540, three seconds, 30 fps, H.264 GOP4 and fast-start metadata. Static Next image imports give revised posters fresh content filenames.

## Edit

- `src/data/portfolio.ts`: personal details and real projects.
- `src/components/experience.tsx`: anime composition, chapters and visual credits.
- `src/lib/use-master-timeline.ts`: scroll camera, project travel and video seeking.
- `src/lib/timeline.ts`: chapter ranges, continuous project position and media bounds.
- `src/app/globals.css`: responsive composition and animation fallback.

## Browser regression

`tools/verify-motion.mjs` checks reverse camera/film seeking, intermediate gallery positions during wheel input, real project dialogs, attribution, live reduced motion and mobile opt-in playback. Playwright is an optional QA dependency. Supply `PLAYWRIGHT_PATH` as a module URL and `PREVIEW_URL` to test a different server:

```sh
node tools/verify-motion.mjs
```

## Component sources

Application adaptations retain VengeanceUI GlassDock, PerspectiveCarousel and SolarSystem; Animate UI Cursor/CursorFollow; ForgeUI Animated Tabs; and Nicolas Jesenberger's Uiverse physical toggle. Notices and restrictions remain in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). UILora source requires account/license access and is not included. These are integrations into a personal application, not a component-library product. No runtime dependency was added for this revision.

## Contact

The public email `lagna0175@gmail.com` and LinkedIn link come from the profile README. Direct email works independently of the optional form receiver.

The form keeps validation, pending/error/success states, a honeypot, origin checks, size limits and timeouts. Without configuration it reports that the message was not sent and offers Copy draft / Save draft.

Copy `.env.example` to `.env.local` and configure `CONTACT_WEBHOOK_URL` with a receiver accepting `{ name, email, message }` JSON. `CONTACT_WEBHOOK_TOKEN` is optional. No external message was sent during verification.

See [VERIFICATION.md](./VERIFICATION.md) for measurements and their limits.
