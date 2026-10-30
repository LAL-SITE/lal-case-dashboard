# Changelog

## v4.0.0-dev (2026-10-29)
Renamed from Laia Support App to **Laia Case Manager**. v4 build output is `dist/laia-case-manager.html`. The v3.3 reference files, fixtures and golden values keep the old name because they are snapshots. No calculation changed.

Golden harness (`tests/check-reference.js`) now checks every value in `tests/expected` — 136 checks instead of 16 — with the clock pinned to the capture date and script errors counted as failures. All pass on v3.3. No golden value changed.

## v3.3 (2026-10-29) — reference for v4
Product guide first; Client disco / OP disco with Scan & update, assessments and firm-format certificate of compliance; Retro tab with charts & summaries by period; Boards tab (mediation, hearing, trial prep) with Generate now; slim header and File menu; Jump to removed; Section II filled-lines view; field help as ⓘ.

Any change to a golden value is logged here with the reason and Leisa's approval date.
