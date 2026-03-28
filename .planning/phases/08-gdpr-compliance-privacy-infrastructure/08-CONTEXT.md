# Phase 8: GDPR Compliance & Privacy Infrastructure - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

GDPR-compliant consent mechanism, privacy policy page, and privacy infrastructure in place before any email is captured in Phase 9. This phase builds the legal/compliance foundation — the email capture modal itself is Phase 9 scope.

</domain>

<decisions>
## Implementation Decisions

### Privacy Policy Content
- **D-01:** Minimal focused privacy policy — plain English, not legalese. Covers only what this app actually does: email collection for report delivery, no third-party data sharing, no cookies.
- **D-02:** Dedicated `/privacy` route as a separate Next.js page — linkable from footer and consent checkbox. Standard practice for compliance.

### Consent UX Placement
- **D-03:** GDPR consent checkbox lives on the email capture modal (built in Phase 9). This phase prepares the consent component; Phase 9 integrates it into the modal.
- **D-04:** Single consent line: "I agree to receive my report and occasional tips by email. See our Privacy Policy." — covers report delivery + future marketing in one clear sentence.
- **D-05:** Checkbox unchecked by default, blocks form submission when unchecked (per REQUIREMENTS LEAD-02).

### Analytics
- **D-06:** Analytics deferred — no analytics integration in this phase. Will be addressed in a future phase when a free, self-hostable solution is chosen. Plausible Cloud rejected (paid). Plausible self-hosted rejected (can't run on Vercel).
- **D-07:** Remove Plausible from success criteria for this phase — the other two criteria (consent checkbox + privacy policy) remain.

### Data Handling
- **D-08:** Email storage approach at Claude's discretion — simplest approach that meets GDPR requirements (likely Resend contacts only, no separate database).
- **D-09:** Right-to-erasure handled via manual email request — privacy policy states users can email to request deletion. No self-service portal for MVP.
- **D-10:** Unsubscribe link included in all marketing emails (standard Resend feature).

### Claude's Discretion
- Email storage architecture (D-08) — pick simplest GDPR-compliant approach
- Privacy policy exact wording — follow UK ICO guidance patterns
- Consent component API design — whatever integrates cleanly with the existing form patterns

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements are fully captured in decisions above and the following project files:

### Requirements
- `.planning/REQUIREMENTS.md` — LEAD-02 (GDPR consent checkbox), UX-03 (cookieless analytics — now deferred)

### Prior Phase Context
- `.planning/phases/07-pdf-report-generation/07-CONTEXT.md` — PDF download flow that the consent mechanism must integrate with in Phase 9

### Project Stack
- `CLAUDE.md` — Technology stack decisions, Resend for email delivery

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/layout.tsx` — Root layout where analytics script would go (deferred) and where footer privacy link will be added
- `src/components/ui/` — Existing UI component directory for the consent checkbox component
- `src/lib/form/` — Existing form library patterns for validation integration

### Established Patterns
- Next.js App Router with NuqsAdapter — new `/privacy` route follows existing routing pattern
- Zod validation schemas — consent validation should use the same pattern
- react-hook-form — consent checkbox should integrate with existing form patterns

### Integration Points
- `/privacy` route — new page under `src/app/privacy/page.tsx`
- Consent component — reusable component in `src/components/ui/` for Phase 9 to import into email modal
- Layout footer — privacy policy link added to root layout or a new footer component

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User wants plain English, minimal, and no paid services.

</specifics>

<deferred>
## Deferred Ideas

- Analytics integration (Plausible/Umami/Vercel Analytics) — deferred to future phase. User wants free, Vercel-hostable solution. Umami on Vercel + free DB tier is the leading candidate.
- Self-service data deletion portal — deferred, manual email request sufficient for MVP.
- Granular consent (separate marketing vs transactional checkboxes) — deferred, single consent line chosen for simplicity.

</deferred>

---

*Phase: 08-gdpr-compliance-privacy-infrastructure*
*Context gathered: 2026-03-28*
