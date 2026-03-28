# Pitfalls Research

**Domain:** Financial calculator lead magnet for UK/Ireland tradespeople
**Researched:** 2026-03-28
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Too Many Fields Kill Completion Rate

**What goes wrong:**
Tradespeople abandon the calculator halfway through because the form feels like a tax return. Every extra field reduces completion by 5-10%. A 15-field single-page form will see 70%+ abandonment. These users are on-site between jobs, thumbing through on a phone with dirty hands — patience is near zero.

**Why it happens:**
Developers build from the data model outward. The calculation needs ~10 inputs, so they create ~10 fields. Add entity type, VAT rate, and staff details and it balloons to 15+. Nobody stress-tests the "standing in a van at 7am" scenario.

**How to avoid:**
- Multi-step wizard: 3-4 steps with 2-4 fields each. Progress bar visible at all times.
- Smart defaults: Pre-fill VAT at 20% (UK majority), default staff count to 0, default direct cost % to 40%.
- Progressive disclosure: Only show staff salary fields when staff count > 0. Only show Irish VAT options when Ireland is selected.
- Each step must feel answerable in under 10 seconds without looking anything up.

**Warning signs:**
- Any single step has more than 4 input fields.
- Users need to scroll to see the "Next" button on mobile.
- Any field label requires a tooltip to understand (rewrite the label instead).
- Analytics show drop-off spikes between specific steps.

**Phase to address:**
UI/UX Design phase — wireframe the multi-step flow before writing any calculation logic.

---

### Pitfall 2: Floating Point Rounding Creates "Wrong" Results

**What goes wrong:**
JavaScript floating point math produces results like £4,166.6666666667/month or an hourly rate of £37.283951. Tradespeople see that and think the calculator is broken. Worse, intermediate rounding compounds — if you round each step independently, the final figures can be off by meaningful amounts (£50+/month) compared to rounding only at the end.

**Why it happens:**
Developers either ignore rounding entirely (showing raw floats) or round too aggressively at every intermediate step, compounding errors. Currency formatting is treated as a display concern, but it actually affects trust and perceived accuracy.

**How to avoid:**
- All intermediate calculations use full precision (no rounding until display).
- Final monetary outputs round to nearest whole pound/euro (no pence — tradespeople think in round numbers).
- Hourly rate rounds to nearest £0.50 increment — feels more "real" than £37.28.
- Percentage displays round to 1 decimal place max.
- Use a single `formatCurrency()` helper everywhere — never inline `toFixed()`.
- Unit test the full pipeline with known inputs and expected outputs.

**Warning signs:**
- Any output showing more than 2 decimal places.
- Different browsers/devices showing different numbers for the same inputs.
- The sum of displayed line items doesn't match the displayed total (rounding mismatch).

**Phase to address:**
Calculation Engine phase — define a rounding strategy document before implementing formulas. Verify with unit tests.

---

### Pitfall 3: Zero Staff Edge Case Breaks the Math

**What goes wrong:**
When staff count is 0, the employer burden calculation (30% of £0) is fine, but downstream calculations that divide by staff count, or UI sections that display "per employee" breakdowns, throw NaN/Infinity or show confusing £0.00 line items. The PDF report shows a "Staff Costs: £0" section that wastes space and makes the report look template-y.

**Why it happens:**
Developers test with 2-3 staff because it exercises more code paths. Zero-staff sole traders are actually the majority use case (60%+ of target users) but get tested last.

**How to avoid:**
- Zero staff is the DEFAULT test case, not an edge case.
- Conditionally hide the entire staff cost section in outputs/PDF when staff = 0.
- Guard all division operations: if divisor could be 0, handle explicitly.
- Test matrix must include: 0 staff, 1 staff, 10 staff.
- Same applies to £0 overheads and £0 gross draw (degenerate but possible inputs).

**Warning signs:**
- NaN or Infinity appearing anywhere in output.
- PDF report showing "Staff Costs" section with all zeroes.
- Hourly rate calculation producing unreasonably low/high numbers with 0 staff.

**Phase to address:**
Calculation Engine phase — zero-staff must be the first test case written, not the last.

---

