# SPEC-002 · Dataset card on DuckDB-WASM

| | |
|---|---|
| **Status** | spec-ready |
| **Tier** | Opus (DuckDB integration) + Sonnet (UI polish) |
| **Lane** | 🅐 browser |
| **Depends on** | — |
| **Framework refs** | detail-card-system.md §5.10 · muthr-feasibility.md §2 dataset · prototype §05 |

## Outcome
Drop a CSV/Parquet (or xlsx) onto MUTHR and get the dataset card: typed sample grid, per-column mini-stats/histograms, headline facts, and a working SQL console — all computed on-device; the data never leaves the browser.

## Context
DuckDB-WASM (MIT, ~8MB compressed, cached) was verified as the standout browser capability. `SUMMARIZE` gives column stats in one statement. The prototype's dataset card defines the UI.

## In scope
- DuckDB-WASM (single-thread config — no COOP/COEP needed) with file registration from a dropped File handle; lazy init on first dataset artifact.
- Facts: rows × cols · completeness % · size · encoding/dialect · one domain stat (numeric column sum) when inferable.
- Column headers: inferred type chip + mini histogram (numeric: equi-width bins via SQL; categorical: top-5 bar; dates: min→max). Follow the dataviz idioms already in the prototype (thin marks, validated colors).
- Virtualized sample grid (first 200 rows).
- SQL console: textarea → `conn.query`, results grid, error surface; canned example queries per the prototype.
- xlsx path: exceljs (MIT) → first sheet → DuckDB table (styles ignored, noted in UI).
- NL→SQL stub: interface + prompt template that sends **schema + 5 sample rows only** (never data) to the LLM layer; behind a flag until SPEC-006 lands.

## Out of scope
- Persistence, saved queries, charts beyond header minis ("Quick chart" is a later spec), Parquet-over-HTTP remote files.

## Acceptance checks
- [ ] 1,284-row orders CSV: grid + stats render <1.5s after engine warm; null % and top-values match a pandas cross-check on the fixture.
- [ ] 500MB CSV either works or degrades with an honest message (test; wasm32 memory ceiling ~4GB, limited out-of-core — feasibility note).
- [ ] Malformed CSV (ragged rows) surfaces DuckDB's error readably, card still shows facts it could compute.
- [ ] `SUMMARIZE`-derived stats power the header minis (no hand-rolled scans).

## Verification steps
- [ ] Screenshot vs prototype card · 390px overflow 0 (grid scrolls inside its container) · palette validator if any new chart colors · no console errors.

## Notes for the builder
Bundle: import `@duckdb/duckdb-wasm` with the jsdelivr bundle selector but **self-host the wasm assets** (privacy posture; CSP). Type inference: trust DuckDB's sniffer, expose delimiter override in a small menu.
