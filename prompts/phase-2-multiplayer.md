# Phase 2 — Live Multiplayer (BLOCKED until GATE-FEEL + GATE-AUTHORITY pass)

## Prompt 2.1 — Colyseus room
Add a colyseus server package (separate process, src/server/ or /server
workspace). RaceRoom: authoritative fixed-tick loop RUNNING THE SAME
raceSim core. Clients send input bitmasks; server broadcasts authoritative
state snapshots at 20Hz; server decides finish order. Supabase JWT verified
on room join (onAuth).

## Prompt 2.2 — Client prediction
Client predicts locally with the shared sim, reconciles to server snapshots
(rewind-replay buffer). Interpolate remote ships. Degrade gracefully at
150ms+ RTT.

## Prompt 2.3 — Lobby
Lobby page: open rooms, create/join (2–4 players), ready-up, countdown.
Presence via Colyseus; persistence of results via the SAME submit pipeline —
the room server submits to the results API with a server credential, so
multiplayer results are first-class verified records.

## Prompt 2.4 — Hardening
Disconnect/rejoin (Colyseus 0.17 reconnection), input rate clamping,
server-side input validation (bitmask range), per-account concurrent-session
limit. Load test: 10 concurrent rooms.
