# Feature Research

**Domain:** Financial calculator lead magnets for tradespeople / SMBs (UK & Ireland)
**Researched:** 2026-03-28
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | In PROJECT.md? | Notes |
|---------|--------------|------------|-----------------|-------|
| Responsive / mobile-first design | Tradespeople live on their phones. 60%+ of traffic will be mobile. Static mobile popups convert 3.4% vs 9.1% for optimised. | LOW | Implied (web-first, responsive) | Use viewport units, large tap targets, no horizontal scroll. No dependency. |
| Instant on-screen results | Every competitor (TradeSender, Tradify, Jobber) shows results immediately. Users will not wait or page-reload. | LOW | Yes (output report section) | Pure client-side math, zero server round-trip for core calc. No dependency. |
| Multi-step form with progress indicator | Multi-step forms increase lead conversion by 214% over single-page forms. Progress bars boost completion 20-30%. | MEDIUM | Yes (multi-step input form) | 4-6 steps max. Depends on: input field definitions. |
| Clear, plain-English input labels | Target users are not accountants. Jargon kills completion rates. TradeSender and Tradify both use conversational copy. | LOW | Yes (contextual plain-English explanations) | Microcopy under every field. No dependency. |
| Input validation with helpful errors | Hard caps (direct cost 80%, billable hours 75%) require immediate, non-hostile feedback. | LOW | Yes (input validation constraints) | Inline validation, not modal alerts. Depends on: input field definitions. |
| VAT handling (UK 20%, IE 13.5%/23%, Exempt) | Dual-market requirement. Users expect tax to be region-aware. | LOW | Yes (UK and Ireland support) | Single dropdown selector. No dependency. |
| Fast initial page load | Tradespeople will bounce on slow pages. First paint under 1.5s is table stakes for any lead magnet. | LOW | Yes (constraint: no heavy frameworks) | Static site or lightweight SPA. No dependency. |
| Entity type selector (Ltd vs Sole Trader) | Tax treatment differs fundamentally. Every UK/IE business calculator handles this. | LOW | Yes (entity type input) | Toggles which tax buffer logic applies. No dependency. |
| Print-friendly output | Tradespeople print things out and tape them to the wall. Not having a clean print view is a miss. | LOW | Partially (PDF report) | CSS print styles. No dependency. |

### Differentiators (Competitive Advantage)

Features that set this product apart from TradeSender, Tradify, Jobber, and generic calculators.

