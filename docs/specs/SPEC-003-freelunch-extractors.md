# SPEC-003 · Free-lunch extractors (embedded metadata, browser)

| | |
|---|---|
| **Status** | spec-ready |
| **Tier** | Sonnet |
| **Lane** | 🅐 browser |
| **Depends on** | — (pure functions; SPEC-004 will persist their output later) |
| **Framework refs** | muthr-capability-gaps.md G7 · detail-cards-wave2.md "free lunch" pattern · muthr-feasibility.md matrix |

## Outcome
A single `extractEmbedded(file) → { kind, facts, previews[], settings? , textBestEffort? }` module that pulls everything files already carry — before any server or ML exists.

## Context
Verification confirmed the free-lunch layer as the highest-ROI code in the system: previews and settings ship *inside* the files. This module feeds every card's L1 state.

## In scope (one extractor per bullet, all client-side)
- **Images**: exifr (MIT) — EXIF/GPS/orientation/thumbnail; canvas palette (5 swatches, ~30-line quantizer).
- **Audio**: music-metadata (browser) — ID3/Vorbis tags + cover art.
- **3MF**: fflate unwrap — project + `plate_*.png` previews, `Metadata/*.config` (JSON/XML → settings object), plate count. Parse defensively (Bambu/Prusa extensions vary).
- **pptx/docx**: fflate — core properties, slide/paragraph text + speaker notes (own OOXML walk, not a heavyweight lib), `*/media/*` inventory (count + first image as preview), fonts referenced.
- **`.pages`/`.key`**: fflate — bundled `preview*.jpg` / `QuickLook/Preview.pdf` harvest + honest `unsupported: true` flag for content.
- **PDF**: pdf.js — page 1 render to thumbnail, outline, page count, text of first N pages.
- **SVG**: XML parse — viewBox, path/point counts, colors, fonts.
- **G-code**: re-export SPEC-001's parser through this interface.
- Format sniffing entry point: magic bytes (`file-type` or a small own table) — **never trust extensions**.

## Out of scope
- Anything requiring decode of video/audio streams (probe is SPEC-005 territory beyond mediainfo facts), OCR, ML, persistence.

## Acceptance checks
- [ ] One fixture per format under `src/fixtures/` returns a populated result in <500ms each (except PDF render, <2s).
- [ ] A Bambu project 3MF yields plate PNG + layer_height + filament type from settings.
- [ ] A `.pages` file yields its preview image and `unsupported: true` — never a throw.
- [ ] Renamed file (docx→.zip) still routes correctly via magic bytes.

## Verification steps
- [ ] Unit tests per extractor with fixtures · bundle-size check: heavy libs (pdf.js) lazy-loaded per family, core module <50KB.

## Notes for the builder
Return shape is the contract — SPEC-004 persists it as `meta` + renditions. Keep every extractor throw-safe: `{ errors: [] }` per file, partial results always returned (framework rule: honest at every level).
