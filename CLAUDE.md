# CLAUDE.md — Phoenix Racer

## What this project is

Phoenix Racer is a browser-native, top-down arcade racing game modeled on the
1989 arcade title Super Off Road, reskinned with **licensed Star Atlas ships
and components** (ATMTA grant: full IP use, broadcast + monetization; 5% net
royalty above $1M cumulative gross). It is a product of Super Phoenix Sports
Inc. (SPS) and is **embedded as a gated module inside the SPS website** —
shared account system, shared Supabase, shared brand.

Read `docs/BUILD_SPEC.md` before any non-trivial task. It is the canonical
specification. `docs/ROYALTY_SPEC.md` and `docs/COST_APPENDIX.md` cover the
royalty instrumentation and procurement posture.

## Non-negotiable architecture rules

1. **Server-authoritative results.** The client renders; the server decides.
   Every ranked result is verified by headless re-simulation
   (`src/server/sim/`) using the same deterministic engine as the client.
   Never trust a client-claimed result.
2. **Deterministic simulation.** Fixed timestep (60Hz logical tick).
   Same seed + same input trace = identical result, every machine. No
   `Math.random()` in sim code — use the seeded RNG in
   `src/game/systems/rng.ts`. No floating-point divergence shortcuts.
3. **Data-driven content.** Ships, components, and tracks are JSON config in
   `data/` plus asset references. Game logic references internal ids only.
   **No Star Atlas names or assets hardcoded in logic** — the ATMTA grant is
   revocable with notice, and an asset swap must be a content migration, not
   a rebuild.
4. **Append-only ledgers.** Credits balance = SUM(deltas). Never a mutable
   balance field. Same pattern the royalty ledger uses.
5. **Namespaced tables.** All game tables are prefixed `game_` in the shared
   SPS Supabase instance. Game revenue events carry `ip_attributable` tagging
   (feeds the ATMTA royalty counter — see ROYALTY_SPEC).
6. **Gate the rewards, not the page.** Route gating is UX; server-side
   validation against the authenticated user is the integrity boundary.

## Stack

- **Game client:** Phaser 3 + TypeScript, mounted in a React shell
- **Shell:** React + Vite (stands alone here; will be merged into the SPS
  monorepo as a lazy-loaded module — keep imports clean and self-contained)
- **Backend:** Supabase (Auth JWT, Postgres + RLS, Realtime, Edge Functions)
- **Multiplayer (Phase 2):** Colyseus authoritative rooms — do NOT build in
  Phase 0/1, but keep the sim engine transport-agnostic so it can run inside
  a Colyseus room later
- **Jobs (Phase 3):** Inngest

## Repo layout

```
data/                 ships.json, components.json, tracks.json (canonical content)
docs/                 BUILD_SPEC, ROYALTY_SPEC, COST_APPENDIX (markdown)
prompts/              Phase-by-phase Claude Code prompt sequence — run in order
src/game/             Phaser client (scenes, entities, systems, config)
src/game/systems/     Deterministic sim core — SHARED with server (no DOM/Phaser imports!)
src/server/sim/       Headless re-simulation harness (imports src/game/systems)
src/server/api/       Result submission, seed issuance, garage transactions
src/shell/            React shell pages/components (menu, garage, leaderboard)
supabase/migrations/  game_* schema, RLS policies
scripts/              Sprite pipeline (GLTF → 8-direction sheets), utilities
tests/                Determinism tests, sim golden-master tests
```

**Critical constraint:** everything in `src/game/systems/` must be pure
TypeScript with zero Phaser/DOM dependencies, because `src/server/sim/`
imports it for headless verification. Phaser touches it only through
`src/game/entities/` adapters.

## Brand

SPS orange `#E8610A`, navy `#0D1B2A`. Game UI inherits SPS tokens.

## Conventions

- TypeScript strict mode. No `any` in sim code.
- Stat modifiers are data (see `data/components.json` schema) — additive
  (`add`) and multiplicative (`mult`) keys; applied in that order.
- Every Supabase write that affects rank/credits goes through a server
  function (service role) — never direct client writes (RLS enforces this).
- Tests for the sim core are mandatory: determinism test (same seed/inputs →
  identical hash) must pass before any physics change merges.

## Phase status

Track progress in `prompts/PROGRESS.md`. Current phase: **Phase 0**.
Run prompts in order: `prompts/phase-0-foundations.md` → `phase-1-*.md` → ...
Do not start Phase 2 work until GATE-FEEL and GATE-AUTHORITY are marked
passed in PROGRESS.md.
