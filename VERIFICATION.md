# Verification / 2026-10-08

## Cut-ribbon motion revision

The six-arm asterisk, artificial boot screen, generic fade entrances and invented first-project narrative were removed. The custom open A has three folded ribbons; cut lettering, chapter shutters and project artwork share one motion language. Personal content now follows the GitHub profile README and linked project README files.

## Passed on the final production build

- TypeScript check, optimized production build, both native Node tests and diff whitespace checks.
- `tools/verify-motion.mjs`: lettering visibly separates at master progress 0.017 and reassembles before the hero unpins; reversing to the same progress restores every band's position within 1px. Returning to zero restores the media frame within 0.1s. The video remains paused throughout.
- Actual chapter navigation advances the six-second study to about 5.967s, then seeks back to about 0.016s at Start. The hero study is mapped to the held cover interval rather than waiting until the cover has left the screen.
- Live reduced-motion changes remove chapter transforms, hide shutters, unload video and switch to normal flow. Switching back restores the centralized timeline.
- Static fallback inspection caught an old asterisk in the image-optimizer cache. A content-hashed static import fixes the source of stale delivery. The real-browser check verifies the new poster's pixels; reduced-motion visual inspection confirms the open A.
- Mobile tap-to-unfold and reassemble updates `aria-pressed`, uses the authored SVG geometry and does not load the video. Reduced motion hides that control and retains static art.
- All six scenes at 320x844, 390x844, 768x900, 1024x720, 1440x720 and 1440x900: 36 layout states, no horizontal overflow, scanned desktop content within the frame, zero runtime errors.
- Real project gallery at 390px and 1440px: ProZ0, MediMate AI and FinGenie centered at all three indices, measured center error 0px. Previous/Next, Home/End/Left/Right, touch gestures and mouse dragging work. Dragging suppresses the subsequent card click.
- The selected project opens its own correct story and repository link. Native dialogs contain focus, close with Escape, restore focus and preserve scroll position.
- Toolkit keyboard selection, orbit pause/resume, journal date selection and roving Experience/Education/Now tabs remain functional. The sourced orbit mechanics and pointer layers are retained.
- Desktop/mobile complete-flow Axe A/AA scans, all 36 chapter scans, gallery states and dialogs: zero violations in scanned states. A separate 320px WCAG 2.2 scan and target-size check also pass. These checks are not a full manual accessibility certification.
- Contact validation, explicit unconfigured delivery failure, retained draft and Save draft remain functional. Direct public email and LinkedIn links now come from the profile README. No external message was sent. The unchanged server boundary previously passed provider acceptance/failure and origin-rejection checks against a local mock.
- Original media generator: H.264, 960 square, 180 frames, six seconds, 30fps, 45 keyframes, GOP4, fast-start metadata, full decode, changing fold geometry, safe padding, forward/reverse seek samples and exact repeated first-frame decoding. Video: 518,548 bytes; poster: 8,902 bytes.

## Final isolated Lighthouse mobile lab run

| Category | Score |
| --- | ---: |
| Performance | 95 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Measured |
| --- | ---: |
| Largest Contentful Paint | 2.9 s |
| Total Blocking Time | 30 ms |
| Cumulative Layout Shift | 0 |

Visible label/accessibility-name matching and target-size audits pass after the mobile toggle correction. Measurements use simulated mobile conditions on the local production server; LCP remains above 2.5s. Field INP, hosting conditions, physical-device smoothness and low-end video decoding have not been measured.

## Delivery

`README.md` documents the factual GitHub sources, authored motion, optional browser check and media regeneration. `THIRD_PARTY_NOTICES.md` preserves all source component licenses and identifies the owner's original project covers. No runtime dependency was added.

The actual browser recording is delivered as `astraa-motion-preview.webm`, alongside current screenshots and a source ZIP. The portfolio remains locally committed on `feat/cinematic-portfolio`, without a push or public deployment. The preview is http://localhost:3000/?motion=2 while the local server is running. Direct email works; the optional form receiver still needs its webhook configuration.
