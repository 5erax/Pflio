# Verification / 2026-10-07

## Passed

- `npm run build`, `npm run check`, and both native Node tests.
- Desktop chapter navigation; video time advances to approximately 0.885 seconds when entering About and reverses to approximately 0.002 seconds on return to Start.
- Technology selection, project previous/next controls, modal keyboard focus containment, Escape, focus restoration, and unchanged scroll position after close.
- Filesystem selections and keyboard-accessible Experience/Education/Now tabs.
- Contact validation and draft recovery when delivery is unconfigured. Origin rejection, successful provider acceptance, upstream failure, and the browser success state were tested against a local mock receiver. No external messages were sent.
- No horizontal overflow at 320, 390, 768, and 1024 px.
- Mobile and reduced-motion modes avoid video download and use normal vertical flow. Reduced-motion gallery controls remain functional.
- No unexpected browser console errors or unhandled runtime errors in the tested flows.
- Axe WCAG A/AA scans: no violations in the scanned desktop and mobile states.

## Final Lighthouse mobile lab run

| Category | Score |
| --- | ---: |
| Performance | 93 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Measured |
| --- | ---: |
| Largest Contentful Paint | 3.3 s |
| Total Blocking Time | 40 ms |
| Cumulative Layout Shift | 0 |

These are simulated mobile lab measurements on the local production server, not field measurements. The LCP remains above the 2.5-second good threshold; do not claim all Core Web Vitals pass. Hosting, cache warmth, device speed, and connection affect results. Real-user INP and video smoothness on low-end hardware have not been measured.

## Content and delivery limits

astraa has just started and has no external project links yet. This portfolio is the first real project; two future work spaces and education details are clearly marked pending. No personal portrait, LinkedIn URL, or receiving email was supplied. Contact delivery needs a real server-side provider configured in `.env.local` before messages can be received.

The source is committed locally on `feat/cinematic-portfolio`. It has not been pushed to GitHub or deployed publicly. The local preview is http://localhost:3000 while the preview server is running.
