# Laia Support App — UX and engineering review (2026-10-29)

Live, editable copy: "Laia Support App — UX and Engineering Review" doc in Leisa's claude.ai artifacts. This file is the snapshot the v4 build works from.

## Bottom line

The math and the drafting are strong; the app is hard to work in because every screen is a long form inside a crowded frame, and the code is 19 patched layers that slow every change.

1. Give the work area the screen: one slim sticky row; everything else scrolls away. *(Started in v3.3c: header 124 px.)*
2. One navigation: top tabs for areas, left list for steps; no "Jump to." *(Jump to removed in v3.3c.)* Group 11 tabs into 7.
3. Edit in grids, not long forms: FA Section II (245 fields) and ED inventory (126 fields) become spreadsheet-style tables with filters, keyboard entry and paste from Excel. *(v3.3c hides empty Section II lines by default.)*
4. Compare side by side: scenarios, versions and "their numbers vs. ours" in columns with changes highlighted.
5. Rebuild as one clean v4 with a golden test set.

## Measured on v3.3 (1440 × 900, Rivera demo)

| Screen | Page height | Fields |
| --- | --- | --- |
| Settlement scenarios | 8,499 px | 2 |
| FA Section II | 7,775 px (2,995 px with filled-lines view) | 245 |
| FA review & generate | 6,676 px | 3 |
| ED inventory | 6,021 px | 126 |
| Product guide | 5,765 px | 1 |
| Memo & PDFs | 5,455 px | 34 |

## User-side target

- **Layout:** one 48 px sticky row (tabs, client name, live number, File menu, Download menu); case details, chips and privacy note scroll; right summary becomes a drawer; phone gets one bar.
- **Tabs (7):** Clients (product guide first in the demo; Help in licensed), Overview (case, issues, versions, boards), Support (child support, alimony, retro), Affidavit (party toggle), Property (ED), Discovery (our client and OP side by side), Drafting (all documents). ⌘/Ctrl K jump-to search.
- **Grids:** FA Section II and ED inventory as editable tables with sticky headers, filters (disputed, category), sort, keyboard navigation, paste a column; side panel for item detail. Help text as ⓘ hover. Every number tagged with its source (typed, FA line, document, AI-read) and clickable.
- **Views:** Compare mode (2–4 columns: current, scenarios, versions, their numbers; changed lines highlighted; difference row). Present mode for mediation screen-share (hides notes, flags, internal positions; big numbers; quick-scenario chips). "What changed" feed on Overview. Undo/redo (50 steps) separate from versions.
- **Output:** one Documents queue with status (draft/reviewed/final), date and the case version each came from; stale-draft warning when numbers changed; firm naming convention; save to client folder; pre-download check of missing fields and unconfirmed values.

## Developer-side findings

| Finding | Measured | Effect |
| --- | --- | --- |
| Layered patches | 19 script blocks; render wrapped 14×, action handler 12×, guide replaced 4× | Later layers silently undo earlier ones |
| Whole-page redraw | Every value change rebuilds #main | Typing lag on big screens; cursor/scroll jumps |
| Engine mixed with screens | Math sits beside HTML | Can't test or reuse it |
| CDN libraries at run time | jsPDF, autotable, JSZip, SheetJS, pdf.js from cdnjs | Downloads fail offline or behind firewalls |
| Storage | localStorage + manual .json | Lost on cleared browser; no attorney/paralegal sync |
| No automated tests | — | Formula/tax changes can shift numbers unnoticed |
| Hand-built Word XML per document | — | Formatting drifts from format masters |
| Filename-only disco classification | — | Badly named files need manual sorting |

## v4 engineering plan

1. Freeze the answers: 40–50 anonymized real worksheets + the two demos as golden tests (to the dollar).
2. Engine split out (`src/engine/`), no DOM.
3. Versioned case-file schema with upgrades from v3 .json.
4. Component UI that updates only what changed (Preact or Svelte, small).
5. Bundle all libraries into the single HTML file.
6. One document engine rendering from templates that mirror each format master; firm caption, naming and draft stamp applied centrally.
7. Save/sync to the client folder (SharePoint/Dropbox) through the firm's connectors; browser as cache.
8. Disco scan reads first-page text (PDF text/OCR) to confirm type, account ending and period; unreadable scans reported by name.
9. One source, build flags for Basic/Pro/Premium/Ultra/Demo.
10. CI: golden tests, render pass (laptop + phone, light + dark), console-error check.

## Order of work

1. **Done on v3.3c (published 10/29):** slim header, File menu, Jump to removed, duplicate ED export buttons removed, filled-lines view for Section II, help as ⓘ.
2. **Next on v3.3:** present mode, compare mode, ⌘K, undo.
3. **v4 groundwork (weeks 2–4):** golden test set, engine module, schema. Gate: every golden case reproduces to the dollar.
4. **v4 screens (weeks 4–8):** 7 tabs, grids, Discovery side by side, Documents queue + document engine. Gate: render pass clean; outputs match format masters.
5. **v4 connected (weeks 8–10):** folder sync, content-reading disco scan, editions + demo from one build. Gate: beta firms migrate open cases with no number changing.
6. **Backlog from office hours:** buyout vs. sale net equity (Cheryl-Dene), CMA link, capital gains exclusion flag, QDRO gross-up/tax effects, imputed return on assets, new client from a folder link.

**Open decision (Leisa + Henry):** single HTML file synced through the firm's storage (recommended; keeps the privacy promise) vs. a hosted app.
