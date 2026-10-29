# CLAUDE.md — Laia Support App v4

This repository is the rebuild of the **Laia Support App** (Legal AI Assistant), a Florida family-law app sold by Legal Authority Lab (LAL). It calculates § 61.30 child support, § 61.08 alimony, equitable distribution and the Form 12.902(c) financial affidavit from one case file, drafts documents for attorney review, tracks discovery and builds mediation, hearing and trial boards.

Owner: Leisa Wintz (product, legal rules). Engineering owner: Henry (structure, review, merges). Read `docs/SPEC.md` before changing behavior and `docs/REVIEW.md` for the plan.

## Non-negotiables (these come from the firm and are not up for engineering judgment)

1. **The numbers do not move without approval.** `tests/expected/*.json` are golden values captured from v3.3. Every build must reproduce them exactly. If a change should move a number (a tax table update, a formula fix), stop, explain the change and the before/after, and get Leisa's approval before updating a golden file. Log the change in `docs/CHANGELOG.md`.
2. **No legal content from memory.** Never add statutes, case law, form wording or thresholds from model memory or the web. Legal text comes from the firm format masters and skills listed in `docs/FORMAT-MASTERS.md`, or from Leisa. If something is missing, leave a clearly marked `TODO(legal)` and ask. Every statutory reference shown in the app carries an attorney-verification note.
3. **Nothing is cleared for filing.** Every generated document is an attorney review draft. Keep the "DRAFT — INTERNAL USE ONLY — SUBJECT TO ATTORNEY REVIEW — NOT FOR FILING" footer and never add a feature that marks a document final or filed.
4. **Petitioner / Respondent** in all labels and outputs. Never Husband/Wife.
5. **The app never classifies property as marital or nonmarital.** It records what each side claims and what documents show; the attorney decides.
6. **Privacy promise.** "Legal Authority Lab never receives or keeps your case data." No analytics, telemetry, remote logging or hosted storage of case data. Data stays in the browser, in files the user saves, or in the firm's own SharePoint/Dropbox.
7. **Filing format vs. brand.** Court filings and filing-style drafts: Times New Roman 12, black, single-spaced, 1" margins, firm caption, no brand color or brand fonts. Non-filing screens and boards: brand (Lato body, Playfair Display for subheads/captions only; Pink #FF1F8E, Orange #FF6B00, Lime #C8D400, Teal #00B5B8 always in that order; Black #0D0D0D; Paper #F7F5F0).
8. **AI wording.** In the demo and marketing builds, say "your AI assistant," not "Claude." The licensed build may name Claude where it is the actual integration.
9. **Certificate of compliance** follows the firm format master exactly: three markers only — (Produced) / (Will Be Produced) / (Not Applicable); FA item takes a marker only; income-statement item is Produced with no list when stubs or returns were produced; lead-in "The following were produced:"; no dates on future production; no attorney block, notary, certificate of service or AI certification; ends with the party's signature.

## Engineering rules

- Keep the calculation engine in `src/engine/` with **no DOM code**. Screens import it. The demo, the Tennessee build and Claude skills must be able to call the same engine.
- One versioned case-file schema (`src/schema/`). Older .json files (v3 `{app, v, state}`) must open through an upgrade function, never fail.
- Screens update only what changed. No whole-page re-render on every keystroke; preserve cursor and scroll.
- Ship as **one self-contained HTML file** (bundle PDF, Word, Excel and PDF-text libraries in). It must run offline and inside a claude.ai artifact (no external fetches except Google Fonts with fallbacks).
- Editions (Basic, Pro, Premium, Ultra) and the Demo come from one source via a build flag. The demo locks: host-locked to tiiny/legalauthoritylab domains, no save/open/new client/downloads (show a preview modal instead), AI steps show a preview, names fixed, outputs stamped DEMO.
- Every PR: run `npm test` (golden values), the render pass at 1440×900 and 390×844 in light and dark, and a console-error check. Attach screenshots of changed screens.
- Small commits with plain-English messages. Never commit real client data; fixtures are fictional or anonymized with tokens like `[CLIENT_NAME]`.

## How to verify a change

1. `npm test` — engine reproduces `tests/expected` exactly.
2. `npm run render-check` — every section renders at both sizes with no script errors.
3. For output changes, generate the document from both demo fixtures and compare it to the format master named in `docs/FORMAT-MASTERS.md`.
