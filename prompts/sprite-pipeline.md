# Parallel Track — Sprite Pipeline (any time after Phase 0)

## Prompt SP.1
Build scripts/render-sprites.ts (or a Blender headless Python script in
scripts/) that takes a licensed Star Atlas ship GLTF and renders an
8-direction top-down sprite sheet (N, NE, E, ... at 45° steps) at 128px,
with a consistent camera/lighting rig, alpha background, packed via a simple
atlas JSON Phaser can consume. Output to public/assets/ships/<shipId>/.
Ship JSON in data/ships.json references the atlas path — NEVER hardcode
asset paths in game logic (asset-swappable rule, CLAUDE.md #3).
