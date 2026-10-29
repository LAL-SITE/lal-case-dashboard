---
name: lal-support-suite
description: "Runs the LAL Support Suite for Florida family law — one case file that drives § 61.30 child support, § 61.08 (2023) alimony, the FMLG seven-column equitable distribution chart and equalizer (with affidavit and mandatory-disclosure import, sale, buyout and retirement-offset scenarios, and mediation and client boards), the Form 12.902(c) (06/25) financial affidavit generator, step-down and scenario PDFs, and a goal planner that shows what it would take to reach a child support target. Use when someone says \"new client in the support suite,\" \"open a prior run,\" \"import the FAs into the ED chart,\" \"what would it take to get child support under $X,\" \"child support at zero,\" \"step-down PDF,\" \"save this scenario,\" \"open the support suite,\" \"load this case into the calculator,\" \"build the case file for the support app,\" \"run child support and alimony,\" \"ED chart for mediation,\" \"equalizer board,\" \"client board,\" \"generate the financial affidavit from the calculator,\" or asks how a tab, number or output in the Support Suite works. Never classifies property as marital or nonmarital and never clears anything for filing."
---

# LAL Support Suite v3.1

**What it is.** A single web app (Claude artifact, also shipped as a standalone HTML file). It opens on a Clients page; opening a client shows a case overview strip (client, Petitioner v. Respondent, case number, court, judge, issues at hand) above tabs that all read one case file:

| Tab | Sections | Key outputs |
|---|---|---|
| Clients | All clients (prior runs — sort by date or client name, search, open, copy), New client (parties, case no., court, matter type, issues at hand) | Saved in the browser; `.json` for the matter folder |
| Case overview | Overview (issues at hand + live figure per issue), Case & parties, Save & versions | — |
| Child support | Children & overnights, Income, Deductions, Child care & medical, Guidelines worksheet, Step-down & modification, Scenarios & what-if, pinned scenario tabs (◆), ✦ Goal planner, Memo & PDFs | Worksheet PDF (FLS/DPA layout), all-scenario PDF, **step-down PDF** (current or any scenario), **scenario PDF** (summary + worksheet + step-down), child support memo PDF |
| Financial affidavit | Setup & income, Expenses (Section II), Assets & liabilities, Review & generate | Form 12.902(c) `.docx` and PDF, attorney flag summary PDF |
| Alimony | Alimony calculator, Length & net what-if, Manual / ordered | Alimony section of the memo; amount feeds child support |
| Equitable distribution | **Documents & import**, Inventory, ED chart & equalizer (with all-document / all-P / all-R / average switch and tax-effected view), Settlement scenarios, Mediation & client boards | `.xlsx` with live formulas, ED chart PDF, equalizer memo PDF, board PDF |
| Product guide | In-app overview and what's new | — |

The published artifact link and the standalone file live in the product folder (see `README.md` beside this plugin). The complete user guide is `LAL Support Suite - Complete Guide.html` in the same folder.

## Non-negotiables (apply every time)

1. Petitioner / Respondent only — never Husband / Wife. Tokens (`[CLIENT_NAME]`, `[PETITIONER]`) for client identifiers in anything that leaves the firm; last four digits of accounts only; no SSNs.
2. Never classify an asset or debt as marital or nonmarital. The app has fields for the attorney's classification; Claude fills them only from an attorney instruction or a document the attorney points to, and says so.
3. Never invent a value. A value not confirmed by a document is entered as the affidavit figure and left unconfirmed (no document value) so the app flags it.
4. Confirm real property title from the deed. If no deed is in the file, title stays "Not confirmed".
5. Caselaw only from the project files or the firm reference library, with an attorney-verification warning. The app cites no caselaw.
6. Every output is a working draft for attorney review. Nothing is cleared for filing. AI-assisted filings need the disclosure the assigned circuit and judge require (verify the standing order live).
7. OCR-verify every PDF before reading figures from it; report unreadable files.

## Workflow A — build a case file from the matter documents

Use when the user wants the app pre-loaded (e.g. "load the Smith FAs into the support suite").

1. Read both financial affidavits, the pay stubs / W-2s, deeds and statements in the matter folder (fmlg-document-intake-rules applies).
2. Build the case file JSON following `references/case-file-schema.md`. Money values are strings of plain numbers (`"6500"`), dates are `YYYY-MM-DD`.
3. ED inventory: one row per item; the same item on both affidavits is one row with `valP` and `valR`; a document figure goes in `valDoc`; disclosure-only items get `listedP:"No"`, `listedR:"No"`, `disc:"Yes"`. Mortgages link to the property with `securedBy`.
4. Leave `alloc` as `"undecided"` unless the attorney or a proposal gives the allocation.
5. Fill `meta.client` (our client: A or B) and `meta.issues` from the engagement and pleadings. Save as `YYYY-MM-DD [Last] Support Suite Case File.json` in the matter folder (`Drafts/` — it is a working file). Tell the user to open the app and use **Open a .json case file** on the Clients page; it then appears in the Clients list once saved.
6. List in chat what you could not confirm (no deed, no statement, conflicting values) — the app will flag the same items.
7. If the user would rather do the ED part in the app, point them to Equitable distribution → Documents & import (Workflow E) instead of building `ed.items` by hand.

## Workflow E — ED import in the app (affidavits and mandatory disclosure)

