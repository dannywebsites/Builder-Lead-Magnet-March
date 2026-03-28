# Phase 8: GDPR Compliance & Privacy Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 08-gdpr-compliance-privacy-infrastructure
**Areas discussed:** Privacy policy content, Consent UX placement, Plausible setup, Data handling policy

---

## Privacy Policy Content

### Policy Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal focused | Single page covering only what this app does. Plain English, not legalese. | ✓ |
| Comprehensive template | Full GDPR-compliant policy covering broader scenarios. More future-proof but heavier. | |
| Lawyer-reviewed placeholder | Bare minimum placeholder linking to future professional policy. | |

**User's choice:** Minimal focused
**Notes:** None

### Policy Format

| Option | Description | Selected |
|--------|-------------|----------|
| Separate /privacy page | Dedicated route — standard practice, linkable from footer and consent checkbox. | ✓ |
| Modal overlay | Opens in modal when link clicked. Keeps user on calculator page. | |
| Expandable accordion | Inline expandable section near consent checkbox. | |

**User's choice:** Separate /privacy page
**Notes:** None

---

## Consent UX Placement

### Consent Location

| Option | Description | Selected |
|--------|-------------|----------|
| On the email capture modal | Checkbox on the email modal that gates PDF download (Phase 9). Single interaction point. | ✓ |
| Before the results screen | Consent collected before showing results. More conservative, more friction. | |
| Two-step: email then consent | Email first, then separate consent confirmation. More explicit, extra click. | |

**User's choice:** On the email capture modal
**Notes:** None

### Consent Copy

| Option | Description | Selected |
|--------|-------------|----------|
| Single consent line | "I agree to receive my report and occasional tips by email. See our Privacy Policy." | ✓ |
| Separate consents | Two checkboxes: report delivery (required) + marketing (optional). | |
| You decide | Claude picks based on UK/IE GDPR best practices. | |

**User's choice:** Single consent line
**Notes:** None

---

## Plausible Setup

### Hosting Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Plausible Cloud | Script tag only. €9/month after trial. | |
| Self-hosted on VPS | Docker on DigitalOcean/Railway. Free but needs setup. | |
| Skip analytics for now | No analytics in this phase. | ✓ |

**User's choice:** Skip analytics for now
**Notes:** User wants free, Vercel-hosted solution. Plausible can't run on Vercel (requires Elixir/PostgreSQL server). Umami mentioned as future candidate (can deploy to Vercel + free DB).

### Custom Events (not applicable — analytics deferred)

**User's choice:** Email captured was the only event selected before analytics was deferred entirely.

---

## Data Handling Policy

### Email Storage

| Option | Description | Selected |
|--------|-------------|----------|
| Resend contacts only | Emails go directly to Resend's contact list. No database needed. | |
| Separate database | Store in Supabase/PlanetScale for more control. | |
| You decide | Claude picks simplest GDPR-compliant approach. | ✓ |

**User's choice:** You decide (Claude's discretion)
**Notes:** None

### Data Deletion

| Option | Description | Selected |
|--------|-------------|----------|
| Manual email request | Privacy policy states users can email to request deletion. | ✓ |
| Unsubscribe link only | Removes from future sends but not full deletion. | |
| Self-service deletion | Build a page for users to request deletion. | |

**User's choice:** Manual email request
**Notes:** None

---

## Claude's Discretion

- Email storage architecture — simplest GDPR-compliant approach
- Privacy policy exact wording — follow UK ICO guidance
- Consent component API design

## Deferred Ideas

- Analytics integration (Umami on Vercel leading candidate) — future phase
- Self-service data deletion portal — manual email sufficient for MVP
- Granular consent (separate marketing vs transactional checkboxes) — single line chosen
