# Verification — 2026-10-08 / shader revision

Production build at http://localhost:3000, tested with isolated Chromium. No external contact message was sent.

## Build and real browser checks

- npm run check, npm test (2 existing boundary/timing checks), npm run build: passed.
- tools/verify-motion.mjs: passed. Instrumented real WebGL draw calls and shader uniforms, bounded backbuffer, pointer depth camera, paused reversible video and shader reveal, atmosphere pause with zero idle draws, context loss fallback and restoration, and zero offscreen draws.
- All three About folio controls select the correct real project and open its corresponding case dialog. Continuous gallery wheel input produces intermediate positions. Keyboard End selects FinGenie; Escape closes dialogs. Visual credits remain accessible.
- Live reduced motion unloads video and removes the GPU scene and cinematic transforms. Save-Data skips automatic video and GPU work. Mobile downloads no video automatically; opt-in Play/Pause works and leaving the hero pauses the film. Failed MP4 keeps the city shader; absent WebGL retains DOM media.
- All six chapters passed at 320×844, 390×844, 768×900, 1024×720, 1440×720 and 1440×900: 36 states, no horizontal overflow, clipped desktop content, scoped axe WCAG 2 A/AA or 2.1 AA violations, or uncaught runtime errors. The final About-only cover-fit refinement is checked again at these six sizes.

## Continuous scrolling

Same input probe: 1440×900, 110 wheel inputs of 85 px with 55 ms gaps, then 900 ms settling. All runs reach the full 8,100 px scroll range. RAF records frame intervals and gallery positions; PerformanceObserver records JavaScript long tasks. The shader run used ANGLE / SwiftShader, a software WebGL renderer; these results do not establish hardware GPU performance or guarantee 60 fps on every device.

| Observed measurement | Previous build ee0022b | First shader run | Final folio revision |
| --- | ---: | ---: | ---: |
| Recorded frames | 674 | 679 | 753 |
| Median frame interval | 16.7 ms | 16.7 ms | 16.7 ms |
| 95th percentile frame interval | 33.3 ms | 16.8 ms | 16.7 ms |
| Frames above 33.4 ms | 8 | 9 | 0 |
| Frames above 50 ms | 0 | 0 | 0 |
| JavaScript long tasks above 50 ms | 0 | 0 | 0 |

These are individual runs; the first shader run had 9 delayed frames and the final artwork run had zero. Both observations are retained to show run-to-run variation. The shader adds GPU effects while this probe still reports no frames above 50 ms or long JavaScript tasks. It does not justify claiming universally smoother performance. Browser recording is a separate run and is excluded from the measurements.

## Implementation and provenance

The native WebGL scene uses one full-screen draw pass, an authored bounded 2.5D depth field, moving smoke/fog/light and three rain planes. This is stylized depth, not reconstructed 3D geometry. Ripple GLSL adapts VengeanceUI's MIT RippleDisplacementSlider. No Three.js or other runtime library was added.

The backbuffer starts at a maximum of about 420,000 pixels and scales down on slow frame delivery. Texture uploads follow decoded video frames or completed seeks. Resize, visibility, pointer, preference, decoded-frame, context and RAF callbacks are cleaned up. Transient camera/time/scroll data stays outside React state. A Pause atmosphere control stops idle drawing while retaining user-driven scroll/video responses. Native controls and reduced motion remain available.

The prior CSS cleanup had removed import at-rules; Tailwind and Lenis's recommended CSS imports were restored. No additional scroll owner or scrub easing was introduced.

Media totals 856,178 bytes: city WebP 135,966; eye poster 19,134; seekable MP4 701,078. The unused Marya portrait was removed with its obsolete on-page credit. Morevna authors, sources, licenses and shader adaptations remain in Visual credits and THIRD_PARTY_NOTICES.md. The film and poster are CC BY-SA 4.0; the city is CC BY 4.0. ProZ0 and MediMate cover art comes from Astraa's profile repository.

The new browser recording shows pointer depth, forward/reverse shader transition, About folio selection and full-page scrolling. The source ZIP is exported from the committed tree, excluding dependencies, build output, private environments and scratch research media.
