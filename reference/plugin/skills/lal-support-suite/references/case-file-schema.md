# Case file schema — LAL Support Suite v3.1

The app reads and writes one JSON file: `{"app":"LAL Support Suite","v":3,"savedAt":"…","state":{…}}`. **Open .json…** accepts the wrapper or the bare `state`. Missing keys are filled with defaults on open, so a partial file is fine. Older v2 files (child support only) open unchanged.

Conventions: money is a string of digits (`"6500"`, `"1234.56"`, no `$` or commas needed); dates are `YYYY-MM-DD`; `A` = Petitioner, `B` = Respondent; on ED items `P` / `R` mean the same parties.

## Top-level keys

| Key | What it holds |
|---|---|
| `meta` | caseName, caseNo, court, matterType (litigation · mediation · diy — sets the draft banner), **caseType** (dissolution · paternity · modification · support · other — drives FA Column B/C), firmName, preparedBy, date (assessment date), purpose, deidentify (true = tokens on exports), **client** (A · B · "" — our client; drives the Clients list name and the overview strip), **issues** {cs, ts, al, ed, fa, mod, retro, fees, other: true/false}, issuesOther, issuesNote (where the case stands), judge, oc (opposing counsel) |
| `parties.A` / `parties.B` | name, filing (single · hoh · mfj · mfs), wages[] {desc, amount, period: monthly · semimonthly · biweekly · weekly · annual · hourly40}, selfEmployed, seIncome, k1Income, qbi, other[] {desc, amount, taxable, **faLine** "4"–"16"}, ssBenefits, derivOwn, priorAlimonyReceived/Taxable, healthTotal/healthChild, dentalTotal/Child, visionTotal/Child, unionDues, mandRetire, csPaidOther, priorAlimonyPaid/Deductible, stateTax, pretax, otherFedDeductions, otherCredits, otherCtcKids, otherOdc, grossOverride, netOverride, fedTaxOverride, source, eitc, eitcChildless |
| `children[]` | name (initials), dob, hsGrad, taxDep (A · B · none), ovA, ovB (annual overnights), qualifies |
| `csMethod` | average · split |
| `costs` | careA, careB, medA, medB, campAnnual, campPayer, campInclude, careNote |
| `alimony` | manual / ordered alimony: amount, period, payer, taxable, start, end |
| `aa` | alimony calculator: enabled, linkCS, useAmt (cap · need · custom), customAmt, dom, filed, requesting, expA{}, expB{} (household, auto, children, childIns, otherKids, insurance, other, creditors), adultChild, savings, includeCS, shortTermMonths, rehabPlan, rehabMonths, bridgeMonths, notes, **whatif[]** {name, years, netReq, netPay, expReq} |
| `deviation`, `mod`, `checks`, `memo`, `taxOverrides` | child support deviation, existing order, review checklist, memo notes |
| `scenarios[]` | {id, name, ovNon (non-majority parent's nights), wagesA, wagesB (monthly gross — replaces wage, SE and K-1 income), alimony, alimonyPayer, careA, careB, insChildA, insChildB (children's health/dental/vision premium), dev (deviation, monthly, negative lowers support), taxDep (entered · A · B · alt), note, **pinned** (true = own tab under Child support)} — blank = keep the case value |
| `sdScen` | scenario id the Step-down page and step-down PDF use (`current` = case inputs) |
| `goal` | goal planner: text (last goal typed), ai (false = built-in reader only). Results are recomputed, never stored |
| `ed` | items[] (below), valDate, valBasis (filing · separation · trial · agreed · other), saleCost (%), homeId, proposals[] {id, name, ov{itemId:{alloc,pctP}}}, boardMode (mediation · client), clientSide, boardScen, showExtra, missing, issues, **taxPct** (assumed tax rate for the tax-effected view), **docs[]** {id, role (faP · faR · md · case), mdType (bank · brokerage · retirement · mortgage · loan · card · deed · appraisal · vehicle · business · tax · other), label, fileName, url, kind (file · link), addedAt, importedAt, imported} — the document register; file contents are never stored |
| `fa` | party (A · B), circuit, county, division, cswFiled (yes · no), draftMark, preparer, p.A / p.B (below) |

## ED item

```json
{
 "id": "\u2026",
 "cat": "checking",
 "name": "",
 "last4": "",
 "title": "NC",
 "listedP": "Yes",
 "listedR": "Yes",
 "disc": "No",
 "valP": "",
 "valR": "",
 "valDoc": "",
 "basis": "auto",
 "custom": "",
 "nm": "",
 "nmTo": "",
 "undetermined": false,
 "alloc": "split",
 "pctP": "50",
 "source": "",
 "notes": "",
 "contingent": false,
 "securedBy": "",
 "appraisal": false,
 "valuation": false,
 "premarital": false,
 "pmt": "",
 "pmtBy": "",
 "pretax": true
}
```

