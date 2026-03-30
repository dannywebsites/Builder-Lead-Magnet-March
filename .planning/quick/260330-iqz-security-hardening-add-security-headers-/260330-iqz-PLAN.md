---
phase: quick
plan: 260330-iqz
type: execute
wave: 1
depends_on: []
files_modified:
  - src/middleware.ts
  - src/lib/email/schema.ts
  - src/app/api/send-report/route.ts
autonomous: true
requirements: []
must_haves:
  truths:
    - "All responses include security headers (X-Frame-Options, CSP, etc.)"
    - "API endpoint is rate-limited to prevent abuse"
    - "Zod schemas validate calculatorInput and calculatorOutput with strict typed fields instead of z.record(z.string(), z.unknown())"
    - "No unsafe type casts (as unknown as) in send-report route"
  artifacts:
    - path: "src/middleware.ts"
      provides: "Security headers and rate limiting"
    - path: "src/lib/email/schema.ts"
      provides: "Strict Zod schemas matching CalculatorInput/CalculatorOutput types"
    - path: "src/app/api/send-report/route.ts"
      provides: "Type-safe route handler with no unsafe casts"
  key_links:
    - from: "src/middleware.ts"
      to: "all responses"
      via: "Next.js middleware pipeline"
    - from: "src/lib/email/schema.ts"
      to: "src/app/api/send-report/route.ts"
      via: "sendReportRequestSchema import"
---

<objective>
Security hardening: add security headers via Next.js middleware, add in-memory rate limiting to the send-report API, replace loose z.record() schemas with strict typed Zod schemas matching CalculatorInput/CalculatorOutput, and eliminate unsafe `as unknown as` type casts.

Purpose: Harden the only API endpoint against abuse and ensure type safety end-to-end.
Output: middleware.ts with security headers + rate limiter, strict schemas, type-safe route handler.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/middleware.ts (does not exist yet — create new)
@src/lib/email/schema.ts
@src/app/api/send-report/route.ts
@src/lib/calculator/types.ts
@src/lib/calculator/alerts.ts

<interfaces>
From src/lib/calculator/types.ts:
```typescript
export type EntityType = "limited_company" | "sole_trader";
export type Currency = "GBP" | "EUR";
export type VatRateValue = 0 | 0.135 | 0.2 | 0.23;

export interface CalculatorInput {
  entityType: EntityType;
  grossPersonalDraw: number;
  fixedOverheads: number;
  staffCount: number;
  staffHourlyRate: number;
  staffHoursPerWeek: number;
  avgJobValue: number;
  directCostPct: number;
  vatRate: VatRateValue;
  currency: Currency;
  ownerHoursPerWeek?: number;
}

export interface CalculatorOutput {
  monthlyRevenueTarget: number;
  monthlyBillings: number;
  hourlyFloorRate: number;
  jobsToWin: number;
  quotesNeeded: number;
  leadsNeeded: number;
  targetBusinessProfit: number;
  adjustedPayroll: number;
  totalBillableHours: number;
  realDirectCost: number;
  adjustedOverheads: number;
  taxBufferAmount: number;
  basePayroll: number;
  employerBurdenAmount: number;
  marginAfterMaterials: number;
}
```

From src/lib/calculator/alerts.ts:
```typescript
export type AlertKey = "gross-draw" | "two-thirds-rule" | "efficiency-cap" | "cis-rct";
export interface Alert {
  key: AlertKey;
  title: string;
  body: string;
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create middleware with security headers and API rate limiting</name>
  <files>src/middleware.ts</files>
  <action>
Create `src/middleware.ts` with two concerns:

**Security headers** (applied to ALL responses):
- `X-Frame-Options: DENY` (prevent clickjacking)
- `X-Content-Type-Options: nosniff` (prevent MIME sniffing)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (disable unused browser APIs)
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://plausible.io; frame-ancestors 'none';`
  - Note: `unsafe-inline` and `unsafe-eval` needed for Next.js runtime and @react-pdf/renderer

**Rate limiting** (applied only to `/api/*` routes):
- Use a simple in-memory Map<string, { count: number; resetTime: number }> keyed by IP
- Limit: 10 requests per 60 seconds per IP (generous for a calculator that sends one email)
- Get IP from `request.headers.get('x-forwarded-for')` (Vercel sets this) or fallback to `'unknown'`
- On limit exceeded: return 429 with JSON `{ error: "Too many requests. Please try again later." }`
- Clean up expired entries on each request (simple sweep of entries past resetTime)
- Export `config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }` so middleware runs on all routes except static assets

Structure:
```typescript
import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitResponse(): NextResponse { ... }
function checkRateLimit(ip: string): boolean { ... cleanup + check }

export function middleware(request: NextRequest) {
  // Rate limit API routes only
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) return getRateLimitResponse();
  }
  // Security headers on all responses
  const response = NextResponse.next();
  // ... set headers ...
  return response;
}

export const config = { matcher: [...] };
```
  </action>
  <verify>
    <automated>cd "/Users/danny/Desktop/Lead Magnus Build out" && npx tsc --noEmit src/middleware.ts 2>&1 | head -20</automated>
  </verify>
  <done>middleware.ts exists, compiles without errors, exports middleware function and config matcher</done>
</task>

