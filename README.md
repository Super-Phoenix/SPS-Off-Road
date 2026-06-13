# Phoenix Racer

A Super Off Road–style top-down arcade racer with licensed Star Atlas ships
and components, built by Super Phoenix Sports Inc. (SPS) as a gated module of
the SPS website.

**IP status:** ATMTA grant secured (full use, broadcast + monetization; 5%
net royalty above $1M cumulative gross; revocable in writing with notice).

## Quick start

```bash
npm install
cp .env.example .env   # fill in Supabase keys
npm run dev            # client shell + game
npm run test           # sim determinism tests
```

## Building with Claude Code

1. Read `CLAUDE.md` (Claude Code does this automatically).
2. Open `prompts/phase-0-foundations.md` and execute it.
3. Track completion in `prompts/PROGRESS.md`; proceed phase by phase.

## Documents

| Doc | Purpose |
|---|---|
| `docs/BUILD_SPEC.md` | Canonical end-to-end build specification (v2.0) |
| `docs/ROYALTY_SPEC.md` | ATMTA royalty tracking & governance |
| `docs/COST_APPENDIX.md` | Cost & procurement appendix |
| `docs/GATES.md` | Live gate status board |

## Architecture in one paragraph

Phaser 3 client inside a React shell, embedded in the SPS site behind the
shared SPS Supabase auth. The simulation core (`src/game/systems/`) is pure,
deterministic TypeScript shared by the client and a headless server harness:
ranked results are accepted only when server re-simulation of the submitted
input trace reproduces the claimed result. Content (ships/components/tracks)
is data-driven JSON so licensed assets remain swappable. All game tables are
namespaced `game_*` in the shared SPS database; revenue events carry IP
attribution tags feeding the ATMTA royalty counter.
