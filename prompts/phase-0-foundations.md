# Phase 0 — Foundations (run first)

Read CLAUDE.md and docs/BUILD_SPEC.md before starting. Honor every
non-negotiable rule, especially: sim core in src/game/systems/ must have ZERO
Phaser/DOM imports.

## Prompt 0.1 — Project boots
Install dependencies and make `npm run dev` serve a React shell with routes:
`/` (landing with "Enter Garage" CTA), `/race` (game page), `/garage`,
`/leaderboard`. Use react-router. Apply SPS brand tokens (orange #E8610A,
navy #0D1B2A) as CSS variables in a single tokens file. Keep the shell
minimal and clean — it will be merged into the SPS monorepo later, so no
global state libraries, no CSS frameworks; plain CSS modules or inline
tokens only.

## Prompt 0.2 — Phaser mounts in the shell
On `/race`, mount a Phaser 3 game instance inside a React component
(src/shell/components/GameCanvas.tsx) with proper create/destroy lifecycle on
route enter/leave (no leaked WebGL contexts on hot reload). Register scenes:
Boot, MainMenu, Garage, Race, Results (src/game/scenes/). Boot loads
data/ships.json, data/components.json, data/tracks.json into the Phaser
registry. Race scene renders the track described by tracks.json
("nebula-oval-01") as simple vector shapes — track surface, walls,
start/finish line — using SPS navy/orange placeholder colors. No art assets
yet.

## Prompt 0.3 — Supabase auth gate
Wire @supabase/supabase-js using .env values. Implement a useSession hook.
The /race, /garage, /leaderboard routes are hard-gated: no session → redirect
to a /login page (email magic link + Discord OAuth button). On first
authenticated visit, upsert into game_players (id = auth uid) with a chosen
handle. NOTE: this app uses the SHARED SPS Supabase instance — do not create
any non-game_ tables.

## Prompt 0.4 — Database migration 0001
Write supabase/migrations/0001_core.sql exactly per the schema stub in
supabase/migrations/README.md: game_players, game_ships, game_components,
game_player_ships, game_loadouts, game_tracks, with RLS enabled and own-row
policies for players/loadouts, public-read for catalogs. Seed game_ships /
game_components / game_tracks from the JSON files in data/ (write a seed
script scripts/seed.ts that upserts from JSON — JSON stays canonical).

## Prompt 0.5 — Deterministic sim skeleton
In src/game/systems/ create: rng.ts (mulberry32 seeded RNG), fixedStep.ts
(60Hz accumulator loop), shipPhysics.ts (pure function:
(state, input, statBlock, dt) → state — arcade model: thrust accel toward
heading, grip-limited lateral velocity bleed, turn rate, drag, wall
collision as impulse + speed penalty), raceSim.ts (orchestrates N ships over
a tick list; consumes an InputTrace = array of per-tick input bitmasks;
produces a RaceResult {finishOrder, times, stateHash}). stateHash = simple
FNV-1a over rounded state each 60 ticks. Write
tests/determinism.test.ts: same seed + same trace run twice → identical
stateHash; and a golden-master test with a recorded trace fixture.

## Definition of done (Phase 0)
- `npm run dev`: login via Supabase → /race shows the empty oval inside the
  shell with SPS branding.
- `npm run test` green, including determinism tests.
- Migration applied; seed script idempotent.
- Update prompts/PROGRESS.md.