| Feature | Value Proposition | Complexity | In PROJECT.md? | Notes |
|---------|-------------------|------------|-----------------|-------|
| 75% billable hours reality check (hard cap) | Competitors let users claim 100% billable time, producing fantasy numbers. This enforces honesty. Core value prop. | LOW | Yes (hard-capped, not overridable) | Show explanatory alert when user tries to exceed. Depends on: input form. |
| 15% material slippage factor | No competitor adds automatic cost slippage. This catches the #1 reason tradespeople lose money on jobs. | LOW | Yes (15% slippage on direct costs) | Applied automatically with asterisk explanation. Depends on: direct cost input. |
| Reverse-engineered from take-home pay | Most calculators work forward (costs -> rate). This works backward (desired lifestyle -> required revenue). Emotionally compelling. | MEDIUM | Yes (core value proposition) | This is the mathematical model. Depends on: all input fields. |
| 30% employer burden buffer | Competitors either ignore employer costs or require users to know NI/PRSI rates. The flat 30% buffer is safer and simpler. | LOW | Yes (30% employer burden markup) | Applied to staff base payroll. Depends on: staff details input. |
| Sales pipeline output (jobs, quotes, leads) | No competitor translates revenue targets into actionable sales pipeline numbers. Makes the abstract concrete. | MEDIUM | Yes (jobs to win, quotes needed, leads needed) | Uses 30% win rate, 30% conversion. Depends on: MRT calculation, average job value. |
| Legal/tax alerts (contextual warnings) | CIS/RCT warnings, gross draw tax alerts, Irish two-thirds VAT rule. No competitor does jurisdiction-specific legal nudges. | MEDIUM | Yes (legal alerts section) | Conditional logic based on entity type and jurisdiction. Depends on: entity type, VAT rate selection. |
| Email-gated PDF report (ungated calculator) | Most competitors either fully gate (kills trust) or fully ungate (no lead capture). The "experience value first, gate the artifact" model converts best. | HIGH | Yes (email-gated PDF download) | Requires PDF generation, email integration, form. Depends on: results calculation, email service. |
| Email delivery of results | Extends the value exchange beyond the session. Creates a follow-up touchpoint. | MEDIUM | Yes (email delivery of results summary) | Triggered after email capture. Depends on: email gate, PDF generation. |
| Contextual asterisk notes on every figure | Builds trust with skeptical tradespeople by showing the math is conservative and explaining why. No competitor does this level of transparency. | LOW | Yes (asterisk notes on every input/output) | Static copy tied to each output. No dependency beyond outputs existing. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this specific product.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / login system | "Save my calculation for later" | Adds friction, requires auth infrastructure, GDPR complexity. Kills the one-shot lead magnet model. Users who want to save can bookmark the PDF. | Email the report — they have a permanent copy without needing an account. |
| Scenario comparison / saved scenarios | "Compare different pricing strategies side by side" | Turns a simple calculator into a mini-SaaS. Increases cognitive load. Tradespeople need ONE number, not a dashboard of options. | Encourage re-running the calculator with different inputs. Keep it stateless. |
| Competitor rate benchmarking | "How does my rate compare to other plumbers in my area?" | Requires maintaining a rate database, invites arguments about data accuracy, and shifts focus from "what YOU need" to "what others charge" — the exact gut-feel pricing this tool fights against. | Show the user's calculated rate and let them draw their own conclusions. |
| Complex dashboard / charts | "Visualize my financial breakdown" | Tradespeople want a number, not a pie chart. Dashboards signal "enterprise software" and increase bounce rate for this audience. | Clean summary card with 3-4 key numbers. One optional expandable breakdown. |
| Precise statutory tax rates | "Use the exact NI/PRSI/Corp Tax bands" | Turns a lead magnet into tax software. Creates liability. Rates change annually. The conservative buffer approach is deliberately safer. | 20% Corp Tax buffer + 30% employer burden + prominent disclaimer. |
| Multi-currency / international | "Support USD, AUD, etc." | Scope creep. Tax regimes differ wildly. UK+IE is the target market. | GBP and EUR only. Add markets only if validated by demand. |
| Real-time tax API integration | "Pull live tax rates from HMRC/Revenue" | API dependency adds latency, failure modes, and maintenance burden for marginal accuracy improvement over fixed buffers. | Hard-coded conservative buffers with annual review. |
| Editable efficiency/slippage factors | "Let me set my own billable hours percentage" | Defeats the core value proposition. Users WILL set 95% billable and 0% slippage, producing the same fantasy numbers they already believe. | Hard caps with explanatory copy about why they exist. |
| Social sharing of results | "Share my rate on LinkedIn/Facebook" | Financial details are private. Tradespeople do not want their minimum rate public. Creates awkwardness. | Share the calculator link (not results) via a "send this to a mate" button. |
| Appointment booking integration | "Book a consultation after seeing results" | Premature monetisation signal. The lead magnet should build trust first; the email sequence handles conversion. | CTA in the PDF report and follow-up email pointing to booking. |

## Feature Dependencies

