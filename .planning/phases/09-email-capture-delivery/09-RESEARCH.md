# Phase 9: Email Capture & Delivery - Research

**Researched:** 2026-03-28
**Domain:** Email capture modal, Resend transactional email, react-email templates, Next.js API routes
**Confidence:** HIGH

## Summary

Phase 9 transforms the existing direct PDF download into a lead-gated flow: a modal intercepts the download button, captures the user's email with GDPR consent, sends a branded results summary email via Resend, and then triggers the PDF download. This is the first API route in the project.

The stack is well-defined by CLAUDE.md and CONTEXT.md decisions: Resend SDK for email delivery, react-email for templates, sonner for toast notifications, and a single Next.js App Router API route at `/api/send-report`. The existing `DownloadReportButton`, `ConsentCheckbox`, copy constants, and `generateAndDownloadReport()` are all reusable. The primary implementation work is: (1) a modal component with react-hook-form, (2) the API route handler, (3) the react-email template, and (4) rewiring the download button.

**Primary recommendation:** Build the modal as a standalone component that receives calculator data as props, use react-hook-form + zod for the tiny form (email + consent), call `/api/send-report` via fetch, then trigger the existing `generateAndDownloadReport()` on success. Add Resend contacts.create() alongside the email send to store the lead in a Resend audience.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Clicking "Get Your Trade Survival Report" opens an email capture modal instead of triggering a direct download
- **D-02:** PDF generates AFTER successful email submission -- not before. Flow: button -> modal -> email + consent -> submit -> API sends email -> PDF generates and downloads -> modal closes
- **D-03:** Modal contains: email input, ConsentCheckbox (Phase 8), and submit button. Minimal fields.
- **D-04:** Branded results email includes all 6 financial anchor values with plain-English explanations
- **D-05:** Email includes triggered legal alerts
- **D-06:** Email uses react-email components for cross-client HTML rendering
- **D-07:** Email includes same general disclaimer footer as PDF report
- **D-08:** After success: modal closes, PDF downloads automatically, toast confirms "Report sent to your email" (sonner)
- **D-09:** Loading/submitting state on modal submit button while API call is in flight. Prevents double-submission.
- **D-10:** Error state: if email send fails, show error in modal (don't close), still allow PDF download
- **D-11:** No persistence -- email required every visit. No cookies, no localStorage.
- **D-12:** Single Next.js API route (`/api/send-report`) handles email submission
- **D-13:** Email storage via Resend contacts/audience -- no separate database
- **D-14:** API route validates email format and consent flag server-side before sending
- **D-15:** ConsentCheckbox uses controlled props pattern (checked/onChange) from Phase 8
- **D-16:** Trade language, no financial jargon in email copy
- **D-17:** "Protect" framing for guardrail language in email
- **D-18:** Copy constants pattern -- email template reuses output-copy.ts and alert-copy.ts

### Claude's Discretion
- Modal visual design (overlay, size, animation)
- Email template layout and styling (colors, spacing, branding)
- Email subject line copy
- Resend API key environment variable naming
- Whether to add email to Resend audience/contact list automatically or just send transactional email
- API route error handling specifics
- Form validation library choice for the modal (react-hook-form + zod recommended)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LEAD-01 | Email input modal appears when user clicks to download report | Modal component replaces DownloadReportButton onClick; react-hook-form for form state |
| LEAD-03 | Email address captured and stored for follow-up marketing | Resend contacts.create() API adds email to audience; called alongside email send in API route |
| LEAD-04 | Branded PDF report generated client-side and available for download after email submission | Existing generateAndDownloadReport() called after successful API response |
| LEAD-05 | Email delivery of results summary sent to the captured address | Resend emails.send() with react-email template containing all 6 anchors + alerts |
</phase_requirements>

## Standard Stack

### Core (New Dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| resend | 6.9.4 | Email delivery API | Per CLAUDE.md. Developer-first API, generous free tier (100/day, 3K/month), React Email integration. SDK returns `{data, error}` pattern. |
| @react-email/components | 1.0.10 | Email template components | Per CLAUDE.md. JSX components (Html, Head, Body, Container, Section, Text, Heading, Hr, Preview, Tailwind) render to cross-client HTML. |
| sonner | 2.0.7 | Toast notifications | Per CLAUDE.md. Lightweight toast for success/error feedback. Needs `<Toaster />` in layout. |

### Already Installed (Reused)
| Library | Version | Purpose |
|---------|---------|---------|
| react-hook-form | 7.72.0 | Modal form state management |
| @hookform/resolvers | 5.2.2 | Zod resolver for form validation |
| zod | 4.3.6 | Email + consent schema validation |

**Installation:**
```bash
pnpm add resend@^6.9.4 @react-email/components@^1.0.10 sonner@^2.0.7
```

**Note:** The `react-email` CLI package (v5.2.10) is NOT needed -- it is a dev tool for previewing emails in a browser. For this project, `@react-email/components` is sufficient since we only need the components for building templates and rendering them via Resend's `react` parameter.

## Architecture Patterns

### Recommended File Structure
```
src/
├── app/
│   └── api/
│       └── send-report/
│           └── route.ts          # POST handler: validate, send email, add contact
├── components/
│   └── email/
│       └── EmailCaptureModal.tsx  # Modal with form, loading/error states
├── lib/
│   └── email/
│       ├── schema.ts             # Zod schema for email + consent
│       ├── send-report-action.ts # Client-side fetch wrapper for /api/send-report
│       └── templates/
│           └── ResultsSummaryEmail.tsx  # react-email template component
└── ...
```

### Pattern 1: Next.js App Router API Route
**What:** A POST route handler at `app/api/send-report/route.ts` that receives email + calculator results, validates server-side, sends email via Resend, and adds contact to audience.
**When to use:** This is the first and only API route in the project.
**Example:**
```typescript
// Source: https://resend.com/docs/send-with-nextjs
import { Resend } from "resend";
import { ResultsSummaryEmail } from "@/lib/email/templates/ResultsSummaryEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  // Validate with Zod server-side
  const parsed = sendReportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, consent, calculatorInput, calculatorOutput, currency, alerts } = parsed.data;

  if (!consent) {
    return Response.json({ error: "Consent required" }, { status: 400 });
  }

  // Send email
  const { error: emailError } = await resend.emails.send({
    from: "Trade Survival Calculator <report@yourdomain.com>",
    to: [email],
    subject: "Your Trade Survival Report",
    react: ResultsSummaryEmail({ input: calculatorInput, output: calculatorOutput, currency, alerts }),
  });

  if (emailError) {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  // Add to audience (fire-and-forget, don't block on failure)
  resend.contacts.create({
    audienceId: process.env.RESEND_AUDIENCE_ID!,
    email,
  }).catch(() => {}); // Non-critical

  return Response.json({ success: true });
}
```

### Pattern 2: Modal with react-hook-form
**What:** A modal overlay component that uses react-hook-form + zod for the email/consent form, with loading and error states.
**When to use:** The email capture modal triggered by the download button.
**Example:**
```typescript
// Modal form schema
import { z } from "zod";

export const emailCaptureSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to receive your report by email" }),
  }),
});

export type EmailCaptureData = z.infer<typeof emailCaptureSchema>;
```

### Pattern 3: react-email Template
**What:** A JSX component using @react-email/components that renders the branded results summary.
**When to use:** Passed to Resend's `react` parameter in the API route.
**Example:**
```typescript
// Source: https://react.email/components
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview,
} from "@react-email/components";

interface ResultsSummaryEmailProps {
  input: CalculatorInput;
  output: CalculatorOutput;
  currency: Currency;
  alerts: Alert[];
}

export function ResultsSummaryEmail({ input, output, currency, alerts }: ResultsSummaryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Trade Survival Report is ready</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading as="h1">Your Trade Survival Numbers</Heading>
          {/* Render 6 financial anchors using OUTPUT_COPY */}
          {/* Render triggered alerts using ALERT_COPY */}
          <Hr />
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {/* Disclaimer footer matching PDF */}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Pattern 4: Sonner Toast Integration
**What:** Add `<Toaster />` to root layout, use `toast.success()` / `toast.error()` for feedback.
**Example:**
```typescript
// In layout.tsx: add <Toaster /> as sibling to <NuqsAdapter>
import { Toaster } from "sonner";

// In modal after successful submission:
import { toast } from "sonner";
toast.success("Report sent to your email");
```

### Anti-Patterns to Avoid
- **Don't use Server Actions for this:** The flow needs explicit loading/error state control in the modal. A fetch-based approach to an API route gives full control over the request lifecycle. Server Actions would complicate the "show error but still allow PDF download" requirement (D-10).
- **Don't generate PDF before email confirmation:** D-02 is explicit -- PDF generates AFTER successful submission, not before. This avoids wasted computation if the user abandons the modal.
- **Don't persist email in localStorage/cookies:** D-11 is explicit -- no persistence. Email required every visit.
- **Don't import @react-pdf/renderer in the modal component:** Keep PDF generation lazily imported via `generateAndDownloadReport()`. The modal should call this function after API success, not import PDF libraries directly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email HTML rendering | Manual HTML strings | @react-email/components | Email client compatibility (Gmail, Outlook, Apple Mail) is a nightmare. React Email handles it. |
| Email delivery | Direct SMTP / nodemailer | Resend SDK | SPF/DKIM handled, deliverability optimized, contact management built-in |
| Form validation | Manual validation | react-hook-form + zod | Already established pattern in the project; reuse for consistency |
| Toast notifications | Custom notification system | sonner | Lightweight, accessible, good defaults. Already in CLAUDE.md stack. |
| Modal overlay | Custom portal management | Simple div with Tailwind classes + focus trap | A dedicated modal library is overkill for one modal. Use a backdrop div with onClick, Escape key handler, and focus management. |

**Key insight:** The modal is the only custom UI in this phase. Everything else has a library. Keep the modal simple -- it is a backdrop overlay, a white card, and 3 form elements.

## Common Pitfalls

### Pitfall 1: Static Export Breaks API Routes
**What goes wrong:** If `next.config.ts` has `output: 'export'`, API routes do not work at all. The build silently skips them.
**Why it happens:** Static export generates HTML/CSS/JS files only -- no server runtime.
**How to avoid:** The current `next.config.ts` does NOT have `output: 'export'`, so API routes work. Do NOT add this setting. Deploy to Vercel (or similar) which supports serverless functions.
**Warning signs:** Build completes but `/api/send-report` returns 404 in production.

### Pitfall 2: RESEND_API_KEY Not Set in Production
**What goes wrong:** API route works locally with `.env.local` but fails in production.
**Why it happens:** Environment variables must be configured in the deployment platform (Vercel dashboard).
**How to avoid:** Create `.env.local` for development, document the required env vars, and add them to Vercel project settings before deploy.
**Warning signs:** 500 errors on the API route with "Resend API key is required" in logs.

### Pitfall 3: Resend Free Tier Uses onboarding@resend.dev
**What goes wrong:** Emails come from `onboarding@resend.dev` instead of your domain, looking unprofessional.
**Why it happens:** Without a verified custom domain in Resend, you can only send from the shared test domain.
**How to avoid:** For MVP/development, `onboarding@resend.dev` is fine. For production, add and verify a custom domain in Resend dashboard (requires DNS records: 1 TXT for SPF, 1 TXT for DKIM, 1 MX for bounces). This is a manual step outside the codebase.
**Warning signs:** Emails landing in spam, unprofessional sender address.

### Pitfall 4: react-email Types Not Compatible with Resend react Parameter
**What goes wrong:** TypeScript error when passing JSX to Resend's `react` parameter.
**Why it happens:** Type mismatch between React.ReactElement and Resend's expected type.
**How to avoid:** Pass the component as a function call, not JSX: `react: ResultsSummaryEmail({ ...props })` rather than `react: <ResultsSummaryEmail {...props} />`. The Resend docs use this pattern.
**Warning signs:** TypeScript compile error on `resend.emails.send()`.

### Pitfall 5: Double-Submission on Slow Networks
**What goes wrong:** User clicks submit twice, gets two emails.
**Why it happens:** No submit-in-flight guard on the button.
**How to avoid:** D-09 requires loading state on the submit button. Use react-hook-form's `formState.isSubmitting` to disable the button during the API call.
**Warning signs:** Duplicate emails received.

### Pitfall 6: Modal Doesn't Trap Focus (Accessibility)
**What goes wrong:** Screen reader users or keyboard-only users can tab behind the modal.
**Why it happens:** Custom modals without focus management.
**How to avoid:** On open: focus the first input. On Escape: close modal. Trap Tab within modal elements. Set `aria-modal="true"` and `role="dialog"` on the modal container. Use `inert` attribute on background content if browser support allows.
**Warning signs:** Fails accessibility audit.

## Code Examples

### Email Capture Zod Schema (Shared Client + Server)
```typescript
// src/lib/email/schema.ts
import { z } from "zod";
import type { CalculatorInput, CalculatorOutput, Currency } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

export const emailCaptureSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to receive your report by email" }),
  }),
});