| Field | Values |
|---|---|
| `cat` | home, realOther, cash, checking, savings, digital, crypto, nft, brokerage, retirement, vehicle, boat, othervehicle, business, furniture, furnitureElse, collect, jewelry, lifeins, equip, tools, firearms, note, owed, judgmentOwed, ip, otherAsset · debts: mortgage, autoloan, card, student, medical, bankloan, tax, noteOwe, oweNoNote, judgmentAgainst, otherDebt |
| `title` | NC (not confirmed) · P · R · J · JTBE · JL (joint lease) · POS (in possession) — from the deed / statement only |
| `valP` `valR` `valDoc` | Petitioner FA, Respondent FA, document figure (positive numbers, debts too) |
| `basis` | auto (document, then agreeing FAs, then average of conflicting FAs — flagged) · doc · P · R · avg · custom (uses `custom`) |
| `nm`, `nmTo` | nonmarital portion and who claims it (P · R) — attorney's call |
| `undetermined` | true = marital character not determined; kept out of totals |
| `alloc`, `pctP` | split · P · R · pct (uses pctP) · undecided (kept out of totals) |
| `contingent` | true = FA Section D; kept out of ED totals |
| `securedBy` | mortgage → id of the property it secures |
| `appraisal`, `valuation`, `premarital` | flags for real property, business, retirement |
| `pretax` | true = pre-tax dollars in the tax-effected view (default: retirement accounts) |
| `pmt`, `pmtBy` | monthly payment and who pays (P · R · J) — feeds FA creditor lines 106–118 (mortgage and auto loans excluded; they belong on lines 1 and 33) |

## FA party block (`fa.p.A` / `fa.p.B`)

fullName, age, occupation, status (employed · unemployed · retired · selfemployed), employer, empAddr, empCity, empPhone, payRate, payFreq, changeNote, multiJob, retDate, retEmployer, unempNote, lastYear, lastYearMine, lastYearOther, bonusPortion (moves that much of wages to line 2), ssLine ("8" or "4"), **ov** {line: amount} overrides for lines 1–25, **exp** {line: amount} Section II lines 1–104, **lbl** {line: text} descriptions for "other" lines, **est** {line: true} prints "estimate", cred[] {name, amt} lines 106–118, households, autos, kidsOther, signCounty.

## Blank file (every default)

