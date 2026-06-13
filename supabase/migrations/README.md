# Migration plan (Claude Code: implement per phase prompts)

All tables prefixed `game_` (shared SPS instance). RLS ON everywhere.

## 0001_core.sql (Phase 0)
- game_players(id uuid PK = auth.uid(), handle text unique, region text,
  status text default 'active', created_at)
- game_ships / game_components / game_tracks (catalogs; public read,
  service-role write; seeded from /data JSON)
- game_player_ships(player_id, ship_id, source text, acquired_at)
- game_loadouts(id, player_id, ship_id, components jsonb, updated_at)
- Policies: players/loadouts own-row; catalogs read-all.

## 0002_economy.sql (Phase 1)
- game_credit_ledger(id, player_id, delta bigint, reason text, ref_id uuid,
  created_at) — APPEND ONLY: no UPDATE/DELETE policies, no client INSERT.
- view game_credit_balance AS select player_id, sum(delta) ...
- fn purchase_component(p_component_id) SECURITY DEFINER: balance check →
  negative delta → grant. Atomic.

## 0003_racing.sql (Phase 1)
- game_races(id, mode, seed bigint, track_id, status, created_at)
- game_race_results(race_id, player_id, position, time_ms, state_hash text,
  verified bool default false) — insert via service role only.
- game_leaderboards(season_id, scope, player_id, points, rank)
- game_audit_log(id, actor, action, payload jsonb, created_at) — write-only.

## 0004_tournaments.sql (Phase 3)
- game_tournaments(id, name, format, starts_at, status, eligibility jsonb)
- game_tournament_entries(tournament_id, player_id, seed int, entry_state)

## Revenue tagging (Phase 3, per docs/ROYALTY_SPEC.md)
Revenue events table (or columns on SPS revenue ledger):
ip_attributable bool, attribution_basis text, allocation_pct numeric
default 100, revenue_type text. Feeds the ATMTA royalty counters.
