# Phase 3 — Tournaments & Broadcast (GATE-COMPLIANCE before ANY paid/prize event)

## Prompt 3.1 — Tournament schema + brackets
Migration: game_tournaments, game_tournament_entries. Single-elim and
round-robin bracket engine (pure TS, tested). Eligibility JSON evaluated
server-side (account standing, optional wallet/NFT condition, region).

## Prompt 3.2 — Inngest jobs
Jobs: open registration, lock + seed brackets at T-0, advance rounds on
verified results, settle + write final standings, emit recap payload.

## Prompt 3.3 — Spectator + broadcast view
/watch/:tournamentId — live bracket + current race feed; /broadcast variant:
chromeless 1920x1080 OBS-friendly layout, SPS-branded overlays, persistent
"Register to race" CTA on the spectator (not broadcast) view —
the spectator-to-player bridge from the funnel spec.

## Prompt 3.4 — Result integrity records
Signed result records: hash chain over verified results per tournament in
game_audit_log; exportable JSON proof bundle per event.

## Prompt 3.5 — Revenue tagging goes live
Any monetized event (sponsorship attribution, entry fees IF AND ONLY IF
GATE-COMPLIANCE passed) writes revenue events with ip_attributable tagging →
feeds the ATMTA royalty counters per docs/ROYALTY_SPEC.md.
