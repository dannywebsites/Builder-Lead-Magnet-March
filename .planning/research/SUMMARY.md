# Project Research Summary

**Project:** Trade Survival Calculator
**Domain:** Single-purpose financial calculator lead magnet (web app) for UK/IE tradespeople
**Researched:** 2026-03-28
**Confidence:** HIGH

## Executive Summary

The Trade Survival Calculator is a reverse-engineered financial calculator that works backward from a tradesperson's desired take-home pay to their required hourly rate, monthly revenue target, and sales pipeline numbers. Research across stack, features, architecture, and pitfalls converges on a clear recommendation: build a statically-exported Next.js app with client-side calculations, client-side PDF generation, and a single serverless function for email delivery. The product's value lies in its opinionated guardrails (75% efficiency cap, 15% material slippage, 30% employer burden) and its ungated-calculator / gated-PDF lead capture model.

The recommended stack is Next.js 15 (static export) + React 19 + TypeScript + Tailwind CSS 4, with react-hook-form + Zod for the multi-step form, @react-pdf/renderer for PDF generation, and Resend for transactional email. This keeps the architecture minimal: everything runs in the browser except email delivery, which requires a server-side API key. The entire app can deploy on Vercel's free tier with zero server management.

The highest-impact risks are: (1) email gate abandonment if on-screen results give away too much value, (2) PDF generation inconsistencies across browsers (especially iOS Safari), (3) GDPR non-compliance on email capture destroying the lead list, and (4) form abandonment from too many fields or jargon-heavy labels. All four are preventable with upfront design decisions rather than retroactive fixes.

## Key Findings

### Recommended Stack

The stack is deliberately lightweight for a single-purpose tool. Next.js 15 with static export provides SEO via the metadata API and route-based code splitting, while keeping deployment serverless. React 19's form actions simplify the multi-step wizard. The PDF library (@react-pdf/renderer) runs entirely client-side using JSX components, matching the rest of the app's mental model. Plausible Analytics avoids GDPR cookie consent requirements — critical for UK/IE market conversion.

**Core technologies:**
- **Next.js 15 (App Router, static export):** Framework — SSR for SEO shell, client components for interactivity, zero-server deploy
- **TypeScript 5.7+:** Type safety — financial calculations with multiple tax regimes demand compile-time unit checking
- **Tailwind CSS 4:** Styling — zero runtime overhead, fast iteration, purges to tiny CSS
- **react-hook-form + Zod:** Form management — uncontrolled components for performance, shared validation schemas end-to-end
- **@react-pdf/renderer 4.x:** PDF generation — JSX-based layout, client-side only, React 19 compatible
- **Resend + react-email:** Email delivery — developer-first API, generous free tier (3,000/month), JSX email templates

### Expected Features

**Must have (table stakes):**
- Responsive mobile-first design (60%+ traffic will be mobile, tradespeople on-site)
- Instant on-screen results (pure client-side, zero server round-trip)
- Multi-step form with progress indicator (214% conversion lift over single-page forms)
- Plain-English input labels with contextual microcopy
- Input validation with hard caps and inline helpful errors
- VAT handling for both UK (20%) and Ireland (13.5%/23%)
- Entity type selector (Ltd vs Sole Trader) as the first question

**Should have (differentiators):**
- 75% billable hours hard cap with persuasive inline explanation
- 15% material slippage factor (no competitor includes this)
- Reverse-engineered from take-home pay (emotionally compelling, unique model)
- Sales pipeline output: jobs to win, quotes needed, leads needed (no competitor does this)
- Legal/tax alerts: CIS/RCT cash flow warnings, Irish Two-Thirds VAT rule, gross draw tax alerts
- Email-gated PDF report with significantly more value than on-screen results

**Defer (v2+):**
- A/B testing framework (needs traffic volume first)
- CRM integration beyond basic email capture
- Additional jurisdictions beyond UK/IE
- White-label version for accountants

### Architecture Approach

The architecture is a client-heavy, server-minimal design. All calculations, validation, PDF generation, and analytics run in the browser. The only server-side component is a single Vercel Serverless Function (`/api/send-report`) that receives email + results JSON and calls Resend to deliver a branded email. This means the app scales with zero server cost for its core value proposition — the "server" only handles email sends at a ~1-5% conversion rate of total visitors.

