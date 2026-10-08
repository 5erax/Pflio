# Verification — 2026-10-08

Validated the production build at `http://localhost:3000` using isolated Chromium sessions. No external contact message was sent.

## Build and browser behavior

- `npm run check`, `npm test` (2 checks), and `npm run build`: passed.
- `tools/verify-motion.mjs`: passed. Forward/backward anime camera follows the same position; video stays paused while seeking. The gallery produces intermediate positions during continuous wheel input instead of waiting for project index changes.
- Keyboard End selects FinGenie and opens its actual case detail. Escape closes native dialogs. Visual credits are reachable and focus returns to the trigger.
- Live reduced-motion changes remove cinematic transforms, unload the video and retain normal flow. Mobile downloads no video automatically; Play/Pause works and leaving the hero pauses playback.
- Save-Data skips video loading. An intentionally failed MP4 request leaves the static poster visible.
- Responsive inspection: all six chapters at 320×844, 390×844, 768×900, 1024×720, 1440×720 and 1440×900. 36 states passed without horizontal overflow or clipped desktop content. Scoped axe WCAG 2 A/AA and 2.1 AA checks returned zero violations; zero uncaught runtime errors.

## Continuous scroll measurement

Same production-browser probe and 1440×900 viewport before/after: 110 wheel inputs of 85 px, 55 ms between inputs, then 900 ms settling. RAF records scroll position and gallery transform; PerformanceObserver records long tasks. Both runs reached the full 8,100 px scroll range.

| Observed measurement | Previous build | Revised pipeline |
| --- | ---: | ---: |
| Median frame interval | 16.7 ms | 16.7 ms |
| 95th percentile frame interval | 33.4 ms | 33.3 ms |
| Frames above 33.4 ms | 23 | 8 |
| Frames above 50 ms | 3 | 0 |
| JavaScript long tasks above 50 ms | 4 | 0 |

The gallery previously stayed still in 55 sampled frames while scroll position advanced within the measured work interval. The continuous-motion correction reduced that count to zero. A runnable regression now checks that intermediate gallery movement follows wheel input.

These are individual measurements on this host, not a guarantee of uninterrupted 60 fps on every device. The remaining delayed frames and unchanged 95th percentile are recorded explicitly. Headless recording and the instrumentation itself add overhead.

## Media and review

Local anime assets total 947,130 bytes: city WebP 135,966; Marya WebP 90,952; eye poster 19,134; seekable MP4 701,078. The three-second excerpt contains 90 frames and excludes the bright white scene cut. Static Next image imports give changed artwork new content filenames.

Media provenance, attribution, license links and adaptation details are retained in the application and THIRD_PARTY_NOTICES.md. The film excerpt and poster are CC BY-SA 4.0 adaptations; the gallery artworks are CC BY 4.0. Project artwork remains Astraa's original profile material.

React review checked transient values in refs, discrete state updates, stable effect dependencies, cleanup, no layout reads per animation frame, and native accessible controls. No additional runtime dependency was introduced.

The source archive is exported from the committed tree and excludes node_modules, build output, private environment files and scratch research downloads. The browser recording and responsive screenshots are separate preview artifacts.
