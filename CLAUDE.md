<!-- GSD:project-start source:PROJECT.md -->
## Project

**Trade Survival Calculator**

A web-based financial reality-check and quoting calculator for tradespeople and local service businesses in the UK and Ireland. Instead of guessing what to charge, it works backward from the owner's desired take-home pay to calculate the exact minimum hourly rate, monthly revenue target, and sales pipeline numbers required to stay solvent. The calculator is ungated; the downloadable PDF/email report is the lead capture mechanism.

**Core Value:** The tradesperson enters what they need to take home, and the app tells them the brutal truth about what the business must generate to make that happen — no optimistic assumptions, no "perfect world" math.

### Constraints

- **Tech stack**: Web app (to be determined by research) — must be fast-loading, no heavy frameworks that slow first paint
- **No login**: The calculator must work without any authentication; email capture happens only at report download
- **Tax accuracy**: Use conservative buffers (20% Corp Tax, 30% employer burden) — not precise statutory rates. Always disclaim with asterisk notes.
- **Input validation**: Direct cost % capped at 80%. Billable hours capped at 75%. These are hard limits with explanatory alerts.
- **Markets**: UK and Ireland only. VAT options: 20% UK, 13.5% IE, 23% IE, 0% Exempt.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js (App Router) | 15.x | Framework / SSR / routing | Static export (`output: 'export'`) gives you a zero-server deploy while keeping React's component model. App Router provides metadata API for SEO, built-in image optimization, and route-based code splitting. The multi-step form is a single route with client-side state — no API routes needed for calculations. Next.js 15 with React 19 gives you server components for the static shell and client components only where interactivity is needed, keeping JS payload minimal. |
| React | 19.x | UI rendering | Ships with Next.js 15. React 19's form actions and `useActionState` simplify multi-step form handling. The component model maps perfectly to calculator steps (each step = component). |
| TypeScript | 5.7+ | Type safety | Financial calculations with multiple tax regimes demand type safety. TypeScript catches unit mismatches (GBP vs EUR, percentages vs decimals) at compile time. Non-negotiable for any project with math. |
| Tailwind CSS | 4.x | Styling | Utility-first CSS with zero runtime overhead. Perfect for a single-page app where you need fast iteration on responsive design. v4 uses CSS-native cascade layers and the Oxide engine for faster builds. Purges to tiny CSS in production. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-pdf/renderer | 4.x | PDF generation (client-side) | Generating the branded downloadable report. React-based API means you build the PDF layout with JSX components — same mental model as the rest of the app. Runs entirely in the browser, no server needed. Supports custom fonts, images, styled tables — everything needed for a professional branded report. |
| react-hook-form | 7.x | Form state management | Managing the multi-step input form. Uncontrolled components by default = fewer re-renders = snappier form UX. Built-in validation with `resolver` pattern pairs with Zod. Tiny bundle (~9KB gzipped). |
| zod | 3.x | Schema validation | Defining and validating all calculator inputs (entity type, wages, percentages, VAT rates). Shared schemas between form validation and calculation functions ensure type safety end-to-end. Pairs natively with react-hook-form via `@hookform/resolvers`. |
| Resend | SDK 4.x | Transactional email delivery | Sending the results summary email after capture. Developer-first email API, generous free tier (100 emails/day, 3,000/month), excellent deliverability. React Email integration means you build email templates in JSX. Only requires a single API route or serverless function. |
| react-email | 3.x | Email templates | Building the branded results email template. Same JSX component model. Renders to cross-client HTML. Works with Resend out of the box. |
| Plausible Analytics | Cloud or self-hosted | Privacy-first analytics | GDPR-compliant without cookie banners (essential for UK/IE market). Lightweight script (~1KB). Tracks pageviews, referrers, and custom events (form step completion, PDF downloads, email captures). No cookie consent needed = zero friction for users. |
| nuqs | 2.x | URL query state | Persisting form step in URL so browser back/forward works through calculator steps. Tiny, type-safe, built for Next.js App Router. |
| sonner | 1.x | Toast notifications | Displaying validation alerts (tax warnings, CIS/RCT notices, efficiency cap overrides). Lightweight, accessible, good defaults. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Faster installs, strict dependency resolution, disk-efficient. Use `pnpm create next-app`. |
| Biome | Linting + formatting | Single tool replaces ESLint + Prettier. Near-instant execution. Configure with `biome.json`. |
| Vercel CLI | Local dev + deploy | `vercel dev` for local development, `vercel --prod` for deploy. Zero-config for Next.js. |
## Installation
# Core
# Supporting
# Email (only needed if using API route for email delivery)
# Dev dependencies
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 15 (static export) | Astro 5 | If you want zero JS by default and are comfortable with Astro's island architecture. Astro would be lighter for a purely static marketing page, but the multi-step form with complex client-side calculations and PDF generation means you'd end up shipping React islands anyway — at that point Next.js gives you a more cohesive DX with better tooling. |
| Next.js 15 (static export) | Vite + React (SPA) | If SEO is genuinely not a concern and you want the simplest possible setup. Loses metadata API, image optimization, and static pre-rendering. For a lead magnet that needs to rank in search, the SEO trade-off is not worth it. |
| @react-pdf/renderer | jsPDF | If you need pixel-perfect control over PDF layout with a canvas-like API. jsPDF is lower-level and harder to maintain — you position every element manually. @react-pdf/renderer's declarative JSX approach is dramatically faster to build and iterate on. |
| @react-pdf/renderer | html2pdf.js / Puppeteer | If you need to convert existing HTML to PDF exactly as rendered. html2pdf.js quality is poor (uses html2canvas under the hood). Puppeteer requires a server. Neither fits a client-side-only constraint. |
| Resend | SendGrid | If you're already on SendGrid or need >3,000 emails/month on free tier. SendGrid's free tier is 100 emails/day. More complex API, worse DX, but battle-tested at scale. |
| Resend | Postmark | If deliverability is the absolute top priority and you're willing to pay from day one (no free tier). Postmark has the best inbox placement rates in the industry but charges from email #1. For a lead magnet MVP, Resend's free tier is the right starting point. |
| Plausible | Vercel Analytics | If you're on Vercel Pro plan already. Vercel Analytics is decent but Plausible gives you more control over custom events, has a better dashboard, and works if you ever move off Vercel. |
| Plausible | Google Analytics 4 | Only if you specifically need GA4's audience features for retargeting. GA4 requires cookie consent banners in UK/IE (GDPR), adds load time, and is overkill for a single-page calculator. |
| Tailwind CSS 4 | Vanilla CSS / CSS Modules | If you have a strong preference for traditional CSS and the project has a dedicated designer producing exact specs. For rapid solo/small-team development, Tailwind's utility classes are faster. |
| react-hook-form | Formik | If your team already knows Formik. But Formik is heavier, re-renders more aggressively, and is less actively maintained. react-hook-form is the modern standard. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App (CRA) | Officially deprecated since 2023. No SSR, no static export optimization, no built-in routing, slow dev server. | Next.js 15 or Vite + React |
| Formik | Larger bundle, more re-renders, maintainer has moved focus to other projects. Last major release was 2021. | react-hook-form 7.x |
| html2pdf.js | Uses html2canvas internally — renders HTML to canvas then converts to PDF. Blurry text, broken layouts, poor font support. Looks amateurish in output. | @react-pdf/renderer for programmatic PDF, or Puppeteer if server-side is acceptable |
| Puppeteer / Playwright for PDF | Requires a server or serverless function with a headless browser. 50MB+ dependency. Overkill and operationally complex for a client-side-only app. | @react-pdf/renderer (runs in browser) |
| Chakra UI / MUI / Ant Design | Component libraries add 50-200KB+ to bundle. This is a single-purpose calculator, not a dashboard. You need maybe 5 UI patterns total — a stepper, inputs, cards, buttons, and a results display. Tailwind covers this with zero runtime cost. | Tailwind CSS 4 with custom components |
| Firebase / Supabase | No user data to persist. Adding a database adds complexity, auth concerns, and ongoing cost for zero benefit. Email capture goes directly to the email service. | Resend API for email capture + delivery (one API call) |
| Mailchimp for transactional email | Mailchimp is a marketing platform, not a transactional email service. Slow API, complex setup, expensive for what you need. The email after report download is transactional, not a newsletter. | Resend for transactional email. Add Mailchimp/ConvertKit later only for nurture sequences. |
| Google Analytics 4 | Requires cookie consent banner under UK GDPR and IE DPA 2018. Consent banners reduce conversion on lead magnets. GA4 is complex to configure correctly and sends data to Google. | Plausible (cookieless, GDPR-compliant by default, no consent banner needed) |
| Redux / Zustand for state | The calculator has one form and one output. State is linear: inputs flow through calculation to outputs. react-hook-form manages form state; calculation results derive from it. Global state management adds complexity with no benefit. | react-hook-form for form state; derived calculation results via plain functions |
| Webpack | Slow builds, complex configuration, legacy tooling. Next.js 15 uses Turbopack in dev and Webpack internally for production (you never touch it directly). | Next.js built-in bundling (Turbopack dev / Webpack prod, zero config) |
## Stack Patterns by Variant
- Upgrade to Resend Pro ($20/month for 50K emails) or switch to SendGrid/Postmark
- Consider adding a ConvertKit/Mailchimp integration for nurture sequences at this point
- The email capture API route stays the same; only the transport provider changes
- Could simplify to Vite + React SPA instead of Next.js
- Loses static pre-rendering and metadata API but cuts framework complexity
- Only consider this if you are certain organic search traffic is not a goal
- Move PDF generation to a Vercel Edge Function or serverless function using @react-pdf/renderer server-side
- Client sends calculation results as JSON; server returns PDF buffer
- This is an optimization — start with client-side and measure first
- Add Vercel Edge Config + Vercel Toolbar for feature flags
- Or use Plausible custom events with URL parameters for manual split testing
- Do not add a feature flag system before validating the core product
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 15.x | React 19.x | Next.js 15 requires React 19. Do not mix with React 18. |
| @react-pdf/renderer 4.x | React 19.x | v4 added React 19 support. Do not use v3.x with React 19. |
| react-hook-form 7.x | React 19.x | Works with React 19. The `@hookform/resolvers` package must be 3.x+ for Zod 3 compatibility. |
| Tailwind CSS 4.x | Next.js 15.x | Tailwind v4 uses `@import "tailwindcss"` in CSS (not `@tailwind` directives). Next.js 15 supports this via PostCSS. The `create-next-app` template with `--tailwind` flag sets this up automatically. |
| nuqs 2.x | Next.js 15.x (App Router) | nuqs 2.x is built specifically for Next.js App Router. Does not work with Pages Router. |
| Biome 1.x | TypeScript 5.7+ | Biome handles both linting and formatting. Remove any existing ESLint/Prettier config to avoid conflicts. |
## Architecture Notes
### Why Static Export + One API Route
### Multi-Step Form Architecture
### Calculation Layer
- Calculations can be unit tested independently
- Same functions feed both the on-screen results and the PDF report
- Type safety catches formula errors at compile time
## Sources
- Next.js 15 documentation (nextjs.org/docs) — App Router, static export, API routes
- React 19 release notes (react.dev/blog) — form actions, useActionState
- @react-pdf/renderer GitHub (github.com/diegomura/react-pdf) — v4 React 19 compatibility
- react-hook-form documentation (react-hook-form.com) — multi-step form patterns
- Resend documentation (resend.com/docs) — API, React Email integration, pricing
- Plausible documentation (plausible.io/docs) — GDPR compliance, custom events
- Tailwind CSS v4 announcement (tailwindcss.com/blog) — Oxide engine, CSS-native approach
- UK ICO guidance on cookies (ico.org.uk) — GDPR cookie consent requirements for analytics
- Zod documentation (zod.dev) — schema validation, TypeScript inference
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
