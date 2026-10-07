# Third-party component notices

This is astraa’s personal portfolio application, not a component library, template, or starter product. Adaptations are integrated into this application; third-party notices and restrictions remain applicable.

Source inspected and adapted on 2026-10-08:

| Application component | Original source | Adaptation retained |
| --- | --- | --- |
| Chapter rail | [VengeanceUI GlassDock](https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/glass-dock.json) | Shared spring tooltip, directional text presence, hover lift; native buttons and Phosphor replace custom icon machinery |
| Project gallery | [VengeanceUI PerspectiveCarousel](https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/perspective-carousel.json) | Controlled moving flex track, per-slide rotation, spring, keyboard selection; responsive sizing, swipe, reduced motion, custom art added |
| Toolkit universe | [VengeanceUI SolarSystem](https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/src/components/ui/solar-system.tsx) | CSS 3D orbit and inverse billboard rotations, staggered negative delays; real tool SVGs and native selection added |
| Contextual cursor | [Animate UI Cursor primitive](https://raw.githubusercontent.com/imskyleen/animate-ui/main/apps/www/registry/primitives/animate/cursor/index.tsx) | Cursor/presence, measured follower offsets, spring 500/50/0; fixed global use, native pointer retained |
| Journey tabs | [ForgeUI Animated Tabs](https://forgeui.in/components/animated-tabs) | Shared layout highlight and spring 500/30; controlled ARIA tabs and keyboard navigation added |
| Orbit motion switch | [Uiverse toggle by Nicolas Jesenberger](https://uiverse.io/njesenberger/rude-stingray-22) · [source](https://raw.githubusercontent.com/uiverse-io/galaxy/main/Toggle-switches/njesenberger_rude-stingray-22.html) | Layered switch, inset shadows, gripped thumb; accessible label, ivory/lime palette, transform movement added |

Imports use the already-installed `motion/react` and Phosphor icons. No additional component runtime dependencies were introduced. Brand logo paths are from [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0) and the official [Motion brand](https://motion.dev); they identify the tools used, with no claim of endorsement.

UILora was inspected as a reference. No UILora source is included: its [current source access](https://www.uilora.com/pricing) requires an account and some components require a paid license.

ForgeUI permits use within personal/commercial applications and client work; it does not grant component/template redistribution rights. Animate UI prohibits selling or redistributing its original components standalone. Do not extract these adaptations into a component product.

## VengeanceUI — MIT

MIT License

Copyright (c) 2025-2026 Ashutoshx7

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Uiverse — MIT

MIT License

Copyright (c) 2023 Uiverse.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Animate UI — MIT + Commons Clause

MIT + Commons Clause License Condition

Copyright (c) 2025 Elliot Sutton

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell or redistribute the components themselves in their original form—whether alone or in a bundle.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## ForgeUI — application-use license

Copyright (c) 2025 Aman Shakya
All rights reserved.

Permission is granted to use, copy, and modify this code for personal and
commercial projects, including client work and production applications.

You may NOT:
- Repackage, redistribute, or resell this code or any modified version of it
  as a UI library, component collection, template, starter, or similar product.
- Upload this code or derivatives to other repositories, marketplaces, or
  platforms intended for distribution (free or paid).
- Claim this code or derived components as your own work.

This license grants usage rights, not redistribution rights.
