# Architecture Research

**Domain:** Single-purpose financial calculator lead magnet (web app)
**Researched:** 2026-03-28
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Client-Side)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Multi-Step  │  │ Calculation  │  │  Results Display +   │   │
│  │  Input Form  │──│   Engine     │──│  PDF Generation      │   │
│  └──────────────┘  └──────────────┘  └──────────┬───────────┘   │
│                                                  │               │
│  ┌──────────────────────────────────────────────┐│               │
│  │           Email Capture Modal                ││               │
│  └──────────────┬───────────────────────────────┘│               │
├─────────────────┼────────────────────────────────┼───────────────┤
│                 │          NETWORK                │               │
├─────────────────┼────────────────────────────────┼───────────────┤
│                 ▼                                 ▼               │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐   │
│  │  Email Service API   │  │  Serverless Function (optional) │   │
│  │  (e.g., Resend,      │  │  - Email sending                │   │
│  │   ConvertKit API)    │  │  - PDF attachment (if needed)   │   │
│  └──────────────────────┘  └─────────────────────────────────┘   │
│                     SERVER / EDGE                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Multi-Step Form | Collect user inputs with validation, step navigation, progress indication | React/Astro form with local state, step-by-step wizard pattern |
| Calculation Engine | Pure function: inputs in, results out. All math lives here. | Standalone TypeScript module, no UI dependencies, fully testable |
| Results Display | Render calculated outputs with contextual explanations and legal alerts | Component consuming calculation engine output |
| PDF Generator | Convert results into a branded, printable PDF report | Client-side: jsPDF or react-pdf. No server round-trip needed. |
| Email Capture Modal | Gate PDF download behind email input. Trigger email delivery. | Modal overlay triggered on "Download Report" click |
| Email Delivery API | Accept email + results payload, send branded email with summary | Serverless function calling Resend/SendGrid/ConvertKit API |

## Recommended Project Structure

```
src/
├── components/          # UI components
│   ├── form/            # Multi-step form (steps, navigation, progress bar)
│   ├── results/         # Output display (metrics cards, alerts, explanations)
│   └── email-capture/   # Email gate modal
├── calculator/          # Pure calculation engine (zero UI imports)
│   ├── engine.ts        # Core calculation functions
│   ├── tax.ts           # Tax buffer logic (UK/IE Corp Tax, employer burden)
│   ├── pipeline.ts      # Sales pipeline calculations (jobs, quotes, leads)
│   ├── validators.ts    # Input validation (caps, ranges, required fields)
│   └── types.ts         # Input/output type definitions
├── pdf/                 # PDF generation
│   ├── generator.ts     # PDF layout and content assembly
│   └── templates/       # PDF visual template definitions
├── api/                 # Serverless function(s)
│   └── send-report.ts   # Email delivery endpoint
├── styles/              # Global styles, design tokens
├── assets/              # Logo, fonts for PDF branding
└── lib/                 # Shared utilities (formatting, currency, etc.)
```

### Structure Rationale

- **calculator/:** Isolated from UI so the math can be unit-tested independently and reused (e.g., called from both the results display and the PDF generator). This is the most critical code — it must be deterministic and testable without rendering anything.
- **pdf/:** Separated because PDF generation has its own layout concerns distinct from screen display. The generator consumes calculator output types directly.
- **api/:** Minimal — likely a single serverless function. Kept separate because it runs server-side (even if deployed to the same host via Vercel/Netlify functions).
- **components/:** Standard UI layer. The form, results, and email capture are distinct user-facing concerns with different interaction patterns.

## Architectural Patterns

### Pattern 1: Client-Side Calculation Engine (No Server Round-Trip)

**What:** All financial calculations execute in the browser. The calculation engine is a pure TypeScript module that takes a typed input object and returns a typed output object. No network call needed for the core value proposition.

**When to use:** When calculations are deterministic, non-secret, and don't require server-side data. This project qualifies on all counts — the formulas are fixed, there's no proprietary data lookup, and the math is intentionally transparent.

