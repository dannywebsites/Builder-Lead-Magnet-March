# Trade Survival Calculator

## What This Is

A web-based financial reality-check and quoting calculator for tradespeople and local service businesses in the UK and Ireland. Instead of guessing what to charge, it works backward from the owner's desired take-home pay to calculate the exact minimum hourly rate, monthly revenue target, and sales pipeline numbers required to stay solvent. The calculator is ungated; the downloadable PDF/email report is the lead capture mechanism.

## Core Value

The tradesperson enters what they need to take home, and the app tells them the brutal truth about what the business must generate to make that happen — no optimistic assumptions, no "perfect world" math.

## Requirements

### Validated

- [x] Project scaffolding: Next.js 15, TypeScript strict, Tailwind 4, Biome, Vitest — Validated in Phase 1: Project Scaffolding & Type Foundation
- [x] Zod validation schemas for all calculator inputs (entity type, VAT rates) — Validated in Phase 1
- [x] Currency formatting (GBP + EUR) and rounding utilities — Validated in Phase 1
- [x] Tax buffer calculation (Corp Tax for Ltd, pass-through for Sole Trader) — Validated in Phase 2: Calculation Engine
- [x] True cost of staff calculation (30% employer burden markup on base payroll) — Validated in Phase 2
- [x] 75% billable hours reality check (hard-capped, not overridable) — Validated in Phase 2
- [x] 15% material slippage factor on direct costs — Validated in Phase 2
- [x] Minimum Revenue Target (MRT) calculation combining all adjusted costs — Validated in Phase 2
- [x] Sales pipeline output: Jobs to Win, Quotes Needed (30% win rate), Leads Needed (30% conversion) — Validated in Phase 2

### Active

- [x] Multi-step input form capturing: entity type, gross personal draw, fixed overheads, staff details, average job value, direct cost %, and VAT rate — Validated in Phase 3: Multi-Step Input Form
- [ ] Output report: Monthly Revenue Goal (Net), Monthly Billings (Gross), Hourly Floor Rate
- [ ] Legal alerts: Gross Draw tax warning, Irish Two-Thirds VAT rule, Efficiency Cap override warning
- [x] Contextual plain-English explanations and asterisk notes on every input — Validated in Phase 4: Contextual Copy & Input Guidance
- [ ] Email-gated PDF report download (branded, printable)
- [ ] Email delivery of results summary
- [ ] UK and Ireland support (VAT rates: 20% UK, 13.5% IE, 23% IE, 0% Exempt)

### Out of Scope

- User accounts / login system — this is a one-shot calculator, not a SaaS platform
- Mobile native app — web-first, responsive design covers mobile
- Multi-currency support — GBP and EUR only, no currency conversion
- Historical data / saved scenarios — no persistence beyond the single session
- Payment processing — no paid tier, this is a free lead magnet
- Accountant/advisor portal — built for the tradesperson directly

## Context

- **Lead magnet purpose**: This tool captures emails for a done-for-you services business targeting tradespeople. The value exchange is: free financial clarity in return for an email address (gated at report download, not calculator access).
- **Target user**: Tradespeople (plumbers, electricians, builders, etc.) and local service business owners in the UK and Ireland who price by gut feel or competitor copying.
- **Tax systems**: Must handle both UK (Corporation Tax, Employer's NI) and Ireland (Corporation Tax, Employer's PRSI) regimes. The 30% employer burden buffer is a commercial safety net, not a precise statutory calculation.
- **Mathematical model**: Fully specified — the formulas are locked and must be implemented exactly as documented. The 75% efficiency cap and 15% slippage factor are non-negotiable guardrails.
- **CIS/RCT warning**: Subcontractors under UK CIS or Irish RCT face cash flow delays from withholding tax — this must be surfaced as a warning in outputs.

## Constraints

- **Tech stack**: Web app (to be determined by research) — must be fast-loading, no heavy frameworks that slow first paint
- **No login**: The calculator must work without any authentication; email capture happens only at report download
- **Tax accuracy**: Use conservative buffers (20% Corp Tax, 30% employer burden) — not precise statutory rates. Always disclaim with asterisk notes.
- **Input validation**: Direct cost % capped at 80%. Billable hours capped at 75%. These are hard limits with explanatory alerts.
- **Markets**: UK and Ireland only. VAT options: 20% UK, 13.5% IE, 23% IE, 0% Exempt.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No user accounts | Lead magnet — minimize friction to completion | -- Pending |
| Email gate on report only | Let them experience full value before asking for anything | -- Pending |
| Conservative tax buffers over precise rates | Simpler math, safer for the user, covers edge cases | -- Pending |
| Hard-coded efficiency/slippage factors | Prevents optimistic self-deception, which is the core problem this solves | -- Pending |
| UK + Ireland dual market | Owner's target market covers both jurisdictions | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-28 after Phase 4 completion*
