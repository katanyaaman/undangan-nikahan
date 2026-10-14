<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: download `antislop.md` again, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->

## Design System & UI Guidelines
For any visual, styling, typography, animations, color palette, or layout work, always consult [DESIGN.md](DESIGN.md) alongside `antislop`.

## Three.js & 3D Visual Guidelines
Whenever creating or editing 3D components, interactive visuals, background animations, or Three.js effects:
- Always read and follow the relevant skills in `skills/threejs-*/SKILL.md`:
  - `skills/threejs-fundamentals/SKILL.md` (scene setup, resize, aspect ratio, clean dispose to prevent memory leaks)
  - `skills/threejs-materials/SKILL.md` & `skills/threejs-textures/SKILL.md` (PBR, MeshPhysicalMaterial, color spaces)
  - `skills/threejs-lighting/SKILL.md` (shadows, soft lighting, ambient, directional)
  - `skills/threejs-shaders/SKILL.md` (procedural effects, glowing, particles, wave distortions)
  - `skills/threejs-postprocessing/SKILL.md` (bloom, vignette, ACESFilmic tone mapping)
  - `skills/threejs-animation/SKILL.md` (animation mixer, smooth lerping, camera transitions)
  - `skills/threejs-interaction/SKILL.md` (raycasting, responsive mobile touch & mouse interaction)
- **Zero Memory Leak Rule**: Always clean up event listeners, geometries, materials, textures, and cancel `requestAnimationFrame` when components unmount or page transitions occur.
- **Mobile Performance Rule**: Cap `devicePixelRatio` to `Math.min(window.devicePixelRatio, 2)` to ensure smooth 60fps on mobile devices.