### Pitfall 4: PDF Generation Produces Inconsistent or Bloated Files

**What goes wrong:**
Client-side PDF generation (html2pdf, jsPDF, puppeteer-in-browser) produces PDFs that look different across browsers, render fonts incorrectly, generate 5MB+ files, or break entirely on Safari/iOS. Custom fonts don't embed. Charts render as blank boxes. The PDF takes 8+ seconds to generate, and users think the button is broken.

**Why it happens:**
HTML-to-PDF conversion is fundamentally fragile. CSS that looks perfect on screen doesn't map 1:1 to PDF. Each library has different rendering engines with different quirks. Developers test on Chrome desktop and ship.

**How to avoid:**
- Use a server-side PDF approach (even a lightweight serverless function) for consistent rendering. Puppeteer/Playwright on a Lambda/Cloud Function is battle-tested.
- If client-side is required: use jsPDF with manual layout (not HTML conversion) for maximum control, or use a pre-designed PDF template with field injection.
- Target file size under 500KB — no embedded images larger than 50KB, use vector logos.
- Compress images before embedding. Use system fonts (Helvetica/Arial) to avoid font embedding bloat.
- Show a loading spinner with "Generating your report..." text during PDF creation.
- Test on: Chrome, Safari, Firefox, iOS Safari, Android Chrome.

**Warning signs:**
- PDF file size exceeding 1MB for a text-heavy report.
- Any visual difference between screen output and PDF output.
- PDF generation taking more than 3 seconds.
- Blank areas or missing sections in the PDF on any browser.

**Phase to address:**
PDF/Report Generation phase — choose the PDF approach early and prototype with a throwaway test before building the real template.

---

### Pitfall 5: Email Gate Triggers Abandonment at the Moment of Highest Value

**What goes wrong:**
User completes the calculator, sees their results on screen, feels satisfied, then hits the email gate for the PDF — and bounces. They already got what they came for. Conversion rate from "completed calculator" to "entered email" drops below 15%. The lead magnet fails its core purpose.

**Why it happens:**
The on-screen results give away too much. If the user can screenshot the numbers, they have no reason to give their email. The value exchange feels lopsided — "give me your email to get a PDF of what you can already see."

**How to avoid:**
- On-screen results show the headline numbers (Monthly Revenue Target, Hourly Floor Rate) but NOT the detailed breakdown, pipeline numbers, or contextual analysis.
- The PDF must contain significantly MORE value: detailed line-item breakdown, pipeline/sales targets, plain-English explanations, action steps, and branded formatting worth saving.
- Frame the email gate as "Get your personalised Trade Survival Report" — not "Download PDF."
- Add social proof near the gate: "Join 2,400+ tradespeople who've run their numbers."
- Offer email delivery as the primary CTA ("Email me my report") — feels like a service, not a gate.
- Never ask for more than email + first name. No company name, no phone, no job title.

