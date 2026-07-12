# SPEC-001 · G-code card, browser lane

| | |
|---|---|
| **Status** | spec-ready |
| **Tier** | Sonnet (parser, facts, diff) + Opus (viewer integration) |
| **Lane** | 🅐 browser |
| **Depends on** | — (first real card; may stub persistence with local state) |
| **Framework refs** | detail-card-system.md §5.14, §3 (verdict facts) · detail-cards-wave2.md §3 · muthr-feasibility.md §2 gcode |

## Outcome
Drop a `.gcode` (or `.gcode.3mf`) file onto MUTHR and get the full detail card — facts, embedded thumbnail, compatibility verdict, settings, cost — computed entirely client-side, plus the interactive layer viewer.

## Context
G-code is the highest-value/lowest-infrastructure card: all metadata lives in head/tail comments, thumbnails are embedded base64, and the studio reuses gcode for production runs. The prototype (`docs/mother/prototypes/detail-cards.html` §09) defines the target UI exactly.

## In scope
- `parseGcodeMeta(file)`: reads first+last 64KB via `File.slice` (never the whole file); dialect detection + extraction for **PrusaSlicer-family** (`; key = value` footer, `; estimated printing time`, filament mm/g) and **Bambu** (`HEADER_BLOCK`/`CONFIG_BLOCK`); Cura `;TIME:`/`;MINX…` as best-effort. Reference parsers: Moonraker `metadata.py`, `prusa3d/gcode-metadata` (port logic, don't depend).
- Embedded thumbnail extraction (`; thumbnail begin … end`, base64 PNG; QOI variant detected → skip with note).
- `.gcode.3mf` unwrap via fflate: plate gcode + `Metadata/plate_*.png`.
- Facts row per framework: est. time (slicer) · filament g + $ (price table constant for now) · layer height · layers · temps · sliced-with.
- **Compatibility verdict** against a hardcoded printer registry module (JSON: model, bed AABB, nozzle, materials) — ✓/⚠ chip + per-check strip as in the prototype.
- Settings tab: parsed config as key/value list; settings **diff** view given two artifacts.
- Layer viewer: `gcode-preview` (MIT) integration with layer slider; lazy-load the lib; cap parsed moves for files >30MB (decimate or layer-cap) pending SPEC-level perf test.

## Out of scope
- Persistence/schema (SPEC-004), send-to-printer (needs box, later spec), re-estimation (klipper_estimator is 🅑), laser/CNC dialects (detect → show honest fallback note).

## Implementation notes
React + TS in this repo's stack; follow the prototype's visual idiom (GridBlock, stat blocks, tags). gcode-preview: prototype at 50–100MB **before** promising smooth — feasibility flagged this; fallback = embedded thumbnail + facts only above a size threshold, with a "render anyway" button.

## Acceptance checks
- [ ] A PrusaSlicer MK4 PETG file shows: correct time, filament g, layer height, temps, printer model, thumbnail — without reading >200KB from disk.
- [ ] A Bambu `.gcode.3mf` shows plate PNG + parsed CONFIG_BLOCK values.
- [ ] Registry mismatch (0.6 nozzle file vs 0.4 printer) renders ⚠ verdict naming the failing check.
- [ ] Settings diff of two slices of the same model lists changed keys only.
- [ ] 80MB file: card interactive in <2s (facts+thumb); viewer loads lazily or degrades honestly.

## Verification steps
- [ ] Playwright screenshot of the card with a real fixture · 390px overflow = 0 · no console errors · unit tests for each dialect parser with fixture headers (commit small fixture files under `src/fixtures/gcode/`).

## Notes for the builder
Never strip/modify Bambu header blocks in any output. Time strings vary (`1d 2h 3m 4s`, `2h 3m 4s`) — normalize to seconds. `File.slice` end-read: `file.slice(file.size - 65536)`.