```
[Entity Type Selector]
    └──determines──> [Tax Buffer Logic (Corp Tax vs Pass-Through)]
    └──determines──> [Legal Alert Conditions]

[All Input Fields (draw, overheads, staff, job value, costs, VAT)]
    └──required-for──> [MRT Calculation Engine]
                           └──required-for──> [Output Report (Revenue Goal, Billings, Hourly Rate)]
                                                  └──required-for──> [Sales Pipeline Output]
                                                  └──required-for──> [PDF Report Generation]
                                                                         └──required-for──> [Email Gate + Capture]
                                                                                               └──required-for──> [Email Delivery]

[VAT Rate Selection]
    └──determines──> [Gross vs Net Billings Output]
    └──triggers──> [Irish Two-Thirds VAT Rule Alert]

[75% Efficiency Cap] ──enhances──> [MRT Calculation]
[15% Slippage Factor] ──enhances──> [MRT Calculation]
[30% Employer Burden] ──enhances──> [Staff Cost Calculation]

[Multi-Step Form + Progress Bar] ──contains──> [All Input Fields]
[Inline Validation] ──enhances──> [Multi-Step Form]

[Responsive Design] ──independent── (applies to everything)
[Plain-English Copy] ──independent── (applies to everything)
```

### Dependency Notes

- **PDF Report requires MRT Calculation:** The report is a formatted version of the calculated outputs. Cannot exist without the math engine.
- **Email Gate requires PDF Report:** The value exchange is: email for PDF. No PDF = no reason to gate.
- **Email Delivery requires Email Gate:** Triggered by the same email capture event.
- **Sales Pipeline requires MRT + Average Job Value:** Pipeline math divides revenue target by job value, then applies win/conversion rates.
- **Legal Alerts require Entity Type + VAT:** Conditional warnings depend on jurisdiction and business structure selections.
- **Efficiency Cap / Slippage / Employer Burden enhance MRT:** These are modifiers applied during calculation, not standalone features.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what is needed to validate the concept and start capturing leads.

- [ ] Multi-step input form (entity type, draw, overheads, staff, job value, direct costs, VAT) -- this IS the product
- [ ] MRT calculation engine with all reality-check factors (75% cap, 15% slippage, 30% burden) -- core math, non-negotiable
- [ ] On-screen output report (Monthly Revenue Goal, Monthly Billings, Hourly Floor Rate) -- instant gratification
- [ ] Sales pipeline output (Jobs to Win, Quotes Needed, Leads Needed) -- key differentiator
- [ ] Legal/tax alert system (conditional warnings) -- trust builder and liability protection
- [ ] Plain-English contextual copy and asterisk notes -- without this, tradespeople will not trust the numbers
- [ ] Responsive design -- mobile-first, fast load
- [ ] Input validation with hard caps and explanatory alerts -- prevents garbage-in-garbage-out
- [ ] Email-gated PDF report download -- the lead capture mechanism

### Add After Validation (v1.x)

Features to add once email capture rate and calculator completion rate are validated.

