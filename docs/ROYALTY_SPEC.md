# ATMTA Royalty — Tracking & Governance Spec (summary)

Grant: full Star Atlas IP use, all aspects, broadcast + monetization. 5% of
net revenue above $1,000,000 cumulative gross earnings. Revocable in writing
with advance notice.

## Counters
- **CG (Cumulative Gross):** running sum of IP-attributable gross since
  inception. Never resets.
- **RA (Royalty Accrued):** 5% × attributable net earned after CG > $1M.

Straddle rule: the period that crosses $1M is split pro-rata at the crossing;
only the post-crossing portion is royalty-bearing.

## Attribution boundary
Pursue PRODUCT-SCOPED boundary with ATMTA in writing: only game-attributable
revenue counts. Implemented via revenue-ledger tagging:
`ip_attributable (bool), attribution_basis (enum), allocation_pct, revenue_type`.
Namespaced `game_*` tables keep game revenue cleanly separable from non-IP
SPS revenue (betting etc.).

## Definitions to lock with ATMTA (GATE-ROYALTY — do this NOW)
Gross: attributable-only? accrual vs cash? refunds netted? non-cash valuation?
cumulative confirmed? Net deduction stack (propose): processing fees, platform
fees, prize payouts, refunds, taxes collected — yes; sponsor servicing +
allocable infra — negotiate; marketing/CAC + overhead — no. Allocation rule
for blended sponsorships: one documented basis, applied consistently.
Revocation: notice period (days)? accrued obligations survive? wind-down for
in-flight tournaments?

## Ledger
Append-only `royalty_ledger`: event_date, revenue_event_id, gross, net,
cg_before/after, royalty_bearing_net, royalty_delta, status
(accrued|invoiced|paid|adjusted), note. Balances are SUMs, never mutable.

## Governance
Alert ladder: 80% ($800K) YELLOW / 95% ORANGE / 100% TRIGGERED.
CG/RA tile in weekly snapshot + BCC dashboard. CDR entry FIN-2026-ROY-001.
Definitions lock = Type-2 / Three-Gate (CFO Gate 1 + GC Gate 2).
Dual-regime pricing: anything priced to live past $1M uses post-threshold
(5%-net) margin.
