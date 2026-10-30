# Laia Case Manager v4 — proposed structure and engine API

Status: **proposal for Leisa and Henry. No v4 code is written yet.** This answers the kit's first prompt: read CLAUDE.md, SPEC and REVIEW, run `npm run test:reference`, then propose the folder structure and engine module API before writing code.

## 1. What v3.3 looks like inside (measured 2026-10-29)

- `npm run test:reference` now checks **every** value in `tests/expected` (136 checks, up from 16): child support, payer, net and gross income, overnights, alimony used, each scenario's amount, name and payer, the full ED breakdown, the discovery gap count, the certificate-of-compliance marker for each of the 18 items on both sides, and zero script errors. All 136 pass on v3.3 (step 1 of section 4, done 2026-10-30).
- The certificate markers were captured after **Scan & update**, which loads a built-in demo folder list for the two demo case numbers. That list is not in the fixtures, so the harness runs the scan before reading the markers. In v4 the demo folder list belongs in the fixtures (or the demo build), not hard-coded beside the scanner.
- The app is one 724 KB HTML file with 22 inline scripts and 4 libraries loaded from cdnjs at run time (jsPDF, jspdf-autotable, JSZip, SheetJS). pdf.js is loaded on demand.
- The main script (sc04, 399 KB) defines 403 functions. 12 of them are defined twice (`render`, `stepDown`, `renderNav`, `saveLocal` …). In each case the later definition wins. Later layers also replace functions by assignment (for example, v3.2's scenario levers replace `scenState`).
- **The math already has no DOM code.** `schedule`, `bracketTax`, `partyIncome`, `overnightsFor`, `calculate`, `scenState`, `effState`, `edVal`, `edRow`, `edCompute`, `alimonyAssess`, `stepDown`, `modTest`, `solveLever` and `solveGoal` never touch the page. The work is to take them out of global scope:
  - `edCompute`, `alimonyAssess`, `stepDown`, `modTest`, `linkedAlimony`, `gaps` and `retroModel` read the globals `S` (case), `R` (current result) or `EDC` (cached ED result) instead of taking arguments.
  - The certificate-of-compliance markers (`autoMarker` in the v3.3b layer) live inside a closure, reachable only through `window.DISCO`.
- **Date dependence.** The disco coverage flags ("4 of 6 months" on pay stubs and statements, 3 years of returns) and the retro "through" default use `new Date()`, so they change from day to day. The gap count and the certificate markers do not (checked by moving the clock to 2027). v4 passes an `asOf` date in; the harness already pins the browser clock to the capture date, 2026-10-29.

## 2. Folder structure

```
src/
  engine/                  pure functions, no DOM, no globals, runs in Node and the browser
    index.js               public API (section 3)
    tables/                data copied verbatim from v3.3, each with a "source: v3.3 sc04" note
      fl-schedule.js       SCHED_RAW, OVER10K
      tax-2026.js          TAX2026
      fl-min-wage.js       FL_MIN_WAGE
    childSupport/          schedule, tax, income, overnights, calculate, scenarios, stepDown, modification, goal
    alimony/               assess, options, link (alimony ↔ child support)
    ed/                    value, row, compute, scenarios, taxView
    fa/                    model (12.902(c) lines from the case file)
    disco/                 items (the 18 Rule 12.285 items), coverage, gaps, coc markers
    retro/                 model, periods
    util/                  num, round2, dates (all date math takes asOf)
  schema/
    v4.js                  case-file shape, version 4
    blank.js               blank case, blank party, blank ED item
    upgrade.js             v3 {app, v, state} → v4; accepts "Laia Support App" and "Laia Case Manager"
  ui/                      Preact components; the 7 tabs from REVIEW (Clients, Overview, Support,
                           Affidavit, Property, Discovery, Drafting); grids for FA Section II and ED inventory
  docs/                    one document engine: templates per format master, central caption,
                           naming and DRAFT footer
  editions/                Basic / Pro / Premium / Ultra / Demo flags and the demo lock
build/
  build.js                 esbuild → inline all JS, CSS and libraries → dist/laia-case-manager.html
tests/
  engine/                  Node tests that call src/engine directly (fast, no browser)
  parity/                  v3.3 vs. v4 engine, whole result objects, both fixtures
  check-reference.js       existing HTML harness (kept, extended)
  render-check.js          1440×900 and 390×844, light and dark, console errors
```

## 3. Engine API

Everything takes the case file as an argument and returns plain objects. Nothing reads or writes globals.

```js
import * as engine from './src/engine/index.js';

const opts = { asOf: '2026-10-29' };              // required for anything date-dependent
const r = engine.computeCase(caseFile, opts);     // one call for screens, demo and skills
r.childSupport   // { final, payer, payee, shared, A:{gross, net, …}, B:{…}, ovA, ovB, sch, … } — same fields as v3.3 R
r.scenarios      // [{ id, name, result }]
r.alimony        // { need, ability, cap, duration, … } (v3.3 alimonyAssess)
r.ed             // { rows, netP, netR, estate, target, eq, payer, amt, afterP, afterR, unconfirmed, … }
r.retro          // { rows, total, owed, months, … }
r.disco          // { gaps: [...], coc: { ours: [[id, marker]…], opp: [...] } }

// Granular calls (same math, used by the goal planner, boards and drafting)
engine.childSupport.calculate(caseFile)               // v3.3 calculate(effState(state))
engine.childSupport.forScenario(caseFile, scenario)   // v3.3 calcFor(sc)
engine.childSupport.stepDown(caseFile, opts)
engine.childSupport.modification(caseFile)
engine.childSupport.solveGoal(caseFile, goal)         // goal planner levers, re-run through the engine
engine.alimony.assess(caseFile)
engine.ed.compute(caseFile, overrides)                // overrides = quick scenarios (keeps home, sell, QDRO …)
engine.disco.gaps(caseFile, edResult)
engine.disco.cocMarkers(caseFile, party, opts)        // three markers only: Produced / Will Be Produced / Not Applicable
engine.retro.model(caseFile, childSupportResult, opts)
engine.schema.upgrade(anyJson)                        // never throws on a v3 file
```

Claude skills (lal-support-suite) and the Tennessee build import the same `src/engine`.

## 4. How we get there without moving a number

1. **Extend the golden harness first.** *Done 2026-10-30:* every value in `tests/expected` is checked (136), clock pinned to 2026-10-29, script errors fail the run, and a one-cent change to a golden value fails it. No golden file changed.
2. **Extract verbatim.** Copy the final effective definition of each engine function (after all 19 layers) into `src/engine`, unchanged, then replace `S`/`R`/`EDC` reads with parameters.
3. **Parity test.** For each fixture, run v3.3 in Playwright and v4's engine in Node, and deep-compare the whole result objects, not just the headline numbers. Gate: zero differences.
4. **Only then refactor** (names, structure), with the parity test as the safety net.
5. Schema and upgrade: open both fixtures through `upgrade.js`, then compute and compare.
6. Screens (REVIEW phase 4) start after the gate passes.

## 5. Decisions needed

| # | Decision | Recommendation |
| --- | --- | --- |
| 1 | UI library | **Preact** (4 KB, JSX, updates only what changed). Svelte also works but needs a compiler step and is less familiar. |
| 2 | Build tool | **esbuild**: one dependency, inlines everything into one HTML file. |
| 3 | Libraries | Bundle jsPDF, autotable, JSZip, SheetJS and pdf.js from npm at pinned versions. No run-time CDN. |
| 4 | Single HTML vs. hosted (REVIEW's open decision) | Single HTML synced through the firm's storage. It keeps the privacy promise. |
| 5 | Repository visibility | This repo is **public**, so the licensed v3.3 app and its source can be read by anyone. The kit recommended a private repo. |
| 6 | Golden set size | Two fictional cases. REVIEW asks for 40–50 anonymized real worksheets before the engine gate means much; see `tests/real-worksheets/README.md`. |

No legal content was added in this plan. Every statute-driven number stays exactly as v3.3 has it; the SPEC already flags those for attorney verification.