<task type="auto">
  <name>Task 2: Replace loose Zod schemas with strict typed schemas and remove unsafe casts</name>
  <files>src/lib/email/schema.ts, src/app/api/send-report/route.ts</files>
  <action>
**In `src/lib/email/schema.ts`:**

Replace the loose `z.record(z.string(), z.unknown())` fields in `sendReportRequestSchema` with strict schemas that mirror the TypeScript types exactly.

Add these schemas (do NOT export them individually — they are internal to the file):

```typescript
const calculatorInputSchema = z.object({
  entityType: z.enum(["limited_company", "sole_trader"]),
  grossPersonalDraw: z.number().nonnegative(),
  fixedOverheads: z.number().nonnegative(),
  staffCount: z.number().int().nonnegative(),
  staffHourlyRate: z.number().nonnegative(),
  staffHoursPerWeek: z.number().nonnegative(),
  avgJobValue: z.number().positive(),
  directCostPct: z.number().min(0).max(0.80),
  vatRate: z.union([z.literal(0), z.literal(0.135), z.literal(0.2), z.literal(0.23)]),
  currency: z.enum(["GBP", "EUR"]),
  ownerHoursPerWeek: z.number().nonnegative().optional(),
});

const calculatorOutputSchema = z.object({
  monthlyRevenueTarget: z.number(),
  monthlyBillings: z.number(),
  hourlyFloorRate: z.number(),
  jobsToWin: z.number(),
  quotesNeeded: z.number(),
  leadsNeeded: z.number(),
  targetBusinessProfit: z.number(),
  adjustedPayroll: z.number(),
  totalBillableHours: z.number(),
  realDirectCost: z.number(),
  adjustedOverheads: z.number(),
  taxBufferAmount: z.number(),
  basePayroll: z.number(),
  employerBurdenAmount: z.number(),
  marginAfterMaterials: z.number(),
});

const alertSchema = z.object({
  key: z.enum(["gross-draw", "two-thirds-rule", "efficiency-cap", "cis-rct"]),
  title: z.string(),
  body: z.string(),
});
```

Update `sendReportRequestSchema` to use these:
```typescript
export const sendReportRequestSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  consent: z.literal(true),
  calculatorInput: calculatorInputSchema,
  calculatorOutput: calculatorOutputSchema,
  currency: z.enum(["GBP", "EUR"]),
  alerts: z.array(alertSchema),
});
```

**In `src/app/api/send-report/route.ts`:**

Now that `parsed.data` has strict types, remove all `as unknown as` casts. The template props become:

```typescript
const templateProps = {
  name,
  input: calculatorInput,
  output: calculatorOutput,
  currency,
  alerts,
};
```

Since the Zod schemas now match the TypeScript types exactly, the inferred types from `parsed.data` should be structurally compatible with `CalculatorInput`, `CalculatorOutput`, `Currency`, and `Alert[]`. Remove the explicit type imports for these if they are only used for the casts (keep them if used elsewhere in the file). Check that the `ResultsSummaryEmail` component's props type accepts the Zod-inferred types — if there is a minor mismatch (e.g., the component expects the exact branded types), use a targeted type assertion on just that field rather than `as unknown as`.

Remove the unused imports: `type CalculatorInput`, `type CalculatorOutput`, `type Currency`, `type Alert` if they are no longer referenced after removing casts.
  </action>
  <verify>
    <automated>cd "/Users/danny/Desktop/Lead Magnus Build out" && npx tsc --noEmit src/lib/email/schema.ts src/app/api/send-report/route.ts 2>&1 | head -30</automated>
  </verify>
  <done>No `as unknown as` casts in route.ts. Schema validates exact field shapes matching CalculatorInput, CalculatorOutput, and Alert types. TypeScript compiles clean.</done>
</task>

</tasks>

<verification>
```bash
# 1. TypeScript compiles with no errors
cd "/Users/danny/Desktop/Lead Magnus Build out" && npx tsc --noEmit

# 2. Middleware file exists and has security headers
grep -c "X-Frame-Options\|X-Content-Type-Options\|Content-Security-Policy\|Referrer-Policy\|Permissions-Policy" src/middleware.ts

# 3. No unsafe casts remain in route
grep "as unknown as" src/app/api/send-report/route.ts && echo "FAIL: unsafe casts remain" || echo "PASS: no unsafe casts"

# 4. No loose z.record in sendReportRequestSchema
grep "z.record" src/lib/email/schema.ts && echo "FAIL: loose records remain" || echo "PASS: strict schemas"

# 5. Existing tests still pass
cd "/Users/danny/Desktop/Lead Magnus Build out" && npx vitest run 2>&1 | tail -20

# 6. Build succeeds
cd "/Users/danny/Desktop/Lead Magnus Build out" && npx next build 2>&1 | tail -10
```
</verification>

<success_criteria>
- middleware.ts serves security headers on all non-static routes
- API routes are rate-limited (10 req/min per IP, in-memory)
- sendReportRequestSchema uses strict field-level Zod schemas matching CalculatorInput, CalculatorOutput, and Alert types exactly
- Zero `as unknown as` casts in send-report/route.ts
- TypeScript compiles clean, existing tests pass, build succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/260330-iqz-security-hardening-add-security-headers-/260330-iqz-SUMMARY.md`
</output>
