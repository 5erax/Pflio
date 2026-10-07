# Verification / 2026-10-08

## Passed

- Production build, TypeScript, both native Node tests, and diff whitespace checks.
- All desktop chapter navigation and reversible video scrubbing. About advances video to approximately 0.883 seconds; returning to Start reverses to approximately 0.007 seconds.
- Nine toolkit selections with mouse, keyboard, and genuine mobile touch taps. Sixteen rotation hit-test samples per width found no intercepted centers. The physical toggle freezes/resumes orbit transforms. Work → Toolkit restores the exiting field correctly.
- Sourced dock tooltip handoff, keyboard tooltips, bounded cursor follower, native pointer fallback, and live system reduced-motion changes.
- Gallery centering within 0.008 pixels at tested widths; clamped controls, Home/End/Left/Right, touch swipes, and mouse drag with accidental click suppression.
- Pending artwork titles/notes do not overlap at 1440×900 or 1440×720. Mobile case artwork fits its square frame.
- Native modal focus containment, Escape, focus restoration, and unchanged scroll position after close.
- Filesystem selections and keyboard-accessible Experience/Education/Now tabs.
- Contact validation and draft recovery when delivery is unconfigured. Provider acceptance/upstream failure/origin rejection were verified against a local mock in the first iteration; no external message was sent. The contact server boundary was unchanged in this revision.
- No horizontal overflow at 320, 390, 768, 1024, and 1440 pixels. Mobile overflow is compared with the actual viewport/client width, not an expanded `innerWidth`.
- Mobile/reduced-motion avoid video download and use normal vertical flow. Reduced-motion disables orbit rotation and decorative cursor; project controls remain functional.
- No unexpected console errors or unhandled runtime errors in tested flows.
- Axe WCAG A/AA scans: zero violations in scanned desktop/mobile page states, toolkit states, pending galleries, and pending case dialogs. This is automated coverage, not a complete manual accessibility certification.

## Final isolated Lighthouse mobile lab run

| Category | Score |
| --- | ---: |
| Performance | 90 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Measured |
| --- | ---: |
| Largest Contentful Paint | 3.5 s |
| Total Blocking Time | 80 ms |
| Cumulative Layout Shift | 0 |

These are simulated mobile measurements on a local production server. LCP remains above the 2.5-second good threshold; all Core Web Vitals are not claimed to pass. Hosting, caching, device speed, and connection affect results. Field INP and low-end video smoothness have not been measured.

## Source and content

Six genuine source adaptations are documented with original notices in `THIRD_PARTY_NOTICES.md`: three VengeanceUI components, Animate UI Cursor/CursorFollow, ForgeUI Animated Tabs, and Uiverse's physical toggle. UILora source is account/license gated and is not included. No new runtime dependencies were added.

astraa is starting from zero. This portfolio is the first real project; two future work spaces and education details remain clearly pending. A receiving contact provider has not been supplied, so delivery needs configuration in `.env.local`; GitHub is the available contact link.

The source is committed locally on `feat/cinematic-portfolio`; it has not been pushed or publicly deployed. Preview is http://localhost:3000 while the local production server is running.
