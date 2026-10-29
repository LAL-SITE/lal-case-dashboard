# Laia Case Manager — v4 build kit

Start here. This folder is the starting repository for rebuilding the Laia Case Manager (formerly the Laia Support App) in Claude Code.

## What's inside

- `CLAUDE.md` — the rules Claude Code follows in this repo (firm non-negotiables + engineering rules). Read first.
- `docs/SPEC.md` — every tab and section as built in v3.3, with tiers and calculation notes. This is the behavior to keep.
- `docs/REVIEW.md` — the UX and engineering review and the v4 plan, in order, with gates.
- `docs/FORMAT-MASTERS.md` — which firm format master each output must match, and where it lives.
- `reference/current/` — the running v3.3 app, the v3.3 demo edition, and the v3.2 base the layers sit on.
- `reference/layers/` — the v3.3 source layers (disco/assessments/retro, disco scan + COC + boards, slim header, demo lock), readable on their own.
- `reference/plugin/` — the lal-support-suite Claude plugin (v3.1.0): SKILL.md, case-file schema, calculation basis, ED chart format, FA 12.902(c) line map. Useful source for the v4 schema and engine notes.
- `tests/fixtures/` — the two demo case files (fictional).
- `tests/expected/` — golden values captured from v3.3. `npm run test:reference` proves the reference still matches; `npm test` runs the same checks against the v4 build.
- `tests/real-worksheets/` — put anonymized real cases here (see the README inside).

## How to start in Claude Code

1. This repository (`LAL-SITE/lal-case-dashboard`) now holds the kit; it replaced the earlier FMLG Case Command Center demo.
2. Open it in Claude Code. First prompt: "Read CLAUDE.md, docs/SPEC.md and docs/REVIEW.md. Run npm run test:reference. Then propose the v4 folder structure and the engine module API before writing code."
3. Work phase by phase from `docs/REVIEW.md`. Do not start screens until the engine reproduces every golden case.
4. When a build passes, bring `dist/laia-case-manager.html` back to the claude.ai workspace to publish it to the existing app link and to rebuild the tiiny demo.

Working calculations and drafts for attorney review. Not legal advice; nothing is cleared for filing.
