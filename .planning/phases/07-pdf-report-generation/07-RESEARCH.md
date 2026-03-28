# Phase 7: PDF Report Generation - Research

**Researched:** 2026-03-28
**Domain:** Client-side PDF generation with @react-pdf/renderer in Next.js 15 / React 19
**Confidence:** HIGH

## Summary

This phase implements a branded, downloadable PDF report using @react-pdf/renderer 4.x, the library already specified in the project stack. The library provides a JSX-based API (Document, Page, View, Text, StyleSheet) that maps directly to the component model used throughout the project. All data the PDF needs already exists in the codebase: `CalculatorOutput` and `CalculatorInput` types, `OUTPUT_COPY` and `ALERT_COPY` constants, `formatCurrency()`, and `getTriggeredAlerts()`.

The primary technical challenges are: (1) lazy-loading @react-pdf/renderer (approximately 450KB bundled) so it does not impact initial page load, (2) triggering a programmatic download via the `pdf()` function rather than using `PDFDownloadLink` (which would require the library to be mounted in the DOM), and (3) keeping the generated PDF under 500KB by using system-safe fonts and avoiding embedded images where possible.

**Primary recommendation:** Use the `pdf().toBlob()` imperative API inside a dynamic `import()` triggered by the download button click. This avoids mounting any react-pdf components in the React tree, keeps the library fully lazy-loaded, and gives direct control over the download trigger and loading state.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: PDF structure mirrors on-screen results layout: branded header, Financial Anchors, Alerts (if triggered), Sales Pipeline, Disclaimers footer
- D-02: Branded header with placeholder for logo/business name at top
- D-03: Professional, clean layout using @react-pdf/renderer JSX component model (not a web page screenshot)
- D-04: PDF includes all 6 headline output values with plain-English explanations from output-copy.ts
- D-05: PDF includes all triggered legal alerts with title and body from alert-copy.ts via getTriggeredAlerts()
- D-06: PDF does NOT include intermediate calculation values (targetBusinessProfit, adjustedPayroll, totalBillableHours, realDirectCost, adjustedOverheads)
- D-07: PDF includes a summary of key inputs at top (entity type, gross draw, VAT rate, staff count)
- D-08: "Get Your Trade Survival Report" button on results screen, below "Edit Your Numbers", prominent CTA styling
- D-09: @react-pdf/renderer lazy-loaded via dynamic import on button click, not in initial bundle
- D-10: Button shows loading/generating state while PDF is created, then triggers browser download
- D-11: Direct download for now (no email gate until Phase 9)
- D-12: All asterisk disclaimers grouped in footer/end section, same copy as on-screen disclaimers
- D-13: Footer includes general disclaimer: "These figures use conservative buffers, not precise statutory rates. Always consult a qualified accountant."
- D-14: Trade language, no financial jargon (consistent with Phase 4/5)
- D-15: "Protect" framing for guardrail language (consistent with Phase 4)
- D-16: Alert logic via pure getTriggeredAlerts() function (Phase 6) -- PDF consumes directly
- D-17: Copy constants pattern (output-copy.ts, alert-copy.ts) -- PDF reuses, no duplication
- D-18: CalculatorApp.tsx already has all required data; PDF component receives as props