**Major components:**
1. **Multi-Step Input Form** — Collects inputs with per-step Zod validation, step navigation via URL query params (nuqs), progress indication
2. **Calculation Engine** — Pure TypeScript functions with zero UI dependencies; fully testable, deterministic, shared between results display and PDF
3. **Results Display** — Renders headline numbers on-screen with contextual alerts; deliberately withholds detailed breakdown to preserve PDF gate value
4. **PDF Generator** — @react-pdf/renderer builds a branded report client-side from the same typed output object
5. **Email Capture + Delivery** — Modal gates PDF download; serverless function sends transactional email via Resend; GDPR consent checkbox required

### Critical Pitfalls

1. **Email gate abandonment** — If on-screen results show everything, users screenshot and leave. Show only headline numbers on-screen; reserve detailed breakdown, pipeline targets, and action steps for the PDF. Frame the gate as "Get your personalised Trade Survival Report" not "Download PDF."

2. **PDF generation fails on iOS Safari** — Client-side PDF libraries render inconsistently across browsers. Use @react-pdf/renderer (not html2pdf.js) for programmatic layout. Test on Chrome, Safari, Firefox, iOS Safari, and Android Chrome before shipping. Have a serverless fallback plan if quality is insufficient.

3. **GDPR non-compliance on email capture** — Missing consent checkbox, no privacy policy link, or no double opt-in will destroy the lead list and risk fines. Implement unchecked consent checkbox, privacy policy link, and double opt-in from the first email captured. Cannot be retrofitted.

4. **75% efficiency cap feels arbitrary without explanation** — Tradespeople who believe they bill 90% will dismiss the entire tool. Show a persuasive inline explanation using "protect" not "limit" framing. Consider showing capped ("Safe") and uncapped ("Optimistic") side-by-side.

5. **Sole Trader vs Ltd tax treatment conflated** — Corp Tax language shown to sole traders erodes trust. Maintain two distinct calculation paths. Entity type must be the first question, affecting language and math on every subsequent screen.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation + Type System
**Rationale:** Architecture research identifies type definitions as the zero-dependency starting point. Everything else consumes these types. Stack research confirms TypeScript is non-negotiable for financial math.
**Delivers:** Project scaffolding (Next.js 15 + Tailwind 4 + Biome), input/output type definitions with Zod schemas, currency formatting utilities (GBP + EUR from day one), rounding strategy implementation.
**Addresses:** Entity type definitions, VAT rate types, calculator input/output interfaces.
**Avoids:** Pitfall 2 (floating point — rounding strategy defined here), Pitfall 4 (currency hardcoded as GBP only).

### Phase 2: Calculation Engine + Tests
**Rationale:** Architecture research places this before any UI. The engine is the core value — it must be correct and fully tested before rendering anything. Pitfalls research identifies zero-staff as the default test case, not an edge case.
**Delivers:** Pure `calculate()` function, tax buffer logic (Corp Tax vs pass-through), employer burden, efficiency cap, slippage factor, sales pipeline math. Full unit test suite.
**Uses:** Zod schemas from Phase 1, TypeScript for compile-time formula safety.
**Implements:** Client-side calculation engine pattern (no server round-trip).

### Phase 3: Multi-Step Form + Results Display
**Rationale:** Feature research shows multi-step forms convert 214% better. The form produces the input the engine needs. Results display consumes engine output. These are tightly coupled and should ship together for end-to-end validation.
**Delivers:** 4-6 step wizard with progress bar, react-hook-form + Zod per-step validation, nuqs URL state, responsive mobile-first layout, on-screen results with headline numbers and legal alerts.
**Addresses:** All table-stakes features (responsive, instant results, progress indicator, plain-English copy, validation).
**Avoids:** Pitfall 1 (too many fields — 2-4 fields per step), Pitfall 12 (cap explanation inline), Pitfall 14 (sessionStorage persistence).

### Phase 4: PDF Report Generation
**Rationale:** The PDF is the gated artifact — it must contain significantly more value than on-screen results. Architecture research recommends client-side generation with @react-pdf/renderer. Pitfalls research warns about cross-browser inconsistencies.
**Delivers:** Branded PDF report with detailed line-item breakdown, pipeline targets, guardrail explanations ("Reality Checks" section), dedicated disclaimer section (bordered box, not footer text).
**Uses:** @react-pdf/renderer 4.x, dynamic import (lazy-loaded on "Get Report" click to avoid initial bundle bloat).
**Implements:** Client-side PDF generation pattern.

