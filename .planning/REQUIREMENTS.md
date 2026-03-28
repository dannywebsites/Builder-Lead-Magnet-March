# Requirements: Trade Survival Calculator

**Defined:** 2026-03-28
**Core Value:** The tradesperson enters what they need to take home, and the app tells them the brutal truth about what the business must generate — no optimistic assumptions.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Input Form

- [x] **FORM-01**: User can select Business Entity type (Limited Company / Sole Trader)
- [ ] **FORM-02**: User can enter Gross Personal Draw (monthly target before personal income tax)
- [ ] **FORM-03**: User can enter Fixed Overheads (monthly business bills: rent, insurance, software, van leases)
- [ ] **FORM-04**: User can enter Staff Count (on-site billable employees only, excluding admin staff)
- [ ] **FORM-05**: User can enter Staff Hourly Rate (average gross wage per employment contract)
- [ ] **FORM-06**: User can enter Staff Hours Per Week (contracted weekly hours)
- [ ] **FORM-07**: User can enter Average Job Value (net/excluding VAT, based on recent history)
- [ ] **FORM-08**: User can enter Direct Cost Percentage (materials, fuel, disposal — hard-capped at 80%)
- [x] **FORM-09**: User can select VAT Rate (20% UK / 13.5% IE / 23% IE / 0% Exempt)
- [x] **FORM-10**: Every input field displays a plain-English note explaining what it means and why it matters
- [x] **FORM-11**: Every input field displays contextual asterisk notes where applicable (tax disclaimers, buffer explanations)
- [x] **FORM-12**: Form validates all inputs with helpful error messages before calculation
- [x] **FORM-13**: Multi-step wizard layout with progress indicator

### Calculation Engine

- [x] **CALC-01**: Step 1 — Tax Buffer: Ltd = Gross_Personal_Draw / 0.80; Sole Trader = Gross_Personal_Draw (no Corp Tax)
- [x] **CALC-02**: Step 2 — True Cost of Staff: Total_Monthly_Hours = (Staff_Count * Staff_Hours_Per_Week) * 4.33; Base_Payroll = Total_Monthly_Hours * Staff_Hourly_Rate; Adjusted_Payroll = Base_Payroll * 1.30
- [x] **CALC-03**: Step 3 — 75% Reality Check: Total_Billable_Hours = Total_Monthly_Hours * 0.75 (hard-capped, non-overridable)
- [x] **CALC-04**: Step 4 — Slippage Factor: Real_Direct_Cost = Direct_Cost_Pct * 1.15
- [x] **CALC-05**: Step 5 — MRT: Adjusted_Overheads = Fixed_Overheads + Adjusted_Payroll; MRT = (Target_Business_Profit + Adjusted_Overheads) / (1 - Real_Direct_Cost)
- [x] **CALC-06**: All calculations execute client-side with no server round-trip
- [x] **CALC-07**: Floating point precision handled correctly (currency rounding to 2 decimal places)
- [x] **CALC-08**: Zero-staff edge case handled gracefully (no division errors, payroll = 0)

### Output Report

- [ ] **OUT-01**: Display Monthly Revenue Goal (Net) = MRT
- [ ] **OUT-02**: Display Monthly Billings (Gross) = MRT * (1 + VAT_Rate)
- [ ] **OUT-03**: Display Hourly Floor Rate = MRT / Total_Billable_Hours
- [ ] **OUT-04**: Display Jobs to Win = MRT / Avg_Job_Value
- [ ] **OUT-05**: Display Quotes Needed = Jobs_to_Win / 0.30 (assumes 30% win rate)
- [ ] **OUT-06**: Display Leads Needed = Quotes_Needed / 0.30 (assumes 30% conversion)
- [ ] **OUT-07**: Every output displays a plain-English note explaining what it means
- [ ] **OUT-08**: Results display instantly on-screen after calculation (no page reload)

### Legal Alerts

- [ ] **ALRT-01**: Gross Draw Warning — displayed for both entity types, explains personal tax is not covered by the business target
- [ ] **ALRT-02**: Irish Two-Thirds Rule — IF VAT_Rate == 13.5% AND Direct_Cost_Pct > 0.66 THEN alert: must use 23% rate
- [ ] **ALRT-03**: Efficiency Cap Warning — IF user attempts to override 75% billable hours, display explanation that it is hard-capped
- [ ] **ALRT-04**: CIS/RCT Subcontractor Warning — alert about cash flow impact of withholding tax (up to 30% UK / 35% IE)

### Lead Capture

- [ ] **LEAD-01**: Email input modal appears when user clicks to download report
- [ ] **LEAD-02**: GDPR-compliant consent checkbox before email submission
- [ ] **LEAD-03**: Email address captured and stored for follow-up marketing
- [ ] **LEAD-04**: Branded PDF report generated client-side and available for download after email submission
- [ ] **LEAD-05**: Email delivery of results summary sent to the captured address

### PDF Report

- [ ] **PDF-01**: Branded, printable PDF containing all financial anchors and sales marching orders
- [ ] **PDF-02**: PDF includes all plain-English notes and asterisk disclaimers from the output
- [ ] **PDF-03**: PDF includes all triggered legal alerts
- [ ] **PDF-04**: PDF renders correctly across browsers (Chrome, Safari, Firefox, Edge)
- [ ] **PDF-05**: PDF file size optimized (under 500KB)