### Claude's Discretion
- PDF page layout specifics (margins, font sizes, spacing, column arrangement)
- Color scheme for PDF (can differ from web -- optimized for print/screen reading)
- Whether Financial Anchors render as grid or stacked list in PDF
- How alerts are visually distinguished from output values in print format
- Exact disclaimer text beyond core copy constants
- File naming convention for downloaded PDF
- Whether to include date/timestamp on the report

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PDF-01 | Branded, printable PDF containing all financial anchors and sales marching orders | @react-pdf/renderer 4.x JSX components (Document, Page, View, Text, StyleSheet); layout mirrors ResultsView sections per D-01 |
| PDF-02 | PDF includes all plain-English notes and asterisk disclaimers from the output | Reuse OUTPUT_COPY explanations and disclaimer constants; grouped footer section per D-12/D-13 |
| PDF-03 | PDF includes all triggered legal alerts | Reuse getTriggeredAlerts() and ALERT_COPY per D-05/D-16; rendered in dedicated Alerts section |
| PDF-04 | PDF renders correctly across browsers (Chrome, Safari, Firefox, Edge) | pdf().toBlob() generates standard PDF binary; browser download via URL.createObjectURL is universal; no browser-specific rendering concerns since PDF is a document format |
| PDF-05 | PDF file size optimized (under 500KB) | Use built-in Helvetica font (no font embedding); avoid embedded images; text-only report will be well under 500KB |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, pnpm
- **@react-pdf/renderer 4.x**: Specified as the PDF generation library in the recommended stack
- **Client-side only**: No server needed for PDF generation; runs entirely in the browser
- **No login**: Calculator works without authentication; email capture only at report download (Phase 9)
- **Trade language**: Plain English, no financial jargon
- **Conservative buffers**: 20% Corp Tax, 30% employer burden -- always disclaim with asterisk notes
- **Biome** for linting/formatting (not ESLint/Prettier)
- **Vitest** for testing (jsdom environment)

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @react-pdf/renderer | 4.3.2 | Client-side PDF generation | JSX component API (Document, Page, View, Text, StyleSheet). React 19 compatible since v4.1.0. Declared in project stack. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | -- | -- | The pdf().toBlob() API + URL.createObjectURL + anchor click handles download without file-saver or other deps |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pdf().toBlob() imperative API | PDFDownloadLink component | PDFDownloadLink requires mounting in React tree and starts generating immediately. The imperative API gives full control over when generation happens (on click) and loading state management. |
| pdf().toBlob() imperative API | usePDF hook | Hook starts rendering on mount. We want generation only on explicit button click for lazy-loading. |
| Built-in Helvetica | Custom fonts (Inter, etc.) | Custom fonts add 50-200KB to PDF size and require Font.register() with URL or bundled font files. Helvetica is built-in, professional, and keeps PDF small. |

**Installation:**
```bash
pnpm add @react-pdf/renderer
```

**Version verification:** @react-pdf/renderer 4.3.2 confirmed via `npm view` on 2026-03-28. React 19 compatible since v4.1.0.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── pdf/
│       ├── TradeSurvivalReport.tsx    # Document/Page layout component
│       ├── ReportHeader.tsx           # Branded header section
│       ├── InputSummary.tsx           # Key inputs summary
│       ├── FinancialAnchorsSection.tsx # 6 headline values
│       ├── AlertsSection.tsx          # Triggered legal alerts
│       ├── PipelineSection.tsx        # Sales pipeline metrics
│       └── DisclaimersFooter.tsx      # Asterisk disclaimers + general disclaimer
├── lib/
│   └── pdf/
│       └── generate-report.ts        # Lazy-loaded: pdf().toBlob() + download trigger
└── components/
    └── results/
        └── ResultsView.tsx           # Modified: add download button
```

### Pattern 1: Imperative PDF Generation with Lazy Loading
**What:** Dynamic import of @react-pdf/renderer on button click, using pdf().toBlob() for generation
**When to use:** When the PDF library should not be in the initial bundle and generation is triggered by user action
**Example:**
```typescript
// src/lib/pdf/generate-report.ts
// This entire module is lazy-loaded via dynamic import

import type { CalculatorInput, CalculatorOutput, Currency } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