### Phase 5: Email Capture + Delivery
**Rationale:** This is the lead capture mechanism and the product's business purpose. Depends on PDF being ready (the value exchange is email for PDF). Pitfalls research flags GDPR and deliverability as high-recovery-cost issues — must be done correctly from the start.
**Delivers:** Email capture modal with GDPR consent checkbox and privacy policy link, Vercel Serverless Function calling Resend API, branded results email via react-email, SPF/DKIM/DMARC configuration, rate limiting and honeypot on the endpoint.
**Addresses:** Email-gated PDF (P1 feature), email delivery of results (P2 feature).
**Avoids:** Pitfall 5 (gate abandonment — PDF has more value than screen), Pitfall 10 (GDPR from day one), Pitfall 11 (no PDF attachment, use download link; transactional service not marketing platform).

### Phase 6: Polish, Analytics + Launch Prep
**Rationale:** Final integration wiring, performance optimization, and analytics setup. Plausible custom events for funnel tracking must be in place before any traffic is sent.
**Delivers:** Plausible analytics with funnel events (step completion, email capture, PDF download), Lighthouse performance audit (target 90+ mobile), cross-browser testing, print CSS, accessibility pass (keyboard nav, ARIA labels, focus management), content/copy review for all disclaimer text.
**Avoids:** Pitfall 9 (slow load — verify bundle < 200KB, TTI < 2s on slow 4G), Pitfall 8 (disclaimer buried).

### Phase Ordering Rationale

- **Types before engine, engine before UI:** Architecture research identifies a strict dependency chain. Types are consumed by everything. The engine must be correct before any component renders its output. Building UI first leads to calculation logic buried in components (identified as a technical debt anti-pattern).
- **Form and results together:** They form a feedback loop — you cannot validate the form UX without seeing results, and you cannot verify results display without form inputs feeding them.
- **PDF before email:** The email gate's value proposition depends on the PDF existing and being worth gating. Building email capture before PDF means testing with a placeholder, which masks the real conversion dynamic.
- **Email last (before polish):** GDPR, deliverability, and DNS configuration are high-stakes but isolated. Getting them right requires focused attention, not integration into other work.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (PDF):** @react-pdf/renderer cross-browser behavior on mobile Safari needs hands-on prototyping before committing to the template layout. Build a throwaway test first.
- **Phase 5 (Email):** Resend + react-email integration patterns, GDPR consent storage requirements, and domain warm-up timeline need API-level research during planning.

Phases with standard patterns (skip deep research):
- **Phase 1 (Foundation):** Next.js 15 scaffolding is well-documented, `create-next-app` handles it.
- **Phase 2 (Calculation Engine):** Pure TypeScript functions with Zod — established patterns, no external dependencies.
- **Phase 3 (Form + Results):** react-hook-form multi-step wizard is a documented pattern with official examples.

## Cross-Cutting Agreements and Conflicts

