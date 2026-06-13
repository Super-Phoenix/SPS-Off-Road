# Phoenix Racer — End-to-End Build Specification (v2.0)

> Markdown distillation of the canonical v2.0 Word document for in-repo use.
> Status: IP CLEARED (ATMTA) — royalty + SPS website integration incorporated.

## 0. Executive summary

Browser-native top-down arcade racer modeled on Super Off Road. Trucks →
Star Atlas ship hulls; tire/shock/nitro upgrades → ship components. Embedded
as a gated module of the SPS website: one account, one brand, one data layer.
Ship sequence: single-player → async leaderboard → live multiplayer →
tournament mode. Server authority from day one.

**IP:** ATMTA granted full use, all aspects, broadcast + monetization, in
writing. No royalty below $1M cumulative gross earnings; 5% of net revenue
above. Revocable in writing with advance notice → asset-swappable
architecture is mandatory (Section 9).

## 1. Product & game design

Core loop: login → select ship → race (2–4 racers, overhead cam, boosts) →
earn credits → garage upgrades → repeat.

Mapping: truck=hull (class drives base stats), tires=maneuvering components,
shocks=hull/structural, nitros=boost charges, money=non-redeemable race
credits (closed economy at launch — compliance posture), dirt oval=asteroid
circuit.

Per-ship stat block: `maxSpeed, acceleration, gripFactor, turnRate,
boostPower, boostDuration, mass`. Components apply add/mult modifiers from
JSON config. Determinism required (fixed timestep, seeded RNG).

Modes: Time Trial + Practice + Ranked Async (Phase 1); Live Multiplayer
(Phase 2); Tournament + Spectator (Phase 3).

## 2. System architecture

- Client game: Phaser 3 + TS. Client shell: existing SPS React app (module).
- Hosting: SPS web host, game at an SPS route (e.g. /race).
- Auth: shared SPS Supabase Auth (one account). DB: shared Supabase Postgres,
  game tables namespaced `game_*`, RLS everywhere.
- Realtime: Supabase Realtime (leaderboard, lobby, tournament state).
- Multiplayer (Phase 2): Colyseus authoritative rooms.
- Jobs (Phase 3): Inngest. Wallet: existing SPS Solana adapter (optional).

Solo ranked flow: auth → middleware gate → server-issued seed → local race +
input trace → submit {seed, trace, claim, loadout, JWT} → headless re-sim →
on match: atomic write (results + leaderboard + credit ledger) → Realtime push.

### 2.4 SPS website integration
Game is a module of the SPS site, NOT a separate property. Single SPS
identity (no separate registration). Inherits SPS nav/brand
(#E8610A / #0D1B2A). Tables namespaced `game_*` for clean separability —
this also serves the royalty attribution boundary. Code: lazy-loaded module
in the SPS monorepo; Phaser canvas mounts in an SPS page shell.

## 3. Gates

Governance: GATE-IP CLEARED, GATE-STREAM CLEARED (ATMTA grant).
GATE-ROYALTY OPEN (CFO — lock gross/net definitions with ATMTA in writing).
GATE-COMPLIANCE OPEN (GC — required before any paid/token-gated/prize mode).
GATE-PRIVACY OPEN (GC). GATE-FEEL OPEN (founder playtest). GATE-AUTHORITY
OPEN (CTO — re-sim reproduces results).

Runtime access gates (layered): public → soft (login to submit) → hard
(bundle withheld) → eligibility (registered + condition) → entry (GC-gated).
**Client-side gating is not security: gate the rewards, not the page.**

## 4. Database (Supabase, all `game_` prefixed)

players(=auth uid), wallets, ships, player_ships, components, loadouts,
credit_ledger (append-only; balance=SUM(delta)), races(seed, mode, status),
race_results(verified flag), leaderboards, tournaments, tournament_entries,
tracks, audit_log (write-only).

RLS: own-row reads/writes for players/loadouts; ledger + results written only
via service role after verification. Determinism/anti-cheat: server-issued
seeds, fixed timestep, headless re-sim, bounds checks, loadout legality
re-checked server-side.

## 5. Player funnel

Awareness → Landing → Register → First race → Rank → Retain → Compete →
Advocate. Registration = SPS account (one signup). Capture: identity
(Discord OAuth preferred), handle, region, consent flags; wallet link
deferred/optional. Spectator-to-player bridge: live in-browser viewing with
persistent "Register to race" CTA.

## 6. Build sequence

- **Phase 0 (wk 0–1):** game module inside SPS app pattern, Phaser canvas in
  page shell, scenes Boot→Menu→Garage→Race→Results, JSON data model,
  shared Supabase client + game_* tables. Deliverable: logged-in user loads
  an empty track.
- **Phase 1 (wk 1–4):** driving + collision, one oval, stat/modifier system,
  garage, append-only credit ledger, async leaderboard with headless re-sim
  verification, IP-attribution tagging on revenue events. GATE-FEEL +
  GATE-AUTHORITY.
- **Phase 2 (wk 4–8):** Colyseus authoritative room, prediction/
  reconciliation, 2–4 player simultaneous, anti-cheat hardening.
- **Phase 3 (wk 8–12):** brackets + Inngest jobs, spectator + OBS broadcast
  view, eligibility gating, signed immutable results. GATE-COMPLIANCE before
  any paid/prize event.
- **Content (parallel):** render 8-direction sprite sheets from licensed
  GLTFs; keep assets as swappable config references.

## 7. Compliance & risk (summary)

IP cleared; royalty instrumented per ROYALTY_SPEC (attribution boundary =
namespaced game revenue; two counters; GATE-ROYALTY definitions; dual-regime
pricing; 80/95/100% alert ladder). Closed soft currency at launch.
Entry+prize → GC review (sweepstakes vs skill-based). UK ad rules exclude
crypto gambling sponsors. Privacy: policy + ToS before registration launch.
Top risks: royalty base undefined at $1M (lock now), cheating (server
authority), paid mode classification (GC), netcode feel, art lift.

## 8. Where played

Primary: embedded in SPS site, desktop + mobile web. Strong: PWA. Optional:
Tauri wrapper. Caution: Capacitor mobile (store hostility to crypto).
Strategic: embedded in livestream (CCV + funnel).

## 9. License continuity (asset-swappable architecture)

Assets as config, never code; single replaceable IP-bearing content layer;
original fallback set maintained; no IP strings in immutable records.
Runbook on revocation notice: confirm window → swap content layer → settle
accrued royalty → player comms. Cosmetic change only; records survive.