**Trade-offs:**
- Pro: Zero latency on calculation. Works offline. No server costs for the core feature.
- Pro: Simpler architecture — no API endpoint to maintain for calculations.
- Con: Formulas are visible in client JS (acceptable here — the value is in the UX, not secret math).
- Con: If formulas change, users with cached old bundles get stale results (mitigated by cache-busting on deploy).

**Example:**
```typescript
// calculator/engine.ts
interface CalculatorInput {
  entityType: 'ltd' | 'sole-trader';
  grossPersonalDraw: number;
  fixedOverheads: number;
  staffCount: number;
  staffBasePay: number;
  averageJobValue: number;
  directCostPercent: number; // capped at 80%
  vatRate: 0 | 13.5 | 20 | 23;
}

interface CalculatorOutput {
  monthlyRevenueGoalNet: number;
  monthlyBillingsGross: number;
  hourlyFloorRate: number;
  jobsToWin: number;
  quotesNeeded: number;
  leadsNeeded: number;
  alerts: Alert[];
}

export function calculate(input: CalculatorInput): CalculatorOutput {
  // Pure function — no side effects, no async, fully testable
}
```

### Pattern 2: Client-Side PDF Generation

**What:** Generate the PDF entirely in the browser using jsPDF (or similar). The user clicks "Download Report," the PDF is built in-memory from the calculation output, and the browser triggers a download — no server involved in PDF creation.

**When to use:** When the PDF is a single-page or few-page report derived from data already in the browser. When you want zero server cost for PDF generation and instant downloads.

