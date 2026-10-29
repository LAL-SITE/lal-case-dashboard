# Laia Case Manager — behavior spec (as built in v3.3, 2026-10-29)

This is what the app does today. v4 keeps every behavior here unless `docs/REVIEW.md` changes it. The running reference is `reference/current/laia-support-app-v3.3.html`; open it in Chrome and load Demo 1 (Rivera) or Demo 2 (Johnson) from the Product guide.

## Global

- **Case file** is one state object `S` (see `tests/fixtures/*.case.json`): `meta` (caption, case no., court, issues, client side), `parties.A` (Petitioner) / `parties.B` (Respondent) incomes and deductions, `children` (DOB, overnights, graduation date), `costs`, `scenarios[]`, `aa` (alimony calculator), `alimony` (manual/ordered), `fa` (financial affidavit per party), `ed` (items, docs register), `coc`/`disco` (discovery), `retro` (incl. `periods[]`), `boards`, `memo`.
- **Live result** in the header and a right summary rail: child support amount, payer, shared/sole method, net incomes, obligation, overnights, review flags, schedule and tax-year source line. On ED screens the rail shows the equalizer.
- **Save**: save client in the app (browser library with versions), Save .json, Open .json, version history with restore. Unsaved changes show a "Not saved" marker.
- **Downloads** (header Download menu): worksheet PDF, all-scenario worksheets, step-down, scenario PDF, memo, ED .xlsx, FA .docx/PDF, case .json.
- **Editions**: Basic, Pro, Premium, Ultra set on the Product guide; sections above the edition show a lock card. Tiers per section are listed below.
- **AI steps** use the artifact `sample` capability when present (goal planner AI plans, FA import, ED extraction, assessments AI review, disco sorting). Without it they explain and fall back.
- Privacy bar: "Legal Authority Lab never receives or keeps your case data."

## Tabs and sections

| Tab | Section | Tier | What it does |
| --- | --- | --- | --- |
| Product guide | Product guide | all | Demo launchers, editions & pricing (purchase/subscription, beta prices), FLS/DPA comparison, how-to |
| Clients | All clients | all | Saved clients table (sort, search, open, duplicate, delete), demo cases |
| Clients | New client | all | Name + issues; (backlog: link to client folder) |
| Case overview | Overview | all | Issue cards with headline numbers, links into each area |
| Case overview | Case & parties | all | Caption, case no., court, parties, our client, issues (incl. retro, modification), prior order for modifications |
| Case overview | Save & versions | all | Save, auto-versions, restore |
| Child support | Children & overnights | all | Children, DOB, graduation date, overnights per child, schedule sync |
| Child support | Income | all | Filing status, wages by job and period, overtime, self-employment (SE tax), S-corp K-1, other income, impute FL minimum wage |
| Child support | Deductions | all | Taxes (federal incl. EITC, FICA), health insurance, union dues, mandatory retirement, court-ordered support |
| Child support | Child care & medical | all | Child care, children's health/dental premiums, uncovered medical, who pays |
| Child support | Guidelines worksheet | all | FLS/DPA-style worksheet for current inputs or a scenario; PDF |
| Child support | Step-down & modification | all | Step-down schedule by child graduation/18; modification comparison vs. prior order |
| Child support | Scenarios & what-if | all | Saved scenarios with levers, comparison table and chart, pin scenarios as tabs, "use saved scenarios as retro periods" (Ultra) |
| Child support | ✦ Goal planner | all | Target amount → every lever path (overnights cap 182.5, income, child care, insurance, tax, alimony, deviation), combination plan, "no path" verdict, AI-tested plans |
| Child support | Memo & PDFs | all | Child support assessment memo settings and PDFs |
| Financial affidavit | ⇪ From a file | all | Read a PDF/Word/text FA (Sections I–II, employment) into a review table; apply |
| Financial affidavit | Setup & income / Section II / Section III / Review | all | Form 12.902(c) by party; pulls from child support; estimates flagged; footnotes; preview; .docx/PDF; attorney flag summary. v3.3 shows filled Section II lines by default with "show all" |
| Alimony | Alimony calculator | all | § 61.08 inputs, need/ability, caps, duration by marriage length, link to child support |
| Alimony | Length & net what-if | all | Marriage-length ladder and income-swing set |
| Alimony | Manual / ordered | all | Ordered or agreed amount |
| Equitable distribution | Documents & import | Pro | Register of affidavits/statements; AI extraction into the inventory |
| Equitable distribution | Inventory | Pro | Items with P value, R value, document value, basis, title, nonmarital claim, who receives |
| Equitable distribution | ED chart & equalizer | Pro | Seven-column chart (format master), quick scenarios (keeps home, sell, QDRO, each keeps own), .xlsx with formulas, PDF, equalizer memo |
| Equitable distribution | Settlement scenarios | Pro | Saved ED scenarios compared |
| Equitable distribution | Mediation & client boards | Pro | In-app boards and PDFs |
| Drafting | Parenting plan / MSA / IDO & addenda | Premium | Drafts from the case file (MSA with Exhibit A ED chart, Exhibit C CS summary), IDO, notice to payor, worksheet addenda, drafting packets |
| Boards | Mediation / Hearing / Trial prep | Ultra | Generate now (from case file) or enter details manually (collapsed); board HTML to the mediation-board and trial-board standards; trial prep flags goals marked [not pled]; Full build hands off to the firm skill with a prompt + packet |
| Retro | Retroactive calculator | Ultra | Start/through, paid, CS/alimony per month, chart, summary .docx. Tab appears only when retro is in play |
| Retro | Charts & summaries | Ultra | Periods from saved scenarios or typed amounts, totals, chart, charts & summaries .docx, notice of intent to use summaries .docx |
| Client disco / OP disco | Tracker | Ultra | Scan & update from client folder (folder picker + register; filename/folder classification into the 18 Rule 12.285 items; party by folder or name; coverage checks 6/12/24 months, 3 years), AI sort, status override per item, needs-sorting table |
| Client disco / OP disco | Assessments | Ultra | Income analysis, gap assessment, FA ↔ mandatory disclosure cross-check, FA ↔ other party's FA, child support inputs check; run all; memo .docx; deeper AI review |
| Client disco | Responses & compliance | Ultra | Certificate of compliance auto-filled in firm format (preview + .docx), still-owed list, drafting packet |
| OP disco | Requests & follow-up | Ultra | RFP, RFA, interrogatories, employer subpoena (.docx), deficiency/good-faith letter for unproduced disclosure |

## Calculation notes to preserve

- § 61.30 schedule and the 2026 federal tax figures as currently implemented (see the rail's "Schedule" and "Tax" source line). Gross-up/shared method applies only when each parent has 73+ overnights (per the firm mediation-board skill; verify against the statute).
- Children's health premium > 5% of gross triggers the § 61.13(1)(b) reasonable-cost flag.
- Step-downs use graduation date when entered, otherwise 18th birthday.
- ED equalizer: target = half of net marital estate; equalizing payment = difference from each side's allocated net.
- Retro: accrued = Σ(months × (CS + alimony)) per period; owed = accrued − paid/credited.

## Demo edition (build flag)

Host lock (tiiny.site/.io/.co/.host, legalauthoritylab, localhost); Product guide opens first with demo launchers; DEMO band; names fixed; Save/Open/New client/duplicate/profile save and file reading show a preview modal; Word downloads show a read-only first-page preview, PDFs an in-page preview stamped DEMO, .xlsx/.json an explanation; AI steps show the prompt they would send; neutral "AI assistant" wording; right-click/select/print/Ctrl+S/U/P blocked; nothing persists across reloads.