```json
{
 "app": "LAL Support Suite",
 "v": 3,
 "state": {
  "v": 2,
  "csMethod": "average",
  "mod": {
   "existing": "",
   "existingPayer": "",
   "orderDate": ""
  },
  "meta": {
   "caseName": "",
   "caseNo": "",
   "court": "",
   "matterType": "litigation",
   "preparedBy": "",
   "date": "2026-10-22",
   "purpose": "",
   "deidentify": false,
   "label": "",
   "caseType": "dissolution",
   "firmName": "",
   "client": "",
   "issues": {},
   "issuesOther": "",
   "issuesNote": "",
   "judge": "",
   "oc": ""
  },
  "parties": {
   "A": {
    "name": "",
    "filing": "single",
    "wages": [
     {
      "desc": "Primary employer",
      "amount": "",
      "period": "monthly"
     }
    ],
    "selfEmployed": false,
    "seIncome": "",
    "k1Income": "",
    "qbi": true,
    "other": [],
    "ssBenefits": "",
    "derivOwn": "",
    "priorAlimonyReceived": "",
    "priorAlimonyTaxable": false,
    "healthTotal": "",
    "healthChild": "",
    "dentalTotal": "",
    "dentalChild": "",
    "visionTotal": "",
    "visionChild": "",
    "unionDues": "",
    "mandRetire": "",
    "csPaidOther": "",
    "priorAlimonyPaid": "",
    "priorAlimonyPaidDeductible": false,
    "stateTax": "",
    "pretax": "",
    "otherFedDeductions": "",
    "otherCredits": "",
    "otherCtcKids": "",
    "otherOdc": "",
    "grossOverride": "",
    "netOverride": "",
    "fedTaxOverride": "",
    "source": "",
    "incomeNote": "",
    "eitc": true,
    "eitcChildless": false
   },
   "B": {
    "name": "",
    "filing": "single",
    "wages": [
     {
      "desc": "Primary employer",
      "amount": "",
      "period": "monthly"
     }
    ],
    "selfEmployed": false,
    "seIncome": "",
    "k1Income": "",
    "qbi": true,
    "other": [],
    "ssBenefits": "",
    "derivOwn": "",
    "priorAlimonyReceived": "",
    "priorAlimonyTaxable": false,
    "healthTotal": "",
    "healthChild": "",
    "dentalTotal": "",
    "dentalChild": "",
    "visionTotal": "",
    "visionChild": "",
    "unionDues": "",
    "mandRetire": "",
    "csPaidOther": "",
    "priorAlimonyPaid": "",
    "priorAlimonyPaidDeductible": false,
    "stateTax": "",
    "pretax": "",
    "otherFedDeductions": "",
    "otherCredits": "",
    "otherCtcKids": "",
    "otherOdc": "",
    "grossOverride": "",
    "netOverride": "",
    "fedTaxOverride": "",
    "source": "",
    "incomeNote": "",
    "eitc": true,
    "eitcChildless": false
   }
  },
  "children": [
   {
    "name": "",
    "dob": "",
    "hsGrad": "",
    "taxDep": "A",
    "ovA": "",
    "ovB": "",
    "qualifies": true
   }
  ],
  "costs": {
   "careA": "",
   "careB": "",
   "medA": "",
   "medB": "",
   "campAnnual": "",
   "campPayer": "A",
   "campInclude": false,
   "careNote": ""
  },
  "alimony": {
   "amount": "",
   "period": "monthly",
   "payer": "",
   "taxable": false,
   "start": "",
   "end": ""
  },
  "deviation": {
   "amount": "",
   "reason": "",
   "manual": "",
   "useManual": false
  },
  "scenarios": [],
  "activeWs": "current",
  "aa": {
   "enabled": false,
   "linkCS": true,
   "useAmt": "cap",
   "customAmt": "",
   "dom": "",
   "filed": "",
   "requesting": "A",
   "expA": {},
   "expB": {},
   "adultChild": "",
   "savings": "",
   "includeCS": true,
   "shortTermMonths": "",
   "rehabPlan": false,
   "rehabMonths": "",
   "bridgeMonths": "24",
   "notes": "",
   "whatif": []
  },
  "checks": {},
  "memo": {
   "notes": "",
   "openItems": "",
   "retroStart": "",
   "retroMonths": "",
   "retroPaid": "",
   "incWs": true,
   "incScen": false
  },
  "taxOverrides": {
   "povertySingleMonthly": 1330
  },
  "ed": {
   "items": [],
   "valDate": "",
   "valBasis": "filing",
   "saleCost": "",
   "homeId": "",
   "proposals": [],
   "boardMode": "mediation",
   "clientSide": "A",
   "boardScen": "current",
   "showExtra": true,
   "missing": "",
   "issues": "",
   "docs": [],
   "taxPct": ""
  },
  "sdScen": "current",
  "fa": {
   "party": "A",
   "circuit": "",
   "county": "",
   "division": "",
   "cswFiled": "yes",
   "draftMark": true,
   "preparer": "",
   "p": {
    "A": {
     "age": "",
     "occupation": "",
     "status": "employed",
     "employer": "",
     "empAddr": "",
     "empCity": "",
     "empPhone": "",
     "payRate": "",
     "payFreq": "",
     "changeNote": "",
     "multiJob": false,
     "retDate": "",
     "retEmployer": "",
     "unempNote": "",
     "lastYear": "",
     "lastYearMine": "",
     "lastYearOther": "",
     "bonusPortion": "",
     "ssLine": "8",
     "ov": {},
     "exp": {},
     "lbl": {},
     "est": {},
     "cred": [],
     "households": "",
     "autos": "",
     "kidsOther": "",
     "signCounty": "",
     "fullName": ""
    },
    "B": {
     "age": "",
     "occupation": "",
     "status": "employed",
     "employer": "",
     "empAddr": "",
     "empCity": "",
     "empPhone": "",
     "payRate": "",
     "payFreq": "",
     "changeNote": "",
     "multiJob": false,
     "retDate": "",
     "retEmployer": "",
     "unempNote": "",
     "lastYear": "",
     "lastYearMine": "",
     "lastYearOther": "",
     "bonusPortion": "",
     "ssLine": "8",
     "ov": {},
     "exp": {},
     "lbl": {},
     "est": {},
     "cred": [],
     "households": "",
     "autos": "",
     "kidsOther": "",
     "signCounty": "",
     "fullName": ""
    }
   }
  }
 }
}
```