**Trade-offs:**
- Pro: No server infrastructure for PDF generation. No latency waiting for a server render.
- Pro: PDF generation works even if the API is down (email won't send, but user gets the PDF).
- Con: Limited typographic control compared to server-side (Puppeteer/headless Chrome). jsPDF handles basics well but complex layouts need careful manual positioning.
- Con: Larger client bundle (~200KB for jsPDF). Acceptable for this use case.
- Alternative: If PDF quality requirements are high, a serverless function running Puppeteer can render an HTML template to PDF server-side. Adds ~2-5s latency and requires a serverless runtime with enough memory (512MB+).

**Decision for this project:** Start with client-side jsPDF. The report is a structured data dump (numbers, text, branding), not a complex visual layout. If the output quality is insufficient, upgrade to server-side Puppeteer as a second pass.

### Pattern 3: Thin Serverless API for Email Only

**What:** The only server-side code is a single serverless function that receives the user's email address and a results summary payload, then calls an email service API (Resend, SendGrid, or ConvertKit) to deliver the branded results email. Optionally, it also subscribes the email to a mailing list.

**When to use:** When the app is otherwise fully client-side but needs server-side secrets (API keys) for email delivery. A serverless function keeps the API key off the client.

**Trade-offs:**
- Pro: Minimal server code. One function, one job. Easy to maintain.
- Pro: API keys never touch the browser.
- Con: Adds a deployment dependency (Vercel Functions, Netlify Functions, or Cloudflare Workers). But these are zero-config on modern hosting platforms.
- Con: Email delivery is async — the user may not see the email for seconds/minutes. The PDF download should be the immediate reward; the email is a backup/bonus.

## Data Flow

### Primary Calculator Flow

```
[User fills form step-by-step]
    ↓ (form state updates on each step)
[Input validation runs per-step]
    ↓ (all steps complete)
[Calculation engine executes — pure function call]
    ↓ (returns CalculatorOutput)
[Results screen renders metrics, alerts, explanations]
    ↓ (user clicks "Download My Report")
[Email capture modal appears]
    ↓ (user enters email, submits)
[Two parallel actions]:
    ├──→ [Client: PDF generated in-browser → download triggered]
    └──→ [Client → API: POST /api/send-report {email, results}]
              ↓
         [Serverless function → Email service API]
              ↓
         [User receives email with results summary]
```

### State Management

```
[Form State (local/component)]
    ↓ (on final step submit)
[calculatorInput object assembled]
    ↓
[calculate(input) called — synchronous, pure]
    ↓
[calculatorOutput stored in local state]
    ↓ (consumed by)
    ├── Results display components
    ├── PDF generator
    └── Email API payload
```

No global state management library needed. This is a linear flow — data moves in one direction from form to calculation to output. React useState/useReducer (or equivalent) at the page level is sufficient.

### Key Data Flows

1. **Form → Calculation:** User inputs are validated per-step, assembled into a typed CalculatorInput object, and passed to the pure calculation function. No network involved.
2. **Calculation → Display:** CalculatorOutput is rendered directly into results components. Alerts and legal warnings are part of the output type.
3. **Calculation → PDF:** Same CalculatorOutput is passed to the PDF generator, which formats it into a branded layout and triggers a browser download.
4. **Email + Results → Server → Email Service:** The email address and a subset of results are POSTed to a serverless function, which formats and sends via an email API. The email payload should be a lean summary (not the full PDF) to keep the serverless function simple.

## Build Order (Dependency Chain)

| Phase | What to Build | Depends On | Why This Order |
|-------|---------------|------------|----------------|
| 1 | Type definitions (input/output interfaces) | Nothing | Everything else consumes these types |
| 2 | Calculation engine + unit tests | Types | Core value — must be correct before any UI |
| 3 | Multi-step form + validation | Types | Produces the input the engine needs |
| 4 | Results display | Engine + form | Consumes engine output, needs form to feed it |
| 5 | PDF generation | Engine output types | Consumes same output as results display |
| 6 | Email capture modal | Results display | Sits between results and PDF download |
| 7 | Email delivery API | Nothing (parallel with 3-6) | Independent serverless function |
| 8 | Integration wiring | All above | Connect email capture → PDF download + API call |

Phases 3-6 can overlap. Phase 7 (email API) can be built in parallel with everything else since it's a standalone serverless function.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k visitors/mo | Static site + single serverless function. Zero scaling concerns. Free tier on Vercel/Netlify handles this trivially. |
| 10k-100k visitors/mo | Still fine. Calculations are client-side so server load is only email submissions (~1-5% of visitors). Monitor email API rate limits. |
| 100k+ visitors/mo | Client-side architecture means the "server" only handles email sends. At 5% conversion = 5k emails/mo = trivial. The bottleneck would be CDN bandwidth for the static site, which is effectively unlimited on modern platforms. |

### Scaling Priorities

1. **First bottleneck:** Email service rate limits. At high volume, batch-friendly services (Resend, SendGrid) handle this natively. Not a real concern until 10k+ emails/month.
2. **Second bottleneck:** There isn't one. A static site with client-side calculations and a single serverless email function has essentially no scaling ceiling at lead-magnet traffic levels.

## Anti-Patterns

### Anti-Pattern 1: Server-Side Calculation Engine

**What people do:** Send form inputs to an API, calculate on the server, return results to the client.
**Why it's wrong:** Adds unnecessary latency, server cost, and a failure mode (API down = calculator broken). For a fixed-formula calculator with no secret data, server-side calculation is pure overhead.
**Do this instead:** Pure client-side calculation engine. Ship the math in the JS bundle.

### Anti-Pattern 2: Gating the Calculator Itself Behind Email

**What people do:** Require email before the user can even use the calculator.
**Why it's wrong:** Kills conversion. The user hasn't experienced any value yet, so the email feels like a cost with no payoff. PROJECT.md explicitly states the calculator is ungated.
**Do this instead:** Let them use the full calculator freely. Gate only the PDF report download — by then they've seen their numbers and want to keep them.

### Anti-Pattern 3: Complex State Management for a Linear Flow

**What people do:** Reach for Redux, Zustand, or global state stores for a step-by-step form.
**Why it's wrong:** This is a single-direction, single-session flow. Global state adds complexity, boilerplate, and cognitive load for zero benefit.
**Do this instead:** Local component state (useState/useReducer) at the page level. Pass calculation output down as props. The entire app state fits in one object.

### Anti-Pattern 4: Server-Side PDF with Queues and Workers

**What people do:** Set up a PDF generation queue with background workers, S3 storage, and signed download URLs.
**Why it's wrong:** Massively over-engineered for a 2-3 page report generated from data already in the browser. Adds infrastructure, latency, and failure modes.
**Do this instead:** Client-side PDF generation with jsPDF. The PDF is built from data already in memory. If quality needs improvement later, upgrade to a single serverless function with Puppeteer — still no queues needed.

### Anti-Pattern 5: Embedding Sensitive API Keys in Client Code

**What people do:** Call the email service directly from the browser with the API key in the JS bundle.
**Why it's wrong:** Anyone can extract the key and abuse the email service (send spam, exhaust quota).
**Do this instead:** Thin serverless function as a proxy. The API key lives in an environment variable on the server. The client sends email + payload to your function; the function calls the email service.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Email delivery (Resend / SendGrid) | Serverless function calls REST API with API key from env var | Resend is simpler and cheaper for low volume. SendGrid has more template features. Either works. |
| Email list (ConvertKit / Mailchimp) | Same serverless function adds subscriber via API after sending email | Can be the same API call if using ConvertKit (it sends + subscribes). Otherwise, two API calls in the same function. |
| Hosting (Vercel / Netlify / Cloudflare Pages) | Static site deployment + serverless functions in same repo | All three support this natively. Vercel has the smoothest DX for Next.js/Astro. |
| Analytics (Plausible / PostHog) | Client-side script tag, no server integration | Track: form starts, form completions, email submissions, PDF downloads. Privacy-friendly options preferred for UK/IE GDPR. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Form → Calculation Engine | Direct function call (synchronous) | Engine is imported as a module. No serialization needed. |
| Calculation Engine → Results Display | Props / local state | Output object passed directly to rendering components. |
| Calculation Engine → PDF Generator | Direct function call | PDF generator receives the same typed output object. |
| Email Capture → Serverless API | HTTP POST (fetch) | Only network boundary in the entire app. Payload: {email, resultsSummary}. |
| Serverless API → Email Service | HTTP POST (SDK/REST) | Server-to-server. API key in env var. |

## Client-Side vs Server-Side Decision Summary

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Calculation engine | CLIENT | No secrets, no external data, instant feedback, works offline |
| Input validation | CLIENT | Immediate UX feedback; server validation unnecessary (no persistence) |
| PDF generation | CLIENT | Data already in browser, avoids server round-trip, jsPDF sufficient for structured reports |
| Email sending | SERVER | API keys must not be in client code; serverless function is the minimal server footprint |
| List subscription | SERVER | Same function as email sending; bundled into one serverless call |
| Analytics | CLIENT | Script tag, no server processing needed |

## Hosting Architecture Recommendation

**Static site + serverless function, single repo, single deploy.**

```
[GitHub Repo]
    ↓ (push to main)
[Vercel / Netlify / Cloudflare Pages]
    ├── Static site build (HTML/CSS/JS) → CDN edge nodes globally
    └── Serverless function (/api/send-report) → edge or regional function
```

- Zero server management
- Free tier covers lead-magnet traffic levels comfortably
- Automatic HTTPS, CDN, preview deploys
- Serverless function cold starts are ~100-200ms (acceptable for email sends — user isn't waiting for a response)

## Sources

- jsPDF documentation: client-side PDF generation capabilities and limitations
- Vercel/Netlify serverless function patterns for email delivery
- Resend API: modern email delivery for transactional email
- ConvertKit API: email capture + subscriber management for lead magnets
- Lead magnet calculator patterns from financial services and SaaS verticals
- GDPR considerations for UK/IE email capture (consent, data minimization)

---
*Architecture research for: Trade Survival Calculator (single-purpose financial calculator lead magnet)*
*Researched: 2026-03-28*