// Full API request schema (includes calculator data)
export const sendReportRequestSchema = z.object({
  email: z.string().email(),
  consent: z.literal(true),
  calculatorInput: z.any(), // Already validated by the form
  calculatorOutput: z.any(),
  currency: z.enum(["GBP", "EUR"]),
  alerts: z.array(z.any()),
});
```

### Client-Side Fetch Wrapper
```typescript
// src/lib/email/send-report-action.ts
import type { CalculatorInput, CalculatorOutput, Currency } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

interface SendReportPayload {
  email: string;
  consent: true;
  calculatorInput: CalculatorInput;
  calculatorOutput: CalculatorOutput;
  currency: Currency;
  alerts: Alert[];
}

export async function sendReport(payload: SendReportPayload): Promise<{ success: boolean; error?: string }> {
  const response = await fetch("/api/send-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return { success: false, error: data.error || "Something went wrong" };
  }

  return { success: true };
}
```

### Modal Submit Flow (D-02 + D-08 + D-10)
```typescript
// Inside EmailCaptureModal onSubmit handler
async function onSubmit(formData: EmailCaptureData) {
  const result = await sendReport({
    email: formData.email,
    consent: formData.consent,
    ...calculatorData,
  });

  if (result.success) {
    // D-08: Close modal, download PDF, show toast
    onClose();
    toast.success("Report sent to your email");
    // Trigger PDF generation (existing lazy-loaded function)
    const { generateAndDownloadReport } = await import("@/lib/pdf/generate-report");
    await generateAndDownloadReport(input, output, currency, alerts);
  } else {
    // D-10: Show error in modal, offer direct download
    setApiError(result.error || "Failed to send email");
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| nodemailer + SMTP | Resend SDK with react parameter | 2023+ | No SMTP config, JSX email templates, built-in contact management |
| HTML string email templates | react-email components | 2023+ | Type-safe, cross-client compatible, same mental model as React |
| Custom toast notifications | sonner | 2023+ | Accessible, lightweight, good defaults out of the box |
| Pages Router API routes | App Router route handlers | Next.js 13+ | `export async function POST(request: Request)` pattern, Web standard Request/Response |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LEAD-01 | Modal opens when download button clicked | unit (component) | `pnpm test -- src/components/email/__tests__/EmailCaptureModal.test.tsx` | No - Wave 0 |
| LEAD-03 | Email + consent submitted to API, contact created | unit (API route) | `pnpm test -- src/app/api/send-report/__tests__/route.test.ts` | No - Wave 0 |
| LEAD-04 | PDF downloads after successful email submission | unit (integration) | `pnpm test -- src/components/email/__tests__/EmailCaptureModal.test.tsx` | No - Wave 0 |
| LEAD-05 | Email sent via Resend with correct template content | unit (API route) | `pnpm test -- src/app/api/send-report/__tests__/route.test.ts` | No - Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/email/__tests__/EmailCaptureModal.test.tsx` -- covers LEAD-01, LEAD-04
- [ ] `src/app/api/send-report/__tests__/route.test.ts` -- covers LEAD-03, LEAD-05
- [ ] Mock for `resend` SDK (vi.mock("resend")) -- shared test utility
- [ ] Mock for `generateAndDownloadReport` -- avoid PDF generation in tests

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js API routes | Yes | v24.11.0 | -- |
| pnpm | Package installation | Yes | 10.33.0 | -- |
| Vercel CLI | Local dev + deploy | Yes | 50.22.1 | -- |
| Resend API key | Email delivery | No (env var needed) | -- | Use `onboarding@resend.dev` for dev |
| Custom domain in Resend | Production email sender | No (manual setup) | -- | Use Resend test domain for MVP |
| Resend Audience ID | Contact storage | No (create in dashboard) | -- | Skip contact creation, send email only |

**Missing dependencies with no fallback:**
- `RESEND_API_KEY` environment variable must be set in `.env.local` (dev) and Vercel project settings (prod). Free tier account creation required at resend.com.

**Missing dependencies with fallback:**
- Custom domain verification (DNS records) -- can use `onboarding@resend.dev` for development/testing
- Resend Audience ID -- can skip contact creation initially and only send transactional email

## Open Questions

1. **Custom sending domain**
   - What we know: Resend requires DNS records (TXT for SPF/DKIM, MX for bounces) for a custom sending domain
   - What's unclear: Whether the project has a domain ready for email sending
   - Recommendation: Code with a configurable `from` address via env var. Use `onboarding@resend.dev` for dev. Add domain verification as a deployment checklist item, not a code task.

2. **Resend Audience creation**
   - What we know: `resend.contacts.create()` requires an `audienceId` which is created in the Resend dashboard
   - What's unclear: Whether audience should be created programmatically or manually
   - Recommendation: Create audience manually in Resend dashboard. Store ID as `RESEND_AUDIENCE_ID` env var. Make contact creation non-blocking (fire-and-forget) so email send is not affected if audience isn't configured.

3. **Email template rendering approach**
   - What we know: Resend accepts a `react` parameter that renders the component server-side
   - What's unclear: Whether @react-email/components Tailwind wrapper works reliably with Resend's renderer
   - Recommendation: Use inline styles for the email template (standard practice for email). The `style` prop approach is more reliable across email clients than Tailwind in emails.

## Project Constraints (from CLAUDE.md)

- **Tech stack:** Next.js 15 App Router, React 19, TypeScript 5.7+, Tailwind CSS 4
- **Resend SDK 4.x:** CLAUDE.md specifies 4.x but current npm version is 6.9.4. Use latest (6.x) -- the API surface is the same, version was updated.
- **react-email 3.x:** CLAUDE.md specifies 3.x but current package is `@react-email/components` at 1.0.10 and `react-email` CLI at 5.2.10. Use `@react-email/components` ^1.0.10 (the components package, not the CLI).
- **sonner 1.x:** CLAUDE.md specifies 1.x but current is 2.0.7. Use latest (2.x).
- **No login:** Calculator works without authentication; email capture at report download only
- **No heavy frameworks:** Keep bundle lean
- **Biome for linting/formatting** (not ESLint/Prettier)
- **pnpm as package manager**
- **Avoid:** Firebase/Supabase, Mailchimp for transactional email, Redux/Zustand, component libraries (Chakra/MUI/Ant)

## Sources

### Primary (HIGH confidence)
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) -- API route pattern, SDK usage
- [Resend contacts docs](https://resend.com/docs/dashboard/audiences/contacts) -- Contact/audience management
- [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction) -- SPF/DKIM/DMARC verification
- npm registry -- verified versions: resend@6.9.4, @react-email/components@1.0.10, sonner@2.0.7
- Existing codebase -- DownloadReportButton.tsx, ConsentCheckbox.tsx, output-copy.ts, alert-copy.ts, types.ts, alerts.ts, generate-report.ts

### Secondary (MEDIUM confidence)
- [React Email components](https://react.email/components) -- Component list and usage patterns
- [DeepWiki Resend audience management](https://deepwiki.com/resend/resend-node/6-audience-management) -- contacts.create() API signature

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries specified in CLAUDE.md, versions verified against npm registry
- Architecture: HIGH -- Next.js App Router API routes are well-documented, existing codebase patterns clear
- Pitfalls: HIGH -- common issues well-known (static export, env vars, focus trapping, double-submit)

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable domain, mature libraries)