1. Equitable distribution → Documents & import. Add the Petitioner's FA, then the Respondent's FA, then statements, appraisals and deeds (type: mandatory disclosure, with its kind). Files are read in the browser and never stored; links go in the register — the app cannot open a link, so the user downloads the file and uses **Attach the file**.
2. The built-in reader (or **Read with Claude** where the viewer allows it) proposes rows. Have the user check every row in the review table — category, value, and merge target — before **Import selected**. The same item on both affidavits merges onto one row (valP, valR); a statement fills valDoc.
3. Scanned pages without a text layer are named in an OCR-check note and are not read by the built-in reader. Never tell the user an imported value is confirmed unless a document figure supports it.
4. Imported items arrive as allocation "Undecided", title "Not confirmed". A filled nonmarital column becomes a note for attorney review — never a classification. Use **Undecided → Split 50/50** only when the attorney says so.

## Workflow F — goal planner ("what would it take")

1. Child support → ✦ Goal planner. Type the target in plain words ("under $400", "at zero", "at least $800 without changing time-sharing", "between $300 and $450, no deviation").
2. The app shows, one lever at a time, exactly what would have to change: the payer's overnights, either parent's income, child care, children's insurance, alimony, dependency exemptions, or a deviation — each with what it would need to be supportable. With Claude allowed, it also proposes combinations, re-run through the engine and marked meets / short of the goal.
3. **Run as scenario** creates a pinned scenario tab (then PDF it); **Apply to the case** overwrites the inputs. Recommend running as a scenario first.
4. Frame results as what the numbers would take, not a position to argue. Time-sharing follows the child's best interests, income follows the evidence, imputation and deviations need findings. Never suggest misstating income or time-sharing to hit a number.

## Workflow B — explain or check a number

Read `references/calculation-basis.md`. Walk the user through the exact arithmetic the app shows (worksheet rows, the equalizer line, the FA footnote register). If the user's figure differs, find which input differs; do not "fix" the formula.

## Workflow C — mediation session

1. ED tab → Inventory complete → ED chart & equalizer → Settlement scenarios (sale / buyout both directions / retirement offset) → save offers as named proposals.
2. Mediation board = neutral, both parties, confidential-communication banner (§ 44.405, attorney verify). Client board = one side, plain English, no recommendation.
3. A board PDF carries brand styling and is for the session room or internal use. Anything sent to a client goes out on the firm's real letterhead (fmlg-letterhead-rules) after attorney sign-off.

## Workflow D — financial affidavit

1. Child support tab income and deductions feed Section I; tag each "other income" row with its FA line on the Income screen.
2. Section II: enter every line or pull child care, child insurance, medical and creditor payments with the buttons; tick "est." on estimates.
3. Section III comes from the ED inventory. Original dissolution → Column B marital, Column C nonmarital under the claimant. Any other matter type → Column C only under the filing party, Column B blank.
4. Review the pre-review audit and the Footnote & Flag Register, then download the `.docx`. Draft marking (red + underline) stays on until fmlg-finalize-draft.
5. Under $50,000 gross the short form 12.902(b) applies; the app flags it and only lays out 12.902(c). Pages 14–15 of the 06/25 form (Section E wording, certificate of service, oath) follow the prior form text — compare before filing.
6. Then fmlg-prefiling-qc → attorney sign-off.

## Rules the app enforces — ED (FMLG ED Chart Format Master, Oct 15 2026)

Seven columns in order: Asset / liability · Titled to · Total value · Nonmarital portion · Marital value · Petitioner · Respondent; extras (each FA figure, document value, notes) only to the right. Assets grouped (real property; bank, investment and retirement; vehicles; business and personal property) then liabilities (secured; unsecured), totals across columns 3–7, liabilities in parentheses, cents exact. Unvalued / undetermined / undecided / contingent items stay on the chart but out of the totals and are named in a note. Equalizer block always last: net estate & net to each party → 50% target → equalizing payment = (Respondent net − Petitioner net) ÷ 2 → net after payment. Excel export uses live formulas and matches the HTML to the cent (both round half away from zero).

## Rules the app enforces — FA (Form 12.902(c), 06/25)

Lines 1–17 income, 18–27 deductions, Section II lines 1–120, summary 121–124, Section III A–D, Section E. Every line printed ($0.00 when blank). Automatic register entries: wage conversions, computed tax / FICA / Medicare, mandatory-retirement default-voluntary flag, health insurance double-count, child care and child insurance mismatches with child support, dependents vs. common children, $50,000 threshold and ±$5,000 band, unconfirmed asset values, title not confirmed from a deed, business valuation needed, non-dissolution Column C rule, modeled (not yet ordered) alimony on 9a / 25a. Court format: Times New Roman 12, all black, 1" margins, date in the running header, form footer, firm footer with page X of Y, draft footer.

## Keeping it current

January: federal tax constants (brackets, standard deduction, CTC, EITC, wage base, poverty guideline). September 30: Florida minimum wage. After each legislative session: § 61.30, § 61.08, § 61.075. When the Supreme Court revises Form 12.902(c), re-map the line numbers in `references/fa-12902c-line-map.md` and the app's `FA_INC / FA_DED / FA_EXP` tables. Republish the same artifact so the link stays the same. Saved clients live in each user's browser (per device); the `.json` is the portable copy.

## References

- `references/case-file-schema.md` — every key in the case file JSON
- `references/calculation-basis.md` — child support, alimony, ED and FA math
- `references/ed-chart-format.md` — the firm ED chart format master, restated
- `references/fa-12902c-line-map.md` — 06/25 line map and where each figure comes from
- `assets/lal-support-suite.artifact.html` — app source as published
