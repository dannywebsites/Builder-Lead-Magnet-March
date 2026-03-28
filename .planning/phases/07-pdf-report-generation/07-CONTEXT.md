# Phase 7: PDF Report Generation - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Client-side branded PDF report containing all financial anchors, sales pipeline targets, legal alerts, plain-English notes, and asterisk disclaimers — generated using @react-pdf/renderer, lazy-loaded on user action, optimized under 500KB. This phase builds the PDF document and a download button on the results screen. Email gating (Phase 9) and GDPR consent (Phase 8) are out of scope — the button triggers a direct download for now.

</domain>

<decisions>
## Implementation Decisions

### PDF Layout & Branding
- **D-01:** PDF structure mirrors the on-screen results layout: branded header, Financial Anchors section, Alerts section (if any triggered), Sales Pipeline section, then Disclaimers footer. This consistency means the user sees the same information in the same order they just reviewed on screen.
- **D-02:** Branded header with placeholder for logo/business name at top. Exact branding can be refined later — the structure must support it.
- **D-03:** Professional, clean layout — not a screenshot of the web page. Uses @react-pdf/renderer's JSX component model to build a proper document layout.

### Content Scope
- **D-04:** PDF includes all 6 headline output values (Monthly Revenue Goal, Monthly Billings, Hourly Floor Rate, Jobs to Win, Quotes Needed, Leads Needed) with their plain-English explanations — reusing `output-copy.ts` constants.
- **D-05:** PDF includes all triggered legal alerts with their title and body text — reusing `alert-copy.ts` constants via `getTriggeredAlerts()`.
- **D-06:** PDF does NOT include intermediate calculation values (targetBusinessProfit, adjustedPayroll, totalBillableHours, realDirectCost, adjustedOverheads). These are internal engine values — the tradesperson needs actionable numbers, not the working.
- **D-07:** PDF includes a summary of key inputs at the top (entity type, gross draw, VAT rate, staff count) so the reader knows which scenario produced these numbers.

### Download Trigger UX
- **D-08:** "Get Your Trade Survival Report" button appears on the results screen, below the "Edit Your Numbers" button. Prominent CTA styling (filled, primary color) vs the edit button's outline style.
- **D-09:** @react-pdf/renderer is lazy-loaded via dynamic import when the user clicks the download button — not included in the initial bundle. This is critical for first-paint performance.
- **D-10:** Button shows a loading/generating state while the PDF is being created. After generation, triggers browser download.
- **D-11:** In Phase 9, this button will be gated behind email capture. For now, it's a direct download with no gate.

### Disclaimer Treatment
- **D-12:** All asterisk disclaimers grouped in a footer/end section of the PDF. Same copy as the on-screen disclaimers — the 30% employer burden note, Corp Tax buffer explanation, 75% efficiency cap, 15% slippage factor, etc.
- **D-13:** Footer includes a general disclaimer: "These figures use conservative buffers, not precise statutory rates. Always consult a qualified accountant."

### Carried from Prior Phases
- **D-14:** Trade language, no financial jargon — consistent with Phase 4 D-10/D-11 and Phase 5 D-06.
- **D-15:** "Protect" framing for guardrail language — consistent with Phase 4 D-09.
- **D-16:** Alert logic lives in pure `getTriggeredAlerts()` function (Phase 6 D-07) — PDF consumes this directly.
- **D-17:** Copy constants pattern (`output-copy.ts`, `alert-copy.ts`) — PDF reuses these, no duplicated copy.
- **D-18:** `CalculatorApp.tsx` already has all required data (output, currency, staffCount, alerts, input access) — PDF component receives these as props.

### Claude's Discretion
- PDF page layout specifics (margins, font sizes, spacing, column arrangement)
- Color scheme for the PDF (can differ from web — optimized for print/screen reading)
- Whether Financial Anchors render as a grid or stacked list in the PDF
- How alerts are visually distinguished from output values in print format
- Exact disclaimer text beyond the core copy constants
- File naming convention for the downloaded PDF
- Whether to include a date/timestamp on the report

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### PDF Library (Chosen Stack)
- `CLAUDE.md` §Recommended Stack — @react-pdf/renderer 4.x for client-side PDF generation with React JSX API

### Calculator Types & Data (PDF Inputs)
- `src/lib/calculator/types.ts` — CalculatorInput and CalculatorOutput interfaces (all fields the PDF needs)
- `src/lib/calculator/engine.ts` — calculate() function producing output
- `src/lib/calculator/alerts.ts` — getTriggeredAlerts() returning Alert[] for PDF alert section
- `src/lib/calculator/currency.ts` — formatCurrency() for monetary value formatting

### Copy Constants (PDF Content Source)
- `src/lib/results/output-copy.ts` — Labels and explanations for all 6 output values
- `src/lib/results/alert-copy.ts` — Titles and body text for all 4 legal alerts

### Integration Point
- `src/components/CalculatorApp.tsx` — Parent orchestrator with all data; PDF download button and generation logic connect here
- `src/components/results/ResultsView.tsx` — Results screen where download button will be placed

### Requirements
- `.planning/REQUIREMENTS.md` — PDF-01 through PDF-05 (branded PDF, includes alerts/disclaimers, cross-browser, under 500KB)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getTriggeredAlerts(input, output)` — Pure function returning Alert[] — PDF calls this directly
- `OUTPUT_COPY` — All output labels and explanations, ready for PDF content
- `ALERT_COPY` — All alert titles and body text, ready for PDF content
- `formatCurrency(value, currency)` — Formats GBP/EUR values for PDF display
- `ZERO_STAFF_HOURLY_NOTE` — Conditional note for zero-staff edge case

### Established Patterns
- JSX component model — @react-pdf/renderer uses the same pattern (Document, Page, View, Text)
- Centralized copy constants — PDF consumes existing constants, no duplication
- Feature-based folder structure — PDF components go in `src/components/pdf/` or `src/lib/pdf/`
- Lazy loading — dynamic import pattern aligns with Next.js conventions

### Integration Points
- `ResultsView` — Add download button below edit button
- `CalculatorApp` — Already has output, currency, staffCount, alerts, and access to input via the onCalculated callback. May need to store input in state for PDF generation.
- `package.json` — @react-pdf/renderer 4.x needs to be installed as a dependency

</code_context>

<specifics>
## Specific Ideas

- The PDF should feel like a professional report a business advisor would hand you, not a printout of a web page
- Input summary at the top grounds the report ("Here's what you told us → here's what the numbers say")
- The download button is the future email gate point — Phase 9 will intercept this action with an email modal

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-pdf-report-generation*
*Context gathered: 2026-03-28*