- [ ] Email delivery of results summary -- add when email infrastructure is proven stable
- [ ] Print-friendly CSS styles -- add when user feedback confirms demand
- [ ] Pre-filled example scenarios (e.g., "Plumber, Dublin, 2 staff") -- add when completion rate data shows users stalling on inputs
- [ ] "Send this to a mate" share button (shares calculator URL, not results) -- add when organic referral potential is validated

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] A/B testing framework for form copy and step order -- defer until traffic volume justifies
- [ ] CRM integration (beyond basic email capture) -- defer until the sales process downstream is defined
- [ ] Additional jurisdictions beyond UK/IE -- defer until demand is validated
- [ ] Seasonal adjustment factors -- defer, adds complexity for marginal value
- [ ] Branded white-label version for accountants/advisors -- defer, different product entirely

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Multi-step input form | HIGH | MEDIUM | P1 |
| MRT calculation engine (with all factors) | HIGH | MEDIUM | P1 |
| On-screen output report | HIGH | LOW | P1 |
| Sales pipeline output | HIGH | LOW | P1 |
| Legal/tax alerts | MEDIUM | MEDIUM | P1 |
| Plain-English copy + asterisk notes | HIGH | LOW | P1 |
| Responsive mobile-first design | HIGH | LOW | P1 |
| Input validation + hard caps | HIGH | LOW | P1 |
| Email-gated PDF report | HIGH | HIGH | P1 |
| Email delivery of results | MEDIUM | MEDIUM | P2 |
| Print-friendly output | LOW | LOW | P2 |
| Pre-filled example scenarios | MEDIUM | LOW | P2 |
| Share calculator link button | LOW | LOW | P3 |
| CRM integration | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | TradeSender | Tradify | Jobber | Our Approach |
|---------|-------------|---------|--------|--------------|
| Input model | Forward (costs -> rate) | Forward (costs -> charge-out rate) | Forward (labor + materials + overhead) | **Reverse** (desired take-home -> required revenue). Emotionally compelling. |
| Billable hours handling | User enters billable hours freely | User sets own hours | Not addressed | **Hard-capped at 75%** with explanation. Cannot be overridden. |
| Material cost slippage | Not included | Not included | Not included | **15% automatic slippage** factor. Unique differentiator. |
| Employer cost handling | Basic (user enters total) | Basic wage input | Labor cost input | **30% automatic burden** markup on staff payroll. Safer. |
| Tax handling | None visible | None (NZ/AU focused) | None (US/CA focused) | **UK + IE dual-market** with Corp Tax buffer, CIS/RCT warnings. |
| Sales pipeline output | Not included | Not included | Not included | **Full pipeline**: jobs to win, quotes needed, leads needed. Unique. |
| Lead capture | Newsletter signup | Free trial CTA | Free trial CTA | **Ungated calculator + gated PDF report**. Value-first model. |
| Output format | On-screen only | On-screen only | On-screen only | **On-screen + branded PDF + email delivery**. |
| Legal warnings | None | None | None | **Contextual**: CIS/RCT, gross draw, Irish VAT two-thirds rule. |
| Plain-English explanations | Minimal | Minimal (blog post) | Moderate (tooltips) | **Asterisk notes on every input and output**. Maximum transparency. |

## Sources

- [TradeSender Hourly Rate Calculator](https://www.tradesender.co.uk/resources/tools/hourly-rate-calculator) -- UK trades-specific calculator, direct competitor
- [Tradify Charge-Out Rate Calculator](https://www.tradifyhq.com/tools/charge-out-rate-calculator) -- NZ/AU trades platform with free calculator tool
- [Jobber Service Price Calculator](https://www.getjobber.com/free-tools/pricing-calculator/) -- US/CA field service pricing calculator
- [Housecall Pro Service Price Calculator](https://www.housecallpro.com/small-business/templates-calculators/small-business-service-price-calculator/) -- service business pricing tool
- [CALCONIC Interactive Calculators for Lead Generation](https://www.calconic.com/generate-leads-with-interactive-calculators) -- calculator lead magnet platform
- [Stylish Cost Calculator Multi-Step Forms](https://stylishcostcalculator.com/features/multi-step-form/) -- multi-step calculator UX patterns
- [Amra and Elma Lead Magnet Conversion Statistics 2026](https://www.amraandelma.com/lead-magnet-conversion-statistics/) -- interactive content converts at 47.3% vs 2.8% for static forms
- [Formidable Forms Multi-Step Form Guide](https://formidableforms.com/multi-step-form-with-progress-bar/) -- multi-step forms increase conversion by 214%
- [Brixon Group: Gated PDF vs Interactive Tool](https://brixongroup.com/en/b2b-lead-magnets-compared-gated-pdf-vs-interactive-tool-which-strategy-will-deliver-better-results-in/) -- B2B lead magnet strategy comparison
- [Zuko: Progress Bars in Online Forms](https://www.zuko.io/blog/progress-bars-in-online-forms) -- progress bar UX best practices

---
*Feature research for: Trade Survival Calculator -- financial lead magnet for UK/IE tradespeople*
*Researched: 2026-03-28*
