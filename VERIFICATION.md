# Verification / 2026-10-08

## Experimental studio revision

The previous torus artwork, mixed serif headings, glass bottom dock on desktop, and two pending project spaces were replaced. The current direction has an ivory cover, black personal spread, lime toolkit, black gallery, ivory journal, and lime invitation. One actual portfolio project is shown through Interface / Motion / System views. No external projects or client history are claimed.

## Passed

- Final production build, TypeScript check, both native Node tests, and diff whitespace check.
- All six scenes at 320x844, 390x844, 768x900, 1024x720, 1440x720, and 1440x900. Desktop content fits the frame; no horizontal overflow was found across the 36 states.
- Complete chapter navigation and real bidirectional video seeking: approximately 0.886 seconds at About, returning to approximately 0.005 seconds at Start. The video remains paused.
- Gallery centering at all three views on 390px and 1440px: measured center error 0px. Previous/Next, Home/End/Left/Right, touch gestures, and actual mouse drag with accidental-click suppression pass.
- Case-study modal focus containment, Escape, focus restoration, and preserved scroll position.
- Nine toolkit controls with actual mouse clicks, mobile touch taps, and keyboard focus/Enter. Sixteen moving-orbit hit-test samples per pointer mode found no intercepted centers. Pause/resume freezes/restarts the source transforms; Work to Toolkit restores the exiting diagram.
- Source rail tooltip handoff and keyboard labels, native pointer fallback, bounded decorative follower, dynamic reduced-motion preference, mobile diagram-before-inspector order, and real repository link.
- Journal file selection and roving Experience/Education/Now tabs. File buttons use their native accessible names. Graphic gallery plates are separated from their button labels.
- Mobile/reduced-motion normal flow, no video download, disabled orbit motion under reduced motion, and functional project controls.
- Contact native validation, unconfigured delivery error, retained draft, and Copy / Save draft controls. Provider success/upstream failure/origin rejection were previously checked against a local mock; the server boundary is unchanged in this revision. No external message was sent.
- Axe WCAG A/AA scans: zero violations in scanned desktop/mobile scenes, toolkit states, gallery views, and case dialogs. A final 320px WCAG 2.2 scan also passes; gallery selectors have at least 24x44px targets. Automated scans are not a complete manual accessibility certification.
- No unhandled runtime errors in tested flows.
- Delivered generator replay: 960-square H.264, 180 frames, six seconds, 30fps, 45 keyframes, GOP4, fast-start metadata, full decode, changing geometry, safe padding, and forward/backward seek samples. Video 598,370 bytes; poster 4,118 bytes.

## Final isolated Lighthouse mobile lab run

| Category | Score |
| --- | ---: |
| Performance | 88 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Measured |
| --- | ---: |
| Largest Contentful Paint | 3.0 s |
| Total Blocking Time | 290 ms |
| Cumulative Layout Shift | 0.004 |

The visible-label and target-size audits pass after the final fixes. These are simulated mobile measurements on the local production server. LCP remains above the 2.5-second good threshold; a complete Core Web Vitals pass is not claimed. Field INP, hosting performance, and low-end video smoothness have not been measured.

## Delivery

Six genuine source adaptations and their original licenses are documented in `THIRD_PARTY_NOTICES.md`. UILora source is account/license gated and is not included. No new runtime dependencies were added.

The contact receiver still needs configuration because no receiving email/provider was supplied; GitHub is the available contact link. The repository is committed locally on `feat/cinematic-portfolio`, not pushed or publicly deployed. The current local production preview is http://localhost:3000/ while its server remains running.