export async function generateAndDownloadReport(
  input: CalculatorInput,
  output: CalculatorOutput,
  currency: Currency,
  alerts: Alert[],
): Promise<void> {
  // Dynamic import -- @react-pdf/renderer loads HERE, not at page load
  const { pdf } = await import("@react-pdf/renderer");
  const { TradeSurvivalReport } = await import("@/components/pdf/TradeSurvivalReport");

  const blob = await pdf(
    TradeSurvivalReport({ input, output, currency, alerts })
  ).toBlob();

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trade-survival-report.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

### Pattern 2: PDF Document Component Structure
**What:** React-pdf JSX components structured as a proper document layout
**When to use:** For all PDF content composition
**Example:**
```typescript
// src/components/pdf/TradeSurvivalReport.tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  // ... more styles
});

interface ReportProps {
  input: CalculatorInput;
  output: CalculatorOutput;
  currency: Currency;
  alerts: Alert[];
}

export function TradeSurvivalReport({ input, output, currency, alerts }: ReportProps) {
  return (
    <Document title="Trade Survival Report" author="Trade Survival Calculator">
      <Page size="A4" style={styles.page}>
        <ReportHeader />
        <InputSummary input={input} currency={currency} />
        <FinancialAnchorsSection output={output} currency={currency} staffCount={input.staffCount} />
        {alerts.length > 0 && <AlertsSection alerts={alerts} />}
        <PipelineSection output={output} />
        <DisclaimersFooter />
      </Page>
    </Document>
  );
}
```

### Pattern 3: Download Button with Loading State
**What:** Button that triggers lazy import, shows loading state, then downloads
**When to use:** In ResultsView as the primary CTA
**Example:**
```typescript
// In ResultsView.tsx or a dedicated DownloadReportButton component
const [isGenerating, setIsGenerating] = useState(false);

async function handleDownload() {
  setIsGenerating(true);
  try {
    const { generateAndDownloadReport } = await import("@/lib/pdf/generate-report");
    await generateAndDownloadReport(input, output, currency, alerts);
  } catch (error) {
    console.error("PDF generation failed:", error);
    // Could show toast via sonner
  } finally {
    setIsGenerating(false);
  }
}
```

### Anti-Patterns to Avoid
- **Importing @react-pdf/renderer at module top level:** This defeats lazy loading. The entire library (~450KB) would be in the initial bundle. Always use dynamic `import()` inside the click handler.
- **Using PDFDownloadLink directly:** It starts generating the PDF on mount. For lazy loading, the imperative `pdf()` API is required.
- **Embedding custom fonts:** Each font weight/style adds 50-200KB. Helvetica is built-in and professional. Only add custom fonts if branding requires it (not specified in decisions).
- **Embedding large images:** A logo should be small (< 10KB) or text-based. Avoid embedding full-resolution images.
- **Duplicating copy constants:** The PDF MUST reuse `OUTPUT_COPY`, `ALERT_COPY`, and `formatCurrency()` -- not hardcode strings.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF generation | Canvas-based PDF, jsPDF manual positioning | @react-pdf/renderer JSX components | Declarative layout, proper text reflow, automatic page breaks |
| File download trigger | Custom download logic with fetch/XHR | URL.createObjectURL + anchor click pattern | Standard browser API, works across all browsers, no dependencies |
| Currency formatting in PDF | Manual GBP/EUR formatting | Existing `formatCurrency()` from `@/lib/calculator/currency` | Already handles locale, currency symbols, decimal precision |
| Alert determination | Re-implementing alert conditions | Existing `getTriggeredAlerts()` from `@/lib/calculator/alerts` | Pure function, already tested, same logic as on-screen |

**Key insight:** Nearly all content logic for the PDF already exists in the codebase. The PDF is a presentation layer that consumes existing pure functions and copy constants -- it should add zero new business logic.

## Common Pitfalls

### Pitfall 1: SSR Crash with @react-pdf/renderer
**What goes wrong:** @react-pdf/renderer depends on browser APIs and crashes during Next.js server-side rendering or static generation.
**Why it happens:** Next.js pre-renders pages on the server. If @react-pdf/renderer is imported at the module level, it runs in Node.js where browser APIs don't exist.
**How to avoid:** Never import @react-pdf/renderer at the top of any file that participates in SSR. Use dynamic `import()` inside event handlers only. The `generate-report.ts` module should only ever be loaded client-side via `await import()`.
**Warning signs:** Build errors mentioning `document`, `window`, or `canvas` not defined.

### Pitfall 2: PDF Library in Initial Bundle
**What goes wrong:** @react-pdf/renderer (~450KB bundled) ends up in the main JavaScript bundle, destroying first-paint performance.
**Why it happens:** A static `import` anywhere in the component tree that renders on page load will include the library in the initial chunk.
**How to avoid:** The ONLY import of @react-pdf/renderer should be inside the `generateAndDownloadReport()` function, which itself is loaded via `await import()`. No component that renders on initial page load should reference the PDF library.
**Warning signs:** Large initial bundle size, slow first paint, @react-pdf visible in Next.js bundle analyzer.

### Pitfall 3: formatCurrency Uses Intl.NumberFormat (Browser-Only in PDF Context)
**What goes wrong:** Not a problem here since PDF generation runs client-side, but worth noting: `Intl.NumberFormat` is available in all modern browsers. The existing `formatCurrency()` function works fine inside the PDF generation flow.
**How to avoid:** No action needed -- just use the existing function.

### Pitfall 4: PDF Text Wrapping and Overflow
**What goes wrong:** Long text (especially alert body paragraphs) overflows the page or gets cut off.
**Why it happens:** @react-pdf/renderer uses a flexbox model but does not support all CSS overflow behaviors. Text wrapping requires proper `width` constraints on parent Views.
**How to avoid:** Set explicit widths on container Views. Use `wrap={true}` on Page (default). Test with the longest possible alert text (the Two-Thirds Rule body is ~80 words).
**Warning signs:** Text disappearing or running off the page edge.

### Pitfall 5: CalculatorInput Not Available in ResultsView
**What goes wrong:** The PDF needs `CalculatorInput` for the input summary (D-07), but `ResultsView` currently only receives `output`, `currency`, `staffCount`, and `alerts`.
**Why it happens:** The original design passed only what the results display needed. The PDF needs additional input fields (entityType, grossPersonalDraw, vatRate).
**How to avoid:** Extend `CalculatorApp` state to store the full `CalculatorInput` alongside results. Pass it down to ResultsView (or the download button component) as a prop. The `onCalculated` callback already receives `input` as the 4th argument (added in Phase 6 D-07).
**Warning signs:** Missing data in the PDF input summary section.

## Code Examples

### Complete Download Button Component
```typescript
// Source: Verified pattern from react-pdf.org/advanced + Next.js dynamic import docs
"use client";

import { useState } from "react";
import type { CalculatorInput, CalculatorOutput, Currency } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

interface DownloadReportButtonProps {
  input: CalculatorInput;
  output: CalculatorOutput;
  currency: Currency;
  alerts: Alert[];
}

export function DownloadReportButton({ input, output, currency, alerts }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const { generateAndDownloadReport } = await import("@/lib/pdf/generate-report");
      await generateAndDownloadReport(input, output, currency, alerts);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className="px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {isGenerating ? "Generating Report..." : "Get Your Trade Survival Report"}
    </button>
  );
}
```

### StyleSheet Pattern for Print-Optimized PDF
```typescript
// Source: react-pdf.org/styling + react-pdf.org/components
import { StyleSheet } from "@react-pdf/renderer";

export const reportStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#1e3a5f",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    width: "40%",
  },
  metricValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    width: "25%",
    textAlign: "right",
  },
  metricExplanation: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  alertBox: {
    backgroundColor: "#fef3c7",
    padding: 10,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  alertTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
  },
  alertBody: {
    fontSize: 9,
    color: "#78350f",
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 7,
    color: "#9ca3af",
    marginTop: 4,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});
```

### Built-in Fonts Available (No Registration Required)
```typescript
// @react-pdf/renderer includes these fonts by default:
// - Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
// - Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
// - Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic
// Use fontFamily: "Helvetica" and fontFamily: "Helvetica-Bold" directly
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @react-pdf/renderer v3 | v4.x (React 19 support) | v4.1.0 (2024) | Required for this project's React 19 stack |
| PDFDownloadLink as primary API | pdf().toBlob() imperative API | Available since v2+ | Better for lazy loading -- no component mounting needed |
| Custom font embedding as default | Built-in Helvetica for simplicity | Always available | Saves 50-200KB+ per font, sufficient for professional reports |

**Deprecated/outdated:**
- `@react-pdf/renderer` v3.x: Does NOT support React 19. Must use v4.x.
- `@tailwind` directives in CSS: Tailwind v4 uses `@import "tailwindcss"` (not relevant to PDF but noted for project consistency).

## Open Questions

1. **Logo in PDF header (D-02)**
   - What we know: D-02 specifies "placeholder for logo/business name at top." The report is for the Trade Survival Calculator brand, not the user's business.
   - What's unclear: Whether a logo image file exists or needs to be created, or if text-only branding is sufficient for now.
   - Recommendation: Use text-only branding ("Trade Survival Report" as the header title) with a styled header bar. Logo image can be added later without structural changes. This avoids embedding image bytes and keeps PDF small.

2. **Input summary -- which inputs to show (D-07)**
   - What we know: D-07 says "entity type, gross draw, VAT rate, staff count"
   - What's unclear: Whether additional inputs (fixed overheads, avg job value, direct cost %) should also appear
   - Recommendation: Show exactly the 4 specified in D-07. These identify the scenario. Other inputs are operational details.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x with jsdom |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PDF-01 | Branded PDF generates with correct financial data | unit | `pnpm vitest run src/components/pdf/__tests__/TradeSurvivalReport.test.tsx -x` | No -- Wave 0 |
| PDF-02 | PDF includes all disclaimers and plain-English notes | unit | `pnpm vitest run src/components/pdf/__tests__/TradeSurvivalReport.test.tsx -x` | No -- Wave 0 |
| PDF-03 | PDF includes all triggered legal alerts | unit | `pnpm vitest run src/components/pdf/__tests__/TradeSurvivalReport.test.tsx -x` | No -- Wave 0 |
| PDF-04 | PDF renders correctly across browsers | manual-only | Manual browser testing -- PDF is a standard format, cross-browser concerns are minimal | N/A |
| PDF-05 | PDF file size under 500KB | unit | `pnpm vitest run src/lib/pdf/__tests__/generate-report.test.ts -x` | No -- Wave 0 |

### Testing Strategy for @react-pdf/renderer
Testing PDF content directly is challenging because @react-pdf/renderer outputs binary PDF data. The recommended approach:
1. **Component structure tests:** Verify the TradeSurvivalReport component renders without errors given valid props (smoke test). Use `pdf(<TradeSurvivalReport ... />).toBlob()` and assert it returns a Blob.
2. **Content verification:** Test that the component receives and passes through all required data by testing the sub-components in isolation (e.g., FinancialAnchorsSection receives correct props).
3. **File size test:** Generate a PDF with realistic data and assert `blob.size < 500 * 1024`.
4. **Note:** @react-pdf/renderer requires browser-like environment. Vitest with jsdom may need additional mocking. If jsdom is insufficient, tests can use the `pdf()` API in a node-compatible way (react-pdf supports Node.js rendering).

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/pdf/__tests__/TradeSurvivalReport.test.tsx` -- covers PDF-01, PDF-02, PDF-03
- [ ] `src/lib/pdf/__tests__/generate-report.test.ts` -- covers PDF-05 (file size assertion)
- [ ] Install @react-pdf/renderer: `pnpm add @react-pdf/renderer`

## Sources

### Primary (HIGH confidence)
- [react-pdf.org/components](https://react-pdf.org/components) -- Complete component API reference (Document, Page, View, Text, Image, Link, Canvas, StyleSheet)
- [react-pdf.org/advanced](https://react-pdf.org/advanced) -- pdf() function, PDFDownloadLink, BlobProvider, usePDF hook APIs
- [react-pdf.org/styling](https://react-pdf.org/styling) -- Full list of supported CSS properties, flexbox model, valid units
- [react-pdf.org/fonts](https://react-pdf.org/fonts) -- Font.register() API, built-in fonts, supported formats
- [react-pdf.org/compatibility](https://react-pdf.org/compatibility) -- React 19 support confirmed since v4.1.0
- npm registry -- @react-pdf/renderer 4.3.2 confirmed as latest version (2026-03-28)

### Secondary (MEDIUM confidence)
- [Next.js 14 and react-pdf integration (Medium)](https://benhur-martins.medium.com/nextjs-14-and-react-pdf-integration-ccd38b1fd515) -- Dynamic import with ssr: false pattern, verified against official docs
- [Bundlephobia](https://bundlephobia.com/package/@react-pdf/renderer) -- Bundle size ~450KB (approximate, verified by multiple sources)
- [diegomura/react-pdf GitHub Discussion #2352](https://github.com/diegomura/react-pdf/discussions/2352) -- pdf().toBlob() for programmatic download without rendering

### Tertiary (LOW confidence)
- None -- all findings verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- @react-pdf/renderer 4.3.2 is the project's declared library, version verified against npm registry, React 19 compatibility confirmed in official docs
- Architecture: HIGH -- pdf().toBlob() imperative API, dynamic import pattern, and JSX component model all verified against official react-pdf.org documentation
- Pitfalls: HIGH -- SSR crash and bundle size concerns are well-documented across multiple sources and official Next.js documentation

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable library, slow-moving API)