### UX & Performance

- [ ] **UX-01**: Mobile-first responsive design
- [ ] **UX-02**: Fast initial page load (static export, no server rendering required)
- [ ] **UX-03**: Cookieless analytics (no GDPR cookie banner required)
- [ ] **UX-04**: Print-friendly on-screen results view

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Inputs

- **ENH-01**: Adjustable win rate and conversion rate (currently hardcoded at 30%)
- **ENH-02**: Multiple staff tiers (different rates for different roles)
- **ENH-03**: Seasonal adjustment factors for quiet/busy months

### Reporting

- **RPT-01**: Scenario comparison (save and compare multiple runs)
- **RPT-02**: Annual projection from monthly figures
- **RPT-03**: Break-even chart visualization

### Integration

- **INT-01**: CRM integration for captured leads
- **INT-02**: Email automation sequence after lead capture

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts / login | Lead magnet — minimize friction, no persistence needed |
| Precise statutory tax rates | Conservative buffers are safer and simpler; always disclaim |
| Real-time tax API lookups | Adds complexity, latency, and cost for marginal accuracy gain |
| Editable efficiency/slippage factors | Core value is killing optimistic assumptions — users can't override |
| Multi-currency beyond GBP/EUR | UK + Ireland only for v1 |
| Competitor benchmarking | Different product — this is about YOUR numbers |
| Social sharing of results | Financial data is private; sharing hurts trust |
| Appointment booking | Belongs in the follow-up funnel, not the calculator |
| Mobile native app | Responsive web covers mobile use case |
| Complex dashboards | One-shot calculator, not a monitoring tool |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORM-01 | Phase 1: Project Scaffolding & Type Foundation | Complete |
| FORM-02 | Phase 3: Multi-Step Input Form | Pending |
| FORM-03 | Phase 3: Multi-Step Input Form | Pending |
| FORM-04 | Phase 3: Multi-Step Input Form | Pending |
| FORM-05 | Phase 3: Multi-Step Input Form | Pending |
| FORM-06 | Phase 3: Multi-Step Input Form | Pending |
| FORM-07 | Phase 3: Multi-Step Input Form | Pending |
| FORM-08 | Phase 3: Multi-Step Input Form | Pending |
| FORM-09 | Phase 1: Project Scaffolding & Type Foundation | Complete |
| FORM-10 | Phase 4: Contextual Copy & Input Guidance | Complete |
| FORM-11 | Phase 4: Contextual Copy & Input Guidance | Complete |
| FORM-12 | Phase 3: Multi-Step Input Form | Complete |
| FORM-13 | Phase 3: Multi-Step Input Form | Complete |
| CALC-01 | Phase 2: Calculation Engine | Complete |
| CALC-02 | Phase 2: Calculation Engine | Complete |
| CALC-03 | Phase 2: Calculation Engine | Complete |
| CALC-04 | Phase 2: Calculation Engine | Complete |
| CALC-05 | Phase 2: Calculation Engine | Complete |
| CALC-06 | Phase 2: Calculation Engine | Complete |
| CALC-07 | Phase 1: Project Scaffolding & Type Foundation | Complete |
| CALC-08 | Phase 2: Calculation Engine | Complete |
| OUT-01 | Phase 5: Results Display | Pending |
| OUT-02 | Phase 5: Results Display | Pending |
| OUT-03 | Phase 5: Results Display | Pending |
| OUT-04 | Phase 5: Results Display | Pending |
| OUT-05 | Phase 5: Results Display | Pending |
| OUT-06 | Phase 5: Results Display | Pending |
| OUT-07 | Phase 5: Results Display | Pending |
| OUT-08 | Phase 5: Results Display | Pending |
| ALRT-01 | Phase 6: Legal Alerts | Pending |
| ALRT-02 | Phase 6: Legal Alerts | Pending |
| ALRT-03 | Phase 6: Legal Alerts | Pending |
| ALRT-04 | Phase 6: Legal Alerts | Pending |
| LEAD-01 | Phase 9: Email Capture & Delivery | Pending |
| LEAD-02 | Phase 8: GDPR Compliance & Privacy Infrastructure | Pending |
| LEAD-03 | Phase 9: Email Capture & Delivery | Pending |
| LEAD-04 | Phase 9: Email Capture & Delivery | Pending |
| LEAD-05 | Phase 9: Email Capture & Delivery | Pending |
| PDF-01 | Phase 7: PDF Report Generation | Pending |
| PDF-02 | Phase 7: PDF Report Generation | Pending |
| PDF-03 | Phase 7: PDF Report Generation | Pending |
| PDF-04 | Phase 7: PDF Report Generation | Pending |
| PDF-05 | Phase 7: PDF Report Generation | Pending |
| UX-01 | Phase 10: UX Polish, Performance & Launch Prep | Pending |
| UX-02 | Phase 10: UX Polish, Performance & Launch Prep | Pending |
| UX-03 | Phase 8: GDPR Compliance & Privacy Infrastructure | Pending |
| UX-04 | Phase 10: UX Polish, Performance & Launch Prep | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after roadmap phase mapping*
