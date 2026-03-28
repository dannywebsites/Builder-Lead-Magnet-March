# Phase 6: Legal Alerts - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Conditional legal and tax alerts that fire based on user inputs and calculation results — Gross Draw warning, Irish Two-Thirds VAT rule, efficiency cap explanation, and CIS/RCT subcontractor warning. Alerts display on the results screen alongside existing financial anchors and pipeline numbers. No new form inputs, no PDF changes, no email capture.

</domain>

<decisions>
## Implementation Decisions

### Alert Placement
- **D-01:** Alerts display in a dedicated section between the Financial Anchors and Sales Pipeline sections on the results screen. They are important legal notices that should not be missed but should not displace the headline financial numbers.
- **D-02:** Only triggered alerts display — no empty section or placeholder when no alerts fire.

### Alert Visual Treatment
- **D-03:** Amber/warning-styled cards with an icon and plain-English explanation text. Visually distinct from both the Financial Anchor cards (white bg/shadow) and Pipeline metrics (gray-50) to signal "this is a legal notice, not a calculation result."
- **D-04:** "Protect" framing for all alert copy — consistent with Phase 4 D-09. Example: "This protects you from..." not "You are limited to..."
- **D-05:** Trade language, no financial jargon — consistent with Phase 4 D-10/D-11. Alerts should feel like a knowledgeable friend flagging something important.
- **D-06:** Always-visible inline text, no collapsible/accordion/tooltip treatment — consistent with Phase 5 D-13.

### Alert Trigger Logic
- **D-07:** Alert triggers live in a separate pure function module (`src/lib/calculator/alerts.ts`) — follows the existing pattern of pure calculation functions. Takes CalculatorInput + CalculatorOutput and returns an array of triggered alerts.
- **D-08:** Each alert has a unique key, title, body text, and trigger condition — fully testable independently.

### Alert-Specific Behavior
- **D-09:** ALRT-01 (Gross Draw Warning) — Always displays for both entity types. Explains that the business target does not cover the owner's personal income tax.
- **D-10:** ALRT-02 (Irish Two-Thirds Rule) — Triggers when vatRate === 0.135 AND directCostPct > 0.66. Warns that the 23% rate must be used instead.
- **D-11:** ALRT-03 (Efficiency Cap) — Always displays when staffCount > 0. Explains the 75% billable hours cap and why it protects the business.
- **D-12:** ALRT-04 (CIS/RCT Warning) — Always displays. Warns about cash flow impact of withholding tax for subcontractors (up to 30% UK / 35% IE).

### Alert Copy
- **D-13:** Centralized alert copy constants in a dedicated file (`src/lib/results/alert-copy.ts`) — mirrors the `field-copy.ts` and `output-copy.ts` pattern from prior phases.

### Carried from Prior Phases
- **D-14:** Two-section results layout with Financial Anchors + Pipeline (Phase 5 D-01/D-02) — alerts section inserts between them.
- **D-15:** `ResultsView` component is the integration point — receives CalculatorOutput, currency, and staffCount already (Phase 5).
- **D-16:** Currency formatting via `formatCurrency()` for any monetary values in alerts.

### Claude's Discretion
- Exact amber/warning color values and border treatment (within Tailwind palette)
- Alert icon choice (warning triangle, info circle, etc.)
- Whether to group alerts by type or display as a flat list
- Exact wording of all alert copy (tone: direct, protective, conversational)
- Animation/transition for alerts appearing
- Order of alerts when multiple trigger simultaneously

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Alert Requirements
- `.planning/REQUIREMENTS.md` — ALRT-01 through ALRT-04 (all legal alert requirements with trigger conditions)

### Calculator Types (Alert Inputs)
- `src/lib/calculator/types.ts` — CalculatorInput (entityType, vatRate, directCostPct, staffCount) and CalculatorOutput interfaces
- `src/lib/calculator/engine.ts` — calculate() function that produces the output alerts consume

### Results Integration Point
- `src/components/results/ResultsView.tsx` — Current results layout where alerts section will be inserted
- `src/components/CalculatorApp.tsx` — Parent orchestrator passing output, currency, staffCount to ResultsView

### Copy Pattern References
- `src/lib/results/output-copy.ts` — Existing output copy constants pattern to replicate for alert copy
- `src/lib/form/field-copy.ts` — Centralized copy constants pattern (original template)

### Visual Pattern References
- `src/components/results/FinancialAnchorCard.tsx` — White bg with shadow (alerts should be visually distinct from this)
- `src/components/results/PipelineMetric.tsx` — Gray-50 without shadow (alerts should also be distinct from this)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `formatCurrency(value, currency)` — For any monetary values in alert text
- `output-copy.ts` pattern — Centralized copy constant structure to replicate for alert copy
- `FinancialAnchorCard` / `PipelineMetric` — Reference for card component patterns (alerts will follow similar structure but with distinct styling)

### Established Patterns
- Pure function modules in `src/lib/calculator/` — Alert trigger logic follows this pattern
- Centralized copy constants in dedicated files — Alert copy follows this pattern
- Feature-based folder structure — Alert components go in `src/components/results/`
- Tailwind utility classes for all styling
- `ResultsView` receives props from `CalculatorApp` — alerts will need CalculatorInput data passed through

### Integration Points
- `ResultsView` — Needs to accept alerts array and render the alerts section between anchors and pipeline
- `CalculatorApp` — May need to pass additional input data (entityType, vatRate, directCostPct) to ResultsView for alert triggering, or compute alerts at the app level and pass them down
- `CalculatorInput` — Alert triggers need access to input fields (entityType, vatRate, directCostPct, staffCount) not just output

</code_context>

<specifics>
## Specific Ideas

- Alerts should feel like a knowledgeable friend tapping you on the shoulder — not a legal disclaimer wall
- The Two-Thirds Rule alert is the most actionable — it tells the user to change their VAT rate selection, which they can do by hitting "Edit Your Numbers"
- CIS/RCT warning should mention both UK and Ireland withholding rates since the calculator serves both markets

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-legal-alerts*
*Context gathered: 2026-03-28*
