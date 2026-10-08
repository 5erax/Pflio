# Astraa portfolio — review checkpoint, 2026-10-08

This checkpoint preserves the complete working portfolio before further visual revisions. It is a review snapshot, not a claim that the art direction has received final approval.

## Identity and content

- Astraa / GitHub `5erax`, a fullstack developer in Vietnam. Identity, background, public contact details and project links come from the owner's profile README.
- Six chapters: Start, About, Toolkit, Work, Journey and Contact.
- Featured projects: ProZ0, MediMate AI and FinGenie. Four additional repositories are linked. Case descriptions distinguish active development, public deployments and source-only projects; no client results or success metrics are invented.

## Design and motion preserved

- Experimental studio direction: cream, black and coral, sharp typography, asymmetric composition, an identity glyph and chapter rail.
- Native WebGL anime scene with bounded 2.5D parallax, animated smoke, fog, light and three rain planes. The city-to-film transition adapts VengeanceUI's MIT ripple GLSL.
- One Lenis/GSAP scroll timeline drives chapter transitions, paused video seeking and continuous project-gallery travel. The shader reads that same progress; ambient time and pointer camera movement stay outside React state.
- About uses selectable physical folio sheets for Worlds / ProZ0, Interfaces / MediMate AI and Systems / FinGenie. Each selection exposes factual implementation details, its repository and the corresponding case dialog.
- Toolkit retains the interactive orbit view; Journey retains keyboard-accessible tabs. Native project and contact dialogs preserve focus and Escape behavior.
- The atmosphere can be paused. GPU drawing stops offscreen and in hidden tabs; the bounded backbuffer lowers resolution on slow frame delivery. Decoded-frame texture uploads, context recovery and effect cleanup remain in place.
- Mobile uses normal flow and opt-in film playback. Live reduced motion, Save-Data, unavailable WebGL and failed media requests retain usable fallback content.

## Assets and application boundaries

- All runtime source, configuration, lockfile, tests and required media are tracked in this repository. Installed dependencies, build output, private environment files and scratch research downloads are excluded.
- Morevna city artwork: CC BY 4.0. Film excerpt and poster: CC BY-SA 4.0. Authorship, adaptation details and links remain in Visual credits and `THIRD_PARTY_NOTICES.md`.
- ProZ0 and MediMate illustrations are the owner's original profile artwork. The unused anime portrait has been removed.
- VengeanceUI, ForgeUI, Animate UI and Uiverse application adaptations retain their source notices. UILora source is not included because its access requires an account/license.
- Direct email is available. The optional contact form needs a configured webhook receiver; an unconfigured submission reports that it was not sent and offers a saved/copied draft. No external contact message was sent during verification.

## Validation and limits

- Type checking, the two existing timing/contact boundary checks and the production build passed.
- The runnable browser regression covers actual WebGL draws/uniforms, reversible shader/video progress, atmosphere pause, context recovery, offscreen idle, all three folio cases, continuous gallery movement and media/GPU/motion fallbacks.
- Six chapters across six viewport sizes: 36 states, no horizontal overflow, clipped desktop content, scoped axe WCAG violations or uncaught runtime errors. The final About artwork refinement was rechecked at the same sizes.
- Full 8,100px scroll probes recorded a 16.7ms median and no frames above 50ms or long JavaScript tasks. The first shader run had nine intervals above 33.4ms; the final artwork run had zero. These are individual Chromium/SwiftShader observations, not a universal hardware performance guarantee. See `VERIFICATION.md` for the full comparison.
- Depth is an authored 2.5D field rather than reconstructed 3D geometry. Artistic originality, composition, transitions, content hierarchy and polish remain subject to the owner's next review.

## Preserved implementation history

| Commit | Checkpoint |
| --- | --- |
| `353aad8` | Initial cinematic portfolio from the empty repository |
| `089c48e` | Browser verification and measured performance limits |
| `b4c57ec` | Sourced UI integrations and portfolio materials |
| `853f75d` | Experimental studio redesign |
| `3564945` | Profile content and reversible cut-ribbon motion |
| `ee0022b` | Licensed anime media and continuous scroll correction |
| `7245840` | GPU anime scene and redesigned About folio |
| `dc0442a` | Shader attribution grouped with component sources |

The owner's request at this checkpoint is to commit and push the complete current work, then continue improvements later. No additional design change or deployment is part of this checkpoint.