### Where all four research dimensions agree:
- **Client-side calculation is non-negotiable.** Stack, features, architecture, and pitfalls all converge on this. No server round-trip for the core math.
- **The calculation engine must be isolated from UI.** Stack (pure TypeScript functions), architecture (separate `calculator/` directory), and pitfalls (inline calc logic is the #1 technical debt pattern) all insist on separation.
- **GDPR compliance is a launch blocker, not a nice-to-have.** Stack (Plausible over GA4 to avoid cookie consent), features (email gate design), and pitfalls (consent checkbox, double opt-in, privacy policy) all flag this.
- **Mobile-first is mandatory.** Features (60%+ mobile traffic), pitfalls (slow load kills conversions), and stack (Tailwind for responsive, system fonts for speed) all align.

### Where research dimensions create tension:
- **Stack recommends Next.js 15 + React 19; Pitfalls warns about heavy framework bundle size.** Resolution: Next.js static export with React Server Components for the shell keeps JS minimal. Lazy-load @react-pdf/renderer. Target < 200KB initial bundle. Monitor Lighthouse score throughout development.
- **Architecture recommends client-side PDF (jsPDF); Stack recommends @react-pdf/renderer.** Resolution: @react-pdf/renderer is the better choice — JSX-based API matches the React mental model, and v4 supports React 19. The architecture doc's jsPDF recommendation was the generic pattern; the stack research is project-specific. If quality issues arise on mobile, fall back to a serverless function.
- **Features want rich on-screen results; Pitfalls warn this kills email gate conversion.** Resolution: Show headline numbers (Monthly Revenue Target, Hourly Floor Rate) on screen. Reserve detailed breakdown, pipeline numbers, guardrail explanations, and action steps for the PDF. This is a UX design decision that must be made in Phase 3 wireframes.

## Top Actionable Insights for Roadmap Creation

1. **Build the calculation engine as a standalone, fully-tested TypeScript module before touching any UI.** This is the highest-confidence recommendation across all research. It prevents the most common technical debt pattern (calc logic in components), enables parallel work on form and results, and ensures the core value proposition is correct before anything visual exists.

2. **Design the on-screen vs. PDF content split before building either.** The email capture conversion rate depends entirely on the PDF containing significantly more value than what's shown on screen. This is a content/UX decision, not a technical one, and it must be made during Phase 3 planning — not discovered during Phase 5 integration.

3. **Implement GDPR consent, SPF/DKIM/DMARC, and email deliverability infrastructure before sending a single email.** These are the highest-recovery-cost pitfalls identified. Retroactively obtaining consent is impossible. Repairing sender reputation takes 2-4 weeks. Get it right from the first captured email.

4. **Lazy-load the PDF library and test on real mobile devices early.** @react-pdf/renderer adds significant bundle weight. Dynamic import on "Get Report" click prevents initial load penalty. Cross-browser PDF testing (especially iOS Safari) should happen during Phase 4, not Phase 6 polish.

5. **Use two distinct calculation paths for Sole Trader and Ltd Company from the start.** Do not implement one path with conditional tweaks. The entity type affects tax language, buffer labels, legal alerts, and output framing. Retrofitting dual paths is a medium-cost refactor that erodes trust if users see incorrect terminology before the fix.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommended technologies are mature, well-documented, and version-compatible. No experimental dependencies. |
| Features | HIGH | Clear competitive analysis, established lead magnet patterns, well-defined MVP vs. defer boundary. |
| Architecture | HIGH | Standard pattern for client-side calculators with minimal server needs. No novel architectural decisions. |
| Pitfalls | HIGH | Domain-specific risks (CIS/RCT, Two-Thirds Rule, GDPR) are well-documented. Technical pitfalls (PDF, floating point) are well-known. |

**Overall confidence:** HIGH

### Gaps to Address

- **@react-pdf/renderer performance on low-end mobile devices:** No benchmarks found for PDF generation time on mid-range Android phones. Build a prototype in Phase 4 and measure. If generation exceeds 3 seconds, implement a serverless fallback.
- **Resend free tier adequacy for launch:** 100 emails/day (3,000/month) is sufficient for MVP but could be hit quickly with a successful ad campaign. Have a plan to upgrade to Resend Pro ($20/month) or switch to SendGrid if volume spikes.
- **Exact on-screen vs. PDF content split:** Research establishes the principle (headline on screen, detail in PDF) but the specific content decisions need to be made during Phase 3 UX design based on the actual calculated outputs.
- **Domain warm-up timeline:** New sending domains need 2-4 weeks of gradual volume increase for good deliverability. This timeline should be factored into launch planning — the domain should start sending test emails during Phase 4/5 development.

## Sources

### Primary (HIGH confidence)
- Next.js 15 documentation (nextjs.org/docs) — App Router, static export, API routes, metadata API
- React 19 release notes (react.dev/blog) — form actions, useActionState
- @react-pdf/renderer GitHub (github.com/diegomura/react-pdf) — v4 React 19 compatibility
- react-hook-form documentation (react-hook-form.com) — multi-step form patterns
- Resend documentation (resend.com/docs) — API, React Email integration, pricing
- UK ICO guidance on cookies and GDPR consent (ico.org.uk)
- HMRC CIS guidance (gov.uk/what-is-the-construction-industry-scheme)
- Irish Revenue RCT and VAT Two-Thirds Rule guidance

### Secondary (MEDIUM confidence)
- Plausible documentation (plausible.io/docs) — GDPR compliance, custom events
- Competitor analysis: TradeSender, Tradify, Jobber calculators — feature gap identification
- Amra and Elma Lead Magnet Conversion Statistics 2026 — interactive content converts at 47.3%
- Formidable Forms multi-step form research — 214% conversion lift
- Baymard Institute checkout/form UX research
- Postmark/Resend deliverability guides

### Tertiary (LOW confidence)
- Bundle size estimates for @react-pdf/renderer on mobile — needs validation via prototype
- Resend free tier scaling behavior under burst traffic — needs monitoring at launch

---
*Research completed: 2026-03-28*
*Ready for roadmap: yes*
