# CLAUDE.md — batch-platform

Two products live here: **the Batch shop platform** (React/Vite/TS/Tailwind + Supabase + R2, the current site) and **MUTHR** (also written "mother") — the ingest-everything personal artifact system being designed and built in `docs/mother/` and, progressively, in this codebase. Assume MUTHR work unless the task says otherwise.

## Doc map (read before designing; link instead of restating)

| Doc | Canonical for |
|---|---|
| `docs/mother/detail-card-system.md` | **The framework.** 8 fixed zones, fixed Intelligence-tab vocabulary, verdict facts, six verbs, boost ladder L0–L4, 19-family taxonomy, consistency rules, data-model sketch |
| `docs/mother/detail-cards-wave2.md` | Deep specs: video, 3D, gcode, decks, text docs + six cross-family patterns |
| `docs/mother/detail-card-research.md` | Wave-1 verified research (what incumbents do, with confidence labels) |
| `docs/mother/muthr-capability-gaps.md` | The build list: capability spine, ten platform gaps G1–G10 |
| `docs/mother/muthr-feasibility.md` | **Build-vs-buy, verified.** Lanes (browser/box/metered), per-feature matrix, licenses, prices, traps |
| `docs/mother/prototypes/detail-cards.html` | The visual prototype — 11 cards; canonical UI idiom. Artifact: `https://claude.ai/code/artifact/9ceb597a-e623-4b8d-b962-9a60bc776dd7` (pass as `url` to republish) |
| `docs/process/ways-of-working.md` | Model-cascade operating model, routing rubric, escalation rules |
| `docs/specs/` | Work packages. Execute against these; status header tracks state |
| `docs/mother/fable-queue.md` | Judgment items awaiting a frontier session — **append, don't guess** |

## Operating model (short version)

Articulate (Fable) → Scope (`/scope`) → Produce (Opus/Sonnet against specs) → Verify (habits below) → Review (Fable audits the diff + queue). If a task needs judgment you weren't given — cross-family ripple, naming, policy — add it to the fable-queue with context and build up to that boundary. Three failed rounds on one bug → write down state, stop, escalate.

## Hard rules (from the framework — violating these is drift, not style)

1. Card zones Z1–Z8 never reorder; absent modules collapse, nothing moves.
2. Intelligence tabs come from the fixed vocabulary only (Transcript · Summary · Text · Items · Entities · Schema · Dependencies · Changes).
3. Facts: 4–6 per card, one slot is a **verdict** (✓/⚠ computed against a registry).
4. **Manipulations mint, never mutate** — new version + `derived_from(op, params, tool)`; originals immutable.
5. Machine voice is legible: ✦ AI captions, dotted auto-tags, suggestions carry **receipts** and explicit Accept/Dismiss; nothing auto-creates externally.
6. Collapsed ≠ unindexed: anything demoted to All-metadata stays searchable.
7. Render honestly at every boost level — never promise a tab processing hasn't produced.
8. Privacy lanes in order: **browser → studio box → metered API**; metered is gated by per-source boost rules and cost-logged in activity.
9. Proprietary natives (`.key/.pages/.f3d/.sldprt`): embedded preview + best-effort text + open-in-app + Mac-hand export. Never promise server-side rendering.

## Design system

- Tokens: bg `#221f1d` · ink `#efede6` (LINEN) · secondary `#68625c` (DIM) · bronze `#cc5803` · chocolate `#e2711d` · saffron `#ff9505` · mint `#87E9B1` · hairlines `1px dashed rgba(239,237,230,0.08)`.
- Idiom: bento grid of `GridBlock`s, tiny uppercase tracking labels, huge light stats (`Inter` 300, tight letter-spacing), primary action = bronze block button (hover saffron), ghost dashed secondaries.
- **Categorical/series colors (validated CVD-safe on the dark surface): `#e2711d / #3fa46e / #5e8fc7`** — don't invent new series colors without running the dataviz palette validator. On light "paper" surfaces (`#eae7de`), use darkened authors `#a34d0e / #38648f`.
- New chart/visualization → load the `dataviz` skill first; new artifact page → `artifact-design` skill first.

## Verification habits (every UI change)

Playwright with `executablePath: '/opt/pw-browsers/chromium'` → screenshot the affected section · `document.documentElement.scrollWidth - clientWidth === 0` at **390px** · zero console errors · known trap: `aspect-ratio` boxes inside grid tracks need `minmax(0, 1fr)`. Logic → unit tests with committed fixtures (`src/fixtures/`). Never mark done without running the check you claimed.

## Engineering conventions

- Stack: React 18 + Vite + TS + Tailwind; theme constants in `src/lib/theme.ts`; Supabase types in `src/types/`.
- Heavy browser libs (pdf.js, DuckDB-WASM, transformers.js, gcode-preview) are **lazy-loaded per family** and **self-hosted** (privacy posture; no CDN model fetches — `allowRemoteModels=false`).
- Parse defensively; extractors return partial results + `errors[]`, never throw the card away.
- Commit + push before ending any session (ephemeral environments); branch per the session's instructions.

## Skills in this repo

- `/new-family <type>` — full exercise for a new filetype: research → spec → docs → prototype card → artifact republish.
- `/scope <thing>` — turn articulated design into spec-ready work packages in `docs/specs/`.
