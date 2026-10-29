# Calculation basis — LAL Support Suite v3.1

## Child support (§ 61.30, Fla. Stat.) — unchanged from v2.2
- Schedule § 61.30(6), interpolated between $50 rows; above $10,000 adds 5 / 7.5 / 9.5 / 11 / 12 / 12.5% of the excess.
- Substantial time-sharing at ≥ 20% of overnights (73): basic × 1.5, cross-multiplied by the other parent's overnight %, then the cost adjustment.
- Split custody option: schedule run per custodial group and netted (FLS approach) — attorney selects the method.
- 2026 federal tax estimate: brackets, standard deduction, CTC $2,200 ($1,700 refundable), ODC $500, EITC (Rev. Proc. 2025-32), SS wage base $184,500, additional Medicare, SE tax, simplified QBI. S-corp K-1 is taxable with no SE tax.
- Low-income check against the 2026 HHS poverty guideline ($1,330/mo). 5% child-premium check. Step-down at 18 or HS graduation between 18 and 19. Modification threshold: greater of 15% or $50.
- Regression: the v3 engine is the v2.2 engine byte for byte; only the FA line labels changed to the 06/25 numbering (child care 40, extracurricular 43, child insurance 50, camp 58, SS benefits 8).

## Alimony (§ 61.08 as amended July 1, 2023)
- Need = requesting party's expenses (after stripping adult-children and savings items) − requesting net − child support received (when counted). Ability = payer net − payer expenses − child support paid.
- Amount cap = lesser of reasonable need or 35% × (payer net − requesting net).
- Marriage length = date of marriage to date of filing. Under 7 years short-term (durational cap 50% of length); 7 to under 17 moderate (60%); 17+ long-term (75%). Durational requires at least 3 years. Bridge-the-gap ≤ 24 months; rehabilitative ≤ 5 years with a written plan. Permanent alimony unavailable for petitions filed or pending on/after 7/1/2023 — pre-7/1/2023 filings are flagged.
- Length & net what-if: each row re-runs the same need / ability / cap / duration math with only the overridden inputs changed; the ladder re-runs the case at fixed marriage lengths.

## Equitable distribution
- Value used per item: document figure → agreeing affidavits → average of conflicting affidavits (flagged) → the one affidavit that has a figure (unconfirmed). Override per item (document, either FA, average, attorney figure).
- Marital value = total value − nonmarital portion. Debts are negative.
- Allocation fraction to Petitioner: P = 1, R = 0, split = 0.5, custom %. Petitioner column = ROUND(marital × fraction, 2); Respondent column = marital − Petitioner column. Rounding is half away from zero, the same as Excel ROUND, so the HTML and the workbook agree to the cent.
- Totals include only valued, determined, allocated, non-contingent items (nonmarital-only items stay in the total-value and nonmarital columns at $0 marital).
- Net to each party = that party's column across assets + liabilities. Equalizing payment = (Respondent net − Petitioner net) ÷ 2, rounded to the cent; positive = Respondent pays Petitioner.
- Scenarios: sale = home and its linked mortgages split 50/50, home value × (1 − selling-cost %); buyout = home and mortgages to one party (both directions); retirement offset = each retirement account to its titled owner (joint/unknown title split). Saved proposals store each item's allocation.
- Swing analysis: value dispute impact = |FA difference| × |1 − 2f| ÷ 2; reallocation impact = |marital| × max(f, 1 − f); excluded items up to value ÷ 2.

## Financial affidavit (Form 12.902(c), 06/25)
- Line 1 wages = all wage lines converted to monthly less the bonus portion (line 2). Line 3 = net SE income + K-1. Line 8 (or 4) = SS benefits. Line 9 = 9a alimony received in this case (modeled or ordered) + 9b prior case. Lines 4–7 and 10–16 = "other income" rows by their FA line; line 16 also carries a child's derivative SS benefit.
- Line 18 = computed federal + state tax (or the override); 18a filing status; 18b dependents = children this party claims + other qualifying children. 19 = FICA + SE tax; 20 = Medicare; 21 union dues; 22 mandatory retirement; 23 parent's own health/dental/vision; 24 child support paid for other children; 25 = 25a this case + 25b other.
- Line 27 equals the child support calculator's net for that parent unless a net override is set (a reconciliation flag fires when they differ).
- Section II subtotals 27, 39, 65, 70, 79, 105, 119; total 120; summary 121–124.
- Form selection: gross × 12 ≥ $50,000 → long form; otherwise short form flagged.

## Goal planner (v3.1) — child support
- The goal is read as a band on the current payer's monthly payment: at/below X → [0, X] (no flip of payer); at/above X → [X, ∞); about X → X ± max($5, 1%); between X and Y; zero → ±$1 (time-sharing accepts the closest whole night, within $30).
- One lever at a time, every result from the § 61.30 engine: payer's overnights (0–365, whole nights); payer's income and payee's income (monthly gross that replaces wage, SE and K-1 income); alimony from payer to payee; child care paid by the payer; children's health/dental/vision premium paid by the payer (parent's own share held constant); dependency exemptions (all to A, all to B, alternate); deviation (target − presumed). Each lever scans 90 steps in both directions from the current value, bisects the first crossing into the band, snaps to the lever's step and re-verifies; the smallest move wins. Levers that can't reach the goal show the closest result.
- Claude (when the viewer allows it) only reads the goal sentence into the band and excluded levers, and proposes up to three combinations; each combination is re-run through the engine and labelled meets / short of the goal. Claude never supplies a dollar result.
- Every option prints what it would need to be supportable (best-interests time-sharing, evidence of income, § 61.30(2)(b) imputation findings, § 61.08 need and ability, § 61.30(7) child care, § 61.13(1)(b) 5% premium, § 61.30(1)(a)/(11) deviation findings) — statutory references, attorney verify.

## ED tax-effected view (v3.1)
- Pre-tax items (retirement by default) are multiplied by (1 − t) and the chart is recomputed; the equalizer is shown beside the charted one. Gross-up if the payment is funded from a pre-tax account = tax-effected payment ÷ (1 − t). Discussion only — the chart and exports are not changed.

## ED import matching (v3.1)
- Each extracted row is matched to an inventory item of the same kind (asset/debt): same last four digits +0.7 (different last four = no match), same category +0.2 (same chart group +0.08), name-token overlap up to +0.5; a score ≥ 0.55 proposes a merge. Petitioner FA → valP, Respondent FA → valR, disclosure → valDoc. New items come in as alloc "undecided", title "NC".
