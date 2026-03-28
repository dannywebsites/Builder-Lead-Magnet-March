# Roadmap: Trade Survival Calculator

## Overview

Build a client-side financial calculator that works backward from a tradesperson's desired take-home pay to their required hourly rate, revenue target, and sales pipeline numbers. The journey starts with type foundations and the standalone calculation engine, layers on the multi-step form and results display, adds legal alerts and contextual copy, generates branded PDF reports, wires up email-gated lead capture with GDPR compliance, and finishes with performance optimization, analytics, and cross-browser polish. Every phase delivers testable, observable value.

## Phases

- [ ] **Phase 1: Project Scaffolding & Type Foundation** - Next.js 15 project setup with TypeScript types, Zod schemas, and currency utilities
- [ ] **Phase 2: Calculation Engine** - Pure TypeScript calculation functions with full test coverage
- [ ] **Phase 3: Multi-Step Input Form** - Wizard layout with per-step validation, progress indicator, and all input fields
- [ ] **Phase 4: Contextual Copy & Input Guidance** - Plain-English notes, asterisk disclaimers, and helpful error messages on every field
- [ ] **Phase 5: Results Display** - On-screen output of financial anchors and sales pipeline numbers
- [ ] **Phase 6: Legal Alerts** - Conditional warnings for tax, VAT, efficiency cap, and CIS/RCT
- [ ] **Phase 7: PDF Report Generation** - Branded, printable PDF with full breakdown, alerts, and disclaimers
- [ ] **Phase 8: GDPR Compliance & Privacy Infrastructure** - Consent mechanisms, privacy policy, and cookieless analytics
- [ ] **Phase 9: Email Capture & Delivery** - Email-gated PDF download modal and serverless email function
- [ ] **Phase 10: UX Polish, Performance & Launch Prep** - Mobile-first responsive design, print CSS, cross-browser testing, and performance audit

## Phase Details

### Phase 1: Project Scaffolding & Type Foundation
**Goal**: Standing Next.js 15 project with all TypeScript interfaces, Zod validation schemas, currency formatting (GBP + EUR), and rounding utilities that every subsequent phase consumes.
**Depends on**: Nothing (first phase)
**Requirements**: FORM-01, FORM-09, CALC-07
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Next.js 15 app builds and runs locally with TypeScript, Tailwind CSS 4, and Biome configured
  2. Zod schemas for all calculator inputs (entity type, draw, overheads, staff, job value, direct cost %, VAT rate) exist and validate correctly
  3. Currency formatting utility correctly formats GBP and EUR values to 2 decimal places
**Plans**: 2 plans

Plans:
- [x] 01-01: Project scaffolding (Next.js 15, TypeScript, Tailwind 4, Biome)
- [x] 01-02: Type definitions, Zod schemas, and currency/rounding utilities

### Phase 2: Calculation Engine
**Goal**: Standalone, fully-tested pure TypeScript calculation module implementing all five formula steps plus sales pipeline math — zero UI dependencies, deterministic, correct.
**Depends on**: Phase 1
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-08
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. `calculate()` function produces correct MRT for both Ltd Company and Sole Trader entity types
  2. Zero-staff edge case returns valid results with payroll = 0 and no division errors
  3. 75% efficiency cap is hard-coded and non-overridable in the engine
  4. 15% slippage factor applied correctly to direct cost percentage
  5. Full unit test suite passes covering all formula steps, both entity types, and edge cases
**Plans**: 2 plans

Plans:
- [x] 02-01: Core calculation functions (tax buffer, staff cost, efficiency cap, slippage, MRT)
- [ ] 02-02: Sales pipeline calculations and comprehensive test suite

### Phase 3: Multi-Step Input Form
**Goal**: Working multi-step wizard form that collects all required inputs with step-by-step Zod validation and a progress indicator — wired to the calculation engine but not yet displaying results.
**Depends on**: Phase 2
**Requirements**: FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08, FORM-12, FORM-13
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. User can navigate a multi-step wizard with visible progress indicator
  2. Each step validates inputs before allowing progression (direct cost % capped at 80%)
  3. All 8 input fields are present and functional across wizard steps
  4. Form state persists across steps (back/forward navigation does not lose data)
**Plans**: TBD

Plans:
- [ ] 03-01: Wizard shell with step navigation, progress indicator, and route state
- [ ] 03-02: Input fields with react-hook-form + Zod per-step validation

### Phase 4: Contextual Copy & Input Guidance
**Goal**: Every input field displays a plain-English explanation and contextual asterisk notes (tax disclaimers, buffer explanations) so tradespeople understand exactly what they are entering and why.
**Depends on**: Phase 3
**Requirements**: FORM-10, FORM-11
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Every input field shows a plain-English note explaining what it means and why it matters
  2. Fields with tax/buffer implications display asterisk disclaimers (e.g., 30% employer burden, Corp Tax buffer)
  3. Copy uses "protect" framing, not "limit" framing for guardrails
**Plans**: TBD

Plans:
- [ ] 04-01: Microcopy components, plain-English notes, and asterisk disclaimers for all input fields