**Warning signs:**
- Calculator completion rate is high but email capture rate is below 20%.
- Users are screenshotting results (check if they're sharing raw numbers on social without the PDF).
- Email form has more than 2 fields.

**Phase to address:**
UI/UX Design phase (decide what's shown vs. gated) and Email Integration phase (implement the capture flow).

---

### Pitfall 6: VAT Calculations Are Wrong for Ireland's Two-Thirds Rule

**What goes wrong:**
Irish tradespeople who supply materials as part of a service (most of them) are subject to the Two-Thirds Rule: if materials exceed two-thirds of the total supply value, VAT applies to the full amount at the goods rate (23%) instead of the services rate (13.5%). The calculator either ignores this entirely or applies it incorrectly, producing a VAT-inclusive billing number that's legally wrong.

**Why it happens:**
UK developers don't know this rule exists. It's an Ireland-specific quirk that affects plumbers, electricians, and builders disproportionately — exactly the target users. The PROJECT.md mentions it as a "legal alert" but it's easy to implement as a footnote rather than an actual calculation adjustment.

**How to avoid:**
- When Irish VAT is selected AND direct cost % exceeds 66.7%, trigger an explicit alert explaining the Two-Thirds Rule.
- Do NOT attempt to calculate the exact VAT — instead, flag it as a warning: "Your material costs may trigger the Two-Thirds Rule. Your actual VAT rate could be 23% instead of 13.5%. Consult your accountant."
- Surface this alert prominently in both on-screen results and the PDF report.
- Include it in the legal disclaimers section.

**Warning signs:**
- Irish users with high direct cost % seeing no mention of the Two-Thirds Rule.
- Any attempt to auto-calculate the "correct" VAT rate (this is accountant territory).
- Legal alerts section missing from the output entirely.

**Phase to address:**
Calculation Engine phase (logic) and Output/Report phase (display of the alert).

---

### Pitfall 7: CIS/RCT Withholding Tax Cash Flow Warning Missing

**What goes wrong:**
UK tradespeople under the Construction Industry Scheme (CIS) have 20-30% of their invoice value withheld at source by contractors. Irish equivalents under Relevant Contracts Tax (RCT) face similar withholding. The calculator shows a Monthly Revenue Target of £8,000 but the tradesperson only receives £5,600-£6,400 in actual cash. They think the calculator is wrong or useless because the numbers don't match their bank account reality.

**Why it happens:**
CIS/RCT is a cash flow issue, not a tax liability issue (the withholding is offset against tax owed). But tradespeople think in cash received, not gross revenue. The calculator is technically correct but practically misleading without a warning.

**How to avoid:**
- Add a "Do you work under CIS/RCT?" toggle (or auto-detect from entity type + trade selection if available).
- When active, add a prominent cash flow warning: "Under CIS, your client withholds [20/30]% from each invoice. You'll need to invoice £X gross to receive £Y in your bank account."
- Show both the gross billing target and the net-of-withholding cash flow number.
- Include this in the PDF report's breakdown section.

**Warning signs:**
- No mention of CIS or RCT anywhere in the calculator.
- Users in construction trades seeing revenue targets with no cash flow context.
- Complaints or feedback saying "these numbers don't match reality."

**Phase to address:**
Calculation Engine phase (add CIS/RCT flag and adjusted output) and UI phase (toggle input and alert display).

---

### Pitfall 8: Tax Disclaimer Missing or Buried Leads to Liability Exposure

**What goes wrong:**
A tradesperson uses the calculator output to set their prices, underpays their tax, gets a bill from HMRC or Revenue, and blames the calculator. Even without legal standing, a public complaint or negative review citing "this tool told me wrong numbers" is reputationally devastating for a lead generation business.

**Why it happens:**
Disclaimers feel like legal boilerplate that nobody reads. Developers add a tiny footer link to Terms & Conditions and consider it done. But financial calculators sit in a grey area — they're not regulated financial advice, but they produce numbers that people act on.

**How to avoid:**
- Every output screen must include a visible (not hidden, not just a footer) disclaimer: "These figures use conservative estimates and are not tax advice. Always verify with your accountant before making business decisions."
- The PDF report must include a full disclaimer section — not just a footer line, a dedicated bordered box.
- Never use language like "you will owe," "your tax is," or "you should charge." Use "estimated," "indicative," "minimum target."
- The 20% Corp Tax and 30% employer burden are explicitly labelled as "safety buffers" not "statutory rates."
- Include an asterisk note next to every calculated tax figure.

**Warning signs:**
- Any output text using definitive language ("Your tax liability is £X").
- Disclaimer text smaller than the main body text.
- No disclaimer visible without scrolling on the results page.
- PDF report lacking a dedicated disclaimer section.

**Phase to address:**
Content/Copy phase (write all disclaimer text) and every output phase (ensure disclaimers are visible in UI and PDF).

---

### Pitfall 9: Slow Initial Load Kills Mobile Conversions

**What goes wrong:**
The calculator takes 4+ seconds to become interactive on a 4G mobile connection. Tradespeople click a link from a Facebook ad or WhatsApp share, see a white screen or half-loaded page, and hit back. 53% of mobile users abandon pages that take more than 3 seconds to load. Since this is a lead magnet reached via social/ads, mobile traffic will be 70%+ of all visits.

**Why it happens:**
Developers use React/Next.js/heavy frameworks by default. A full React bundle is 150KB+ gzipped before any application code. Add a PDF library (pdfmake is 300KB+), a charting library, and custom fonts — the bundle easily hits 1MB+. First paint on mobile 4G: 5-8 seconds.

**How to avoid:**
- Use vanilla JS or a lightweight framework (Preact, Alpine.js, or plain HTML with progressive enhancement).
- Lazy-load the PDF generation library — don't load it until the user actually clicks "Get Report."
- No custom fonts in the calculator itself (use system font stack). Custom fonts only in the PDF if needed.
- Total initial bundle target: under 100KB gzipped.
- Use a CDN. Enable gzip/brotli compression. Set aggressive cache headers.
- Test on Chrome DevTools throttled to "Slow 4G" — target under 2 seconds to interactive.

**Warning signs:**
- Lighthouse Performance score below 90.
- Time to Interactive exceeding 3 seconds on throttled 4G.
- JavaScript bundle exceeding 200KB gzipped.
- PDF library loaded on initial page load.

**Phase to address:**
Tech Stack/Foundation phase — choose lightweight tooling from the start. Retroactively optimising a heavy framework is 10x harder.

---

### Pitfall 10: GDPR Non-Compliance on Email Capture

**What goes wrong:**
The email capture form collects an email address without proper consent mechanisms. Under GDPR (which applies to both UK and Ireland), you need: explicit consent for marketing, a clear privacy policy link, the ability to withdraw consent, and a lawful basis for processing. Getting this wrong means potential fines (up to 4% of annual turnover) and, more practically, email platforms like Mailchimp/ConvertKit will shut you down if complaints roll in.

**Why it happens:**
Developers treat the email form as a simple input field. The legal requirements are marketing/legal team concerns that get addressed "later" — and then don't.

**How to avoid:**
- Consent checkbox (unchecked by default): "I agree to receive my report and occasional business tips by email." — must be separate from form submission.
- Link to Privacy Policy visible on the email capture form (not just the footer).
- Double opt-in: send a confirmation email before adding to the marketing list. The report delivery email is transactional (allowed), but future marketing requires confirmed consent.
- Include an unsubscribe link in every email sent.
- Store consent timestamp and method (checkbox, form ID) for audit trail.
- Privacy policy must list: what data is collected (email, first name), why (report delivery + marketing), how long it's stored, how to request deletion.

**Warning signs:**
- Email form with no consent checkbox.
- Pre-checked consent checkbox (illegal under GDPR).
- No privacy policy page exists.
- No unsubscribe mechanism in email templates.
- Sending marketing emails to addresses captured without explicit marketing consent.

**Phase to address:**
Email Integration phase — implement consent correctly from the first email captured. Retrofitting consent is nearly impossible (you can't re-consent existing contacts reliably).

---

### Pitfall 11: Email Deliverability Tanks Because Reports Hit Spam

**What goes wrong:**
The PDF report email lands in spam/junk for 30-40% of recipients. Gmail, Outlook, and Yahoo are particularly aggressive with emails from new domains carrying attachments. The user thinks the tool is broken ("I never got my report"), the lead is effectively lost, and the sender reputation degrades further.

**Why it happens:**
New domains have zero sender reputation. Sending PDF attachments from a new domain with no warm-up is a spam filter red flag. Developers test with their own Gmail account, see it arrive, and assume it works for everyone.

**How to avoid:**
- Do NOT attach the PDF to the email. Instead, include a secure download link (time-limited, unique per user) in the email body.
- Use a transactional email service (Resend, Postmark, SendGrid) — not a marketing platform for transactional sends.
- Set up SPF, DKIM, and DMARC records on day one.
- Warm up the sending domain: start with low volume and increase gradually.
- Keep the email plain and short: "Here's your Trade Survival Report" + download link + one line of context. No heavy HTML, no multiple images, no salesy copy in the transactional email.
- Implement a fallback: "Didn't receive your email? Click here to download directly" on the thank-you page (with a 60-second delay link to maintain the email capture incentive).

**Warning signs:**
- Email open rate below 50% (for a transactional "here's what you requested" email, expect 70%+).
- Support requests about missing emails.
- SPF/DKIM/DMARC not configured (check with MXToolbox).
- Using a free-tier email service or sending from a shared IP.

**Phase to address:**
Email Integration phase — configure DNS records and choose the transactional email provider before building the email flow.

---

### Pitfall 12: The 75% Efficiency Cap Feels Arbitrary Without Explanation

**What goes wrong:**
A tradesperson who genuinely bills 90% of their hours sees the 75% cap and feels insulted or dismisses the entire tool. "I know my business better than some website." They either abandon the calculator or dismiss the results as irrelevant. The hard cap, which is actually the tool's most valuable feature, becomes its biggest trust killer.

**Why it happens:**
Developers implement the cap as a hard limit with an error message ("Maximum 75%") without explaining why. The tradesperson has no context for why the tool is overriding their self-assessment.

**How to avoid:**
- When the cap triggers, show an inline explanation — not just a warning, a persuasive one: "We cap billable hours at 75% because the other 25% goes to quoting, invoicing, travel, admin, and the occasional Monday where nothing goes to plan. Even if you think you're billing more, this buffer protects you from the months where you're not."
- Use the word "protect" not "limit" — framing matters enormously.
- Consider showing a toggle: "I understand the risk — show me uncapped numbers too" that displays both scenarios side-by-side. The capped version is labelled "Safe" and the uncapped is "Optimistic." This gives agency while still delivering the core message.
- In the PDF, include a section explaining all built-in guardrails (75% cap, 15% slippage, 30% employer burden) as "Reality Checks" with plain-English justification.

**Warning signs:**
- Hard cap with no visible explanation.
- Error-style messaging (red text, "invalid input") for the cap.
- No mention of the guardrails in the PDF report.
- User feedback calling the tool "unrealistic" or "doesn't know my trade."

**Phase to address:**
UI/UX Design phase (inline explanation copy) and Content phase (PDF guardrail explanations).

---

### Pitfall 13: Sole Trader vs. Ltd Company Tax Treatment Conflated

**What goes wrong:**
The calculator applies Corporation Tax to a sole trader's earnings, or fails to distinguish between the two entity types meaningfully. Sole traders don't pay Corp Tax — they pay Income Tax. Showing a "Corp Tax buffer" to a sole trader is confusing and erodes trust. Conversely, showing a Ltd company owner their "take-home" without mentioning dividends vs. salary is misleading.

**Why it happens:**
The PROJECT.md specifies "Corp Tax for Ltd, pass-through for Sole Trader" but in implementation, these code paths diverge more than expected. The entity type selection affects multiple downstream calculations, and it's easy to miss one branch.

**How to avoid:**
- Entity type (Sole Trader / Ltd Company) must be the FIRST question — it affects the language and calculations on every subsequent screen.
- Maintain two distinct calculation paths, not one path with conditional tweaks.
- For Sole Traders: label the tax buffer as "Income Tax provision" not "Corporation Tax."
- For Ltd Companies: label the personal draw as "Director's Salary + Dividends" with a note that the split affects tax efficiency.
- Test both entity types end-to-end with the same inputs and verify the outputs differ correctly.

**Warning signs:**
- "Corporation Tax" text appearing on a sole trader's results.
- Identical outputs for Sole Trader and Ltd Company with the same inputs.
- No entity type selection in the form, or entity type asked late in the flow.

**Phase to address:**
Calculation Engine phase — implement and test both paths. UI phase — ensure language adapts to entity type.

---

### Pitfall 14: Direct Link Sharing Breaks the Calculator State

**What goes wrong:**
A tradesperson completes the calculator, copies the URL to share with their business partner, and the partner opens a blank calculator with no inputs. Or worse, the user refreshes mid-way through and loses all progress. For a multi-step wizard, this is a near-certainty.

**Why it happens:**
State lives in JavaScript memory only. No URL parameters, no session storage, no persistence. The multi-step form is a client-side state machine that resets on any navigation event.

**How to avoid:**
- Use `sessionStorage` to persist form state across page refreshes (not `localStorage` — session scope is correct for a one-shot tool).
- On the results page, generate a shareable URL with encoded parameters (base64 or compressed query string) so results can be bookmarked/shared.
- On refresh during the wizard, restore to the last completed step with populated fields.
- On the results page, a "Start Over" button explicitly clears state.

**Warning signs:**
- Refreshing the page at any step loses all input data.
- No "Start Over" or "Edit Inputs" mechanism on the results page.
- Sharing the results URL shows a blank calculator.

**Phase to address:**
Foundation/Architecture phase — design state management approach before building the wizard.

---

### Pitfall 15: Material Slippage Factor Confuses Users Who Don't Buy Materials

**What goes wrong:**
Service-only tradespeople (e.g., cleaning companies, gardeners, some electricians doing labour-only work) see a "15% material slippage" line item adding costs that don't apply to them. It inflates their revenue target and makes the calculator feel inaccurate for their business model.

**Why it happens:**
The 15% slippage factor is applied universally to all direct costs, but "direct costs" means different things for different trades. For a builder, direct costs are 60% materials. For a cleaner, direct costs might be 5% consumables.

**How to avoid:**
- Relabel "Direct Cost %" as "Materials & Direct Job Costs %" with an example: "Include materials, subcontractor costs, skip hire — anything you spend to deliver the job."
- When direct cost % is set to 0%, skip the slippage factor entirely and hide it from outputs.
- In the slippage explanation, be explicit: "This 15% buffer covers material price increases, waste, and mis-orders. If your direct costs are mainly labour, this will be small."
- The PDF should show slippage as a line item only when direct costs > 0%.

**Warning signs:**
- Slippage line item showing in outputs when direct cost % is 0%.
- Users with low direct costs seeing a confusingly small slippage number (e.g., "Material Slippage: £12/month") that clutters the report.

**Phase to address:**
Calculation Engine phase (conditional logic) and UI/Content phase (labelling and explanation copy).

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline all calculation logic in UI components | Faster initial build | Impossible to unit test, formulas buried in render code, bugs hide in JSX | Never — extract a pure `calculate()` module from day one |
| Client-side PDF with html2canvas | No server needed | Browser-specific rendering, 2-5MB files, iOS Safari failures, slow generation | Only if zero server infrastructure is a hard constraint |
| Hardcoded email templates as HTML strings | Quick to ship | Impossible to preview, no template variables, breaks on email client updates | MVP only — move to a template engine before scaling |
| Single currency symbol hardcoded as £ | Works for UK | Ireland uses EUR — every currency display breaks | Never — use a locale-aware formatter from the start |
| Storing form state in component state only | Simpler code | Refresh = total data loss, can't restore sessions | Never — use sessionStorage from step 1 |
| Skipping input validation on "obvious" fields | Faster form flow | Negative numbers, 999% direct costs, blank fields crash calculations | Never — validate every field, every time |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Email service (Mailchimp/ConvertKit) | Sending the PDF as an attachment via the marketing platform | Use a transactional email service (Resend/Postmark) for report delivery; only add to marketing list after confirmed consent |
| PDF generation (serverless) | Cold start latency makes first PDF generation take 10+ seconds | Use a provisioned/warm function or pre-warm on page load. Show progress indicator regardless |
| Analytics (GA4/Plausible) | Tracking page views only, not funnel steps | Track each wizard step, result view, email submit, and PDF download as discrete events. Build a funnel report from day one |
| DNS/Email auth (SPF/DKIM) | Configuring after first emails are sent, tanking sender reputation from launch | Configure SPF, DKIM, DMARC records BEFORE sending a single email from the domain |
| Form submission API | No rate limiting on the email capture endpoint | Add rate limiting (5 requests/minute/IP) and honeypot fields for bot protection |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading PDF library on initial page load | 300KB+ added to first paint, Lighthouse score tanks | Dynamic import PDF library only when user clicks "Get Report" | Immediately — affects every single visitor |
| Unoptimised hero/brand images | 2MB PNG logo, uncompressed background images | WebP/AVIF format, max 50KB per image, lazy-load below-fold images | Immediately on mobile 4G connections |
| No CDN for static assets | 200ms+ latency for users far from origin server | Deploy static assets to CDN (Cloudflare/Vercel edge) | At any meaningful traffic volume from ad campaigns |
| Server-side PDF generation without queueing | Lambda timeouts under concurrent load from ad traffic spikes | Queue PDF generation requests, return status poll endpoint, deliver async | 50+ concurrent users (a successful Facebook ad can generate this in minutes) |
| Synchronous email send in the request path | User waits 2-5 seconds for email API response after form submit | Fire-and-forget email send (async), show "Report sent!" immediately | Noticeable at any scale, critical during traffic spikes |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing email addresses in client-side code or URL parameters | Email harvesting, GDPR violation, user trust destruction | All email handling server-side. Never include email in URLs, local storage, or client-side state that could be inspected |
| No rate limiting on calculation/email API endpoints | Bot abuse, cost explosion on serverless, email list pollution with fake addresses | Rate limit by IP (5/min), add honeypot field, consider simple proof-of-work or invisible reCAPTCHA on email form |
| PDF download links that never expire | Anyone with the link accesses the report indefinitely, link sharing defeats the lead capture purpose | Time-limited signed URLs (24-48 hour expiry). Regenerate on request |
| Storing calculation inputs in server logs | Financial data (salary, revenue) in plain text logs is a GDPR liability | Ensure calculation inputs are never logged server-side. If analytics tracks inputs, anonymise/aggregate only |
| No Content Security Policy headers | XSS attacks could inject fake calculator results or phishing email forms | Set strict CSP headers. Only allow scripts from your domain and trusted CDNs |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Using accountancy jargon ("gross draw," "direct costs," "employer burden") | Tradesperson doesn't understand the question, enters wrong numbers or abandons | Plain English with examples: "What do you want to take home each month, after tax?" with a helper: "This is the amount that hits your personal bank account" |
| No currency symbol or formatting on input fields | User unsure whether to enter 3000 or 3,000 or £3,000 | Show £/EUR prefix in the field, auto-format with comma separators on blur, strip non-numeric on submit |
| Results page is a wall of numbers | Overwhelming, nothing stands out, user doesn't know what to do with the information | Hero number (Hourly Floor Rate) displayed huge and bold. Supporting numbers in a clear hierarchy. Action-oriented framing: "You need to charge at least £X/hour" |
| No "Edit my inputs" path from results | User spots a mistake, has to start over from scratch | "Edit inputs" link on results page that returns to the wizard with all fields populated |
| Form works only with mouse/tap — no keyboard navigation | Accessibility failure, power users slowed down, potential legal issues | Ensure tab order works through all fields, Enter advances steps, all inputs keyboard-accessible |
| Mobile form fields too small or too close together | Fat-finger errors, frustration, accessibility failure on 5" screens | Minimum 44px touch targets, generous spacing between fields, full-width inputs on mobile |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Calculator form:** Often missing input validation for edge cases — verify: negative numbers, zero in all fields, 100% direct costs, maximum values for every field
- [ ] **Results display:** Often missing the legal alerts (CIS/RCT, Two-Thirds Rule, Gross Draw tax warning) — verify all three alerts trigger correctly with appropriate inputs
- [ ] **PDF report:** Often missing disclaimer section or has it as 6pt footer text — verify disclaimer is a visible, bordered section with full legal language
- [ ] **Email capture:** Often missing GDPR consent checkbox, privacy policy link, or double opt-in — verify all three are present and functional
- [ ] **Mobile layout:** Often missing testing on actual devices — verify on a real iPhone SE (smallest common screen) and a mid-range Android, not just Chrome DevTools
- [ ] **Currency handling:** Often missing EUR support — verify every currency display works for both GBP (£) and EUR (EUR) based on selected market
- [ ] **Accessibility:** Often missing ARIA labels, focus management between wizard steps, and screen reader testing — verify with VoiceOver/NVDA
- [ ] **Error states:** Often missing handling for network failures during email send or PDF generation — verify offline/timeout scenarios show helpful messages, not blank screens
- [ ] **Analytics:** Often missing funnel event tracking — verify step-by-step completion, email capture, and PDF download events fire correctly in analytics
- [ ] **Asterisk notes:** Often missing on calculated figures — verify every tax figure, buffer, and capped value has an explanatory note

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Floating point display errors | LOW | Add `formatCurrency()` wrapper to all outputs. Single-file change if calculations are separated from display |
| PDF rendering inconsistencies across browsers | MEDIUM | Switch to server-side PDF generation. Requires adding a serverless function but the template can be reused |
| Email deliverability problems (landing in spam) | HIGH | Requires domain warm-up (2-4 weeks), switching email provider, reconfiguring DNS. Cannot be rushed |
| Missing GDPR consent on existing captured emails | HIGH | Cannot retroactively obtain consent. Must discard non-consented emails and restart list building. Implement consent correctly and re-capture |
| Wrong tax treatment for entity type | MEDIUM | Fix calculation paths and re-test. Low code cost but high trust cost if users noticed incorrect figures |
| Slow initial load from heavy framework | HIGH | Migrating from React to vanilla JS is a near-rewrite. Must be chosen correctly at the start |
| Missing CIS/RCT warnings | LOW | Add a toggle field and conditional alert text. Small code change, large trust improvement |
| State loss on page refresh | MEDIUM | Add sessionStorage persistence. Moderate refactor depending on how state is currently managed |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Too many fields / bad mobile UX | UI/UX Design | Usability test: can someone complete the form in under 90 seconds on a phone? |
| Floating point rounding | Calculation Engine | Unit tests with known inputs produce expected outputs to the penny |
| Zero staff edge case | Calculation Engine | Zero-staff is the first test case; outputs contain no NaN/Infinity/empty sections |
| PDF generation issues | PDF/Report Generation | Generate PDF on Chrome, Safari, Firefox, iOS Safari, Android Chrome — all match |
| Email gate abandonment | UI/UX Design + Email Integration | Email capture rate exceeds 25% of calculator completions |
| Irish Two-Thirds VAT rule | Calculation Engine + Output | Irish user with 70% direct costs sees Two-Thirds Rule alert |
| CIS/RCT warning missing | Calculation Engine + Output | CIS toggle produces visible cash flow warning with adjusted numbers |
| Tax disclaimer missing/buried | Content + Every Output Phase | Disclaimer visible without scrolling on results page; dedicated section in PDF |
| Slow initial load | Tech Stack/Foundation | Lighthouse Performance score 90+ on mobile; TTI under 2 seconds on Slow 4G |
| GDPR non-compliance | Email Integration | Consent checkbox, privacy policy link, double opt-in all present and functional |
| Email deliverability | Email Integration | SPF/DKIM/DMARC configured; transactional open rate above 60% |
| 75% cap feels arbitrary | UI/UX Design + Content | Inline explanation visible when cap triggers; PDF explains all guardrails |
| Sole Trader vs. Ltd conflation | Calculation Engine | Different outputs for same inputs with different entity types; correct tax language per type |
| State loss on refresh | Foundation/Architecture | Refresh at any wizard step restores inputs; results page has shareable URL |
| Material slippage confuses service-only trades | Calculation Engine + Content | 0% direct cost input hides slippage from outputs entirely |

## Sources

- UK GDPR / Data Protection Act 2018 — ICO guidance on consent for direct marketing
- Irish Data Protection Commission — guidance on electronic direct marketing
- HMRC CIS guidance (gov.uk/what-is-the-construction-industry-scheme)
- Irish Revenue RCT guidance (revenue.ie/en/tax-professionals/tdm/income-tax-capital-gains-tax-corporation-tax/part-18/18-01-05.pdf)
- Irish Revenue VAT Two-Thirds Rule (Section 11(2) VAT Consolidation Act 2010)
- Web.dev performance budgets and Core Web Vitals thresholds
- Unbounce Conversion Benchmark Report — form field count vs. conversion rate data
- Baymard Institute — checkout/form UX research (applies to multi-step calculators)
- Common jsPDF / html2pdf / Puppeteer gotchas from Stack Overflow and GitHub Issues
- Postmark/Resend deliverability guides for transactional email best practices
- Direct domain experience: financial calculator lead magnets for service businesses

---
*Pitfalls research for: Financial calculator lead magnet for UK/Ireland tradespeople*
*Researched: 2026-03-28*
