# Phase 1 — Playable Solo Loop

Prereq: Phase 0 done. Read CLAUDE.md rules again — especially server
authority and append-only ledger.

## Prompt 1.1 — Drivable ship
Bind keyboard (arrows/WASD + space=boost) to an InputTrace recorder in the
Race scene. The scene renders FROM sim state (sim is source of truth; Phaser
sprites are views). Add lap detection via ordered checkpoint crossing from
tracks.json checkpoints; 3 laps; Results scene shows time. Tune
shipPhysics constants until the reference ship feels like Super Off Road:
heavy, slidey, controllable. Expose tuning constants in
src/game/config/feel.ts with comments — the founder will iterate here.

## Prompt 1.2 — Stat blocks + components
Implement applyModifiers(baseStats, components[]): apply all `add` then all
`mult` per stat. Loadout legality checker (slot rules from components.json).
Unit tests for modifier math and slot legality.

## Prompt 1.3 — Garage
Garage scene/page: show owned ships (game_player_ships), credits balance
(SUM of game_credit_ledger deltas via a Postgres view), component shop,
fit/unfit with live stat preview, purchase via server function ONLY.
Migration 0002: game_credit_ledger (append-only, no client INSERT policy),
balance view, purchase_component(p_component_id) SECURITY DEFINER function
that checks balance, appends negative delta, grants component — atomic.

## Prompt 1.4 — AI opponents
Simple deterministic AI in the sim core: racing-line waypoint follower with
per-AI seeded skill jitter (uses rng.ts — never Math.random). 1 player + 3 AI
race. Rubber-banding OFF by default (tournament integrity) behind a config
flag for casual modes.

## Prompt 1.5 — Server-authoritative ranked submission
Migration 0003: game_races (server-issued seed), game_race_results
(verified flag), game_leaderboards. Edge Function (or Node API in
src/server/api/) `request-race`: creates a race row with a server seed,
returns {raceId, seed}. Edge Function `submit-result`: accepts {raceId,
inputTrace, claimedResult, loadout}; validates JWT, loadout legality, sanity
bounds (min plausible time); then runs the HEADLESS RE-SIM
(src/server/sim/verify.ts imports raceSim from src/game/systems — this
import working is the architectural proof) with the stored seed + submitted
trace; accept only if stateHash and finish time match exactly; write result
(verified=true), leaderboard upsert, credit reward delta — atomic. Mismatch →
reject + row in game_audit_log.
CRITICAL: also tag any future revenue-bearing events with ip_attributable
fields per docs/ROYALTY_SPEC.md (schema ready in migration comments).

## Prompt 1.6 — Leaderboard page
/leaderboard reads game_leaderboards with Realtime subscription for live
updates. Player's own row highlighted.

## Gate checks (founder + CTO, manual)
- GATE-FEEL: 15-minute playtest — is it fun? Iterate feel.ts until yes.
- GATE-AUTHORITY: 100 randomized headless verification runs, 100% match.
Record both in prompts/PROGRESS.md before Phase 2.