### Phase 5: Results Display
**Goal**: After form submission, headline financial anchors and sales pipeline numbers render instantly on-screen with plain-English explanations — no page reload, no server round-trip.
**Depends on**: Phase 4
**Requirements**: OUT-01, OUT-02, OUT-03, OUT-04, OUT-05, OUT-06, OUT-07, OUT-08
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Results appear instantly on-screen after the final form step (no page reload)
  2. Monthly Revenue Goal (Net), Monthly Billings (Gross), and Hourly Floor Rate are displayed
  3. Sales pipeline numbers (Jobs to Win, Quotes Needed, Leads Needed) are displayed
  4. Every output value has a plain-English explanation visible to the user
**Plans**: TBD

Plans:
- [ ] 05-01: Results page layout with financial anchor cards and pipeline section
- [ ] 05-02: Plain-English output explanations and on-screen content split (headline vs PDF-reserved)

### Phase 6: Legal Alerts
**Goal**: Conditional legal and tax alerts fire based on user inputs and calculation results — Gross Draw warning, Irish Two-Thirds VAT rule, efficiency cap explanation, and CIS/RCT subcontractor warning.
**Depends on**: Phase 5
**Requirements**: ALRT-01, ALRT-02, ALRT-03, ALRT-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Gross Draw warning displays for both entity types on the results screen
  2. Irish Two-Thirds Rule alert triggers when VAT = 13.5% and direct cost > 66%
  3. CIS/RCT subcontractor cash flow warning is visible in results
  4. Efficiency cap explanation displays if 75% cap is relevant (always, for staff > 0)
**Plans**: TBD

Plans:
- [ ] 06-01: Alert trigger logic and alert display components on results screen

### Phase 7: PDF Report Generation
**Goal**: Client-side branded PDF report containing all financial anchors, sales pipeline targets, legal alerts, plain-English notes, and asterisk disclaimers — lazy-loaded on user action, optimized under 500KB.
**Depends on**: Phase 6
**Requirements**: PDF-01, PDF-02, PDF-03, PDF-04, PDF-05
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Branded PDF generates client-side using @react-pdf/renderer with correct financial data
  2. PDF includes all triggered legal alerts and all asterisk disclaimers from the output
  3. PDF library is lazy-loaded (dynamic import on "Get Report" click, not in initial bundle)
  4. Generated PDF renders correctly on Chrome, Safari, Firefox, and Edge
  5. PDF file size is under 500KB
**Plans**: TBD

Plans:
- [ ] 07-01: PDF layout template with @react-pdf/renderer (branded header, financial sections, disclaimers)
- [ ] 07-02: Lazy-loading, cross-browser testing, and file size optimization

### Phase 8: GDPR Compliance & Privacy Infrastructure
**Goal**: GDPR-compliant consent mechanism, privacy policy, and cookieless analytics in place before any email is captured — this is a prerequisite for lead capture, not an afterthought.
**Depends on**: Phase 7
**Requirements**: LEAD-02, UX-03
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. GDPR consent checkbox (unchecked by default) exists and blocks submission when unchecked
  2. Privacy policy link is visible and accessible from the consent UI
  3. Plausible Analytics is integrated with no cookie banner required
**Plans**: TBD

Plans:
- [ ] 08-01: GDPR consent components, privacy policy page, and Plausible Analytics integration

### Phase 9: Email Capture & Delivery
**Goal**: Email-gated PDF download flow — modal captures email with GDPR consent, triggers PDF download, and sends a branded results summary email via serverless function.
**Depends on**: Phase 8
**Requirements**: LEAD-01, LEAD-03, LEAD-04, LEAD-05
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Clicking "Get Your Trade Survival Report" opens an email capture modal
  2. PDF downloads only after valid email submission with consent checkbox checked
  3. Email address is captured and stored for follow-up marketing
  4. Branded results summary email is delivered to the captured address via Resend
**Plans**: TBD

Plans:
- [ ] 09-01: Email capture modal UI and client-side gating logic
- [ ] 09-02: Serverless email function (Vercel + Resend), email template, and SPF/DKIM/DMARC setup

### Phase 10: UX Polish, Performance & Launch Prep
**Goal**: Mobile-first responsive design pass, print-friendly results view, Lighthouse performance audit (90+ mobile), and cross-browser final verification.
**Depends on**: Phase 9
**Requirements**: UX-01, UX-02, UX-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. All screens are mobile-first responsive and usable on 375px width
  2. Lighthouse mobile performance score is 90+ with initial bundle under 200KB
  3. On-screen results view is print-friendly (clean print CSS, no UI chrome)
  4. Full end-to-end flow works on Chrome, Safari, Firefox, and Edge (desktop + mobile)
**Plans**: TBD

Plans:
- [ ] 10-01: Mobile-first responsive pass and print CSS
- [ ] 10-02: Performance audit, bundle optimization, and static export verification
- [ ] 10-03: Cross-browser end-to-end testing and launch checklist

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffolding & Type Foundation | 0/2 | Not started | - |
| 2. Calculation Engine | 0/2 | Not started | - |
| 3. Multi-Step Input Form | 0/2 | Not started | - |
| 4. Contextual Copy & Input Guidance | 0/1 | Not started | - |
| 5. Results Display | 0/2 | Not started | - |
| 6. Legal Alerts | 0/1 | Not started | - |
| 7. PDF Report Generation | 0/2 | Not started | - |
| 8. GDPR Compliance & Privacy Infrastructure | 0/1 | Not started | - |
| 9. Email Capture & Delivery | 0/2 | Not started | - |
| 10. UX Polish, Performance & Launch Prep | 0/3 | Not started | - |
