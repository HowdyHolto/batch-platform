# MUTHR — capability gap analysis

> What the system needs to be able to **extract**, **enrich**, **preview/play inline**, and **lightly manipulate** artifacts — per family and platform-wide.
> Companion to [`detail-card-system.md`](./detail-card-system.md) (the card framework) and [`detail-cards-wave2.md`](./detail-cards-wave2.md) (video · 3D · gcode · decks · text docs deep-dives).

---

## 1. Where MUTHR is today

Honest baseline: MUTHR exists as a design system and a data-model sketch. The repo today is the Batch platform shell — Supabase (profiles/posts/products/orders/events), R2 for media, a React front end. There is **no ingestion path, no processing worker, no renditions store, no ML layer, no viewer components**. So this isn't a "gaps in an existing pipeline" audit; it's the build list, named precisely so we can sequence it.

That's an advantage: we get to build the spine once, correctly, instead of retrofitting five bespoke pipelines.

## 2. The capability spine

Every family needs the same six stages. Families differ only in which *tools* fill each stage — this is the backend mirror of the card framework's "one skeleton, many organs."

| Stage | What it does | Output | Boost level |
|---|---|---|---|
| **1 · Identify** | sniff format (magic bytes + container inspection, never trust extension), map to family/subkind, pick pipeline | `family`, `subkind`, `meta.format` | L0 |
| **2 · Extract** | deterministic parsing — technical metadata, embedded assets (thumbnails hiding in gcode/3MF/ID3!), structure (headings, slides, layers, tracks, settings) | `meta` facts + extracted files | L1–L2 |
| **3 · Render** | derivatives for the card: thumbnails, hover-scrub sprites, GLB conversions, PDF renditions, HLS, waveforms | **renditions** (bytes in R2) | L1–L2 |
| **4 · Enrich** | ML passes: transcribe, diarize, OCR, summarize, entities, embeddings, classify, suggest | **enrichments** (JSON + vectors) | L2–L4 |
| **5 · Manipulate** | light transforms that mint *new versions/artifacts with lineage* — trim, convert, re-orient, extract-slide, accept-changes | new artifact + `derived_from` edge | on-demand |
| **6 · Act** | route outward: send-to-printer, open-in-app, export, share, write-through to calendar/tasks | side effects + activity log | on-demand |

Two load-bearing distinctions the schema must encode:

- **Renditions ≠ enrichments.** Renditions are *bytes* (a 480p proxy, a sprite sheet, a GLB) with their own storage keys and CDN paths; enrichments are *JSON/vectors*. The current sketch has `enrichments`; it needs a sibling `renditions` table: `(id, artifact_id, kind, format, storage_key, width, height, duration_ms, pages, bytes, status, tool, tool_version)`.
- **Manipulation mints, never mutates.** Originals are immutable. A trim, a unit-fix, an accept-all-changes produces a **new artifact version** carrying `derived_from (parent_id, op, params, tool, at)`. This single edge type also captures design lineage (`f3d → 3mf → gcode → print job`) — the same mechanism serves both provenance and undo.

## 3. Platform-wide gaps (the build list)

These ten unlock every family; none exist today.

### G1 · Ingestion front door
Upload (web/drag/mobile share sheet), watch folders, and integration pulls; content-hash on arrival (dedupe), size/type limits, quarantine for unknowns. *Everything else is downstream of this.*

### G2 · Job orchestration
A queue + worker fleet with retries, priorities, per-source boost rules ("always full-boost voice; never auto-transcribe music"). **Supabase Edge Functions cannot run this** — ffmpeg/OCCT/LibreOffice need real containers with CPU/RAM (and occasionally GPU). Realistic shape: Postgres-backed queue (pgmq or Graphile Worker — keeps state in the DB we already have) + container workers on Fly/Railway/ECS or a studio box. Every job writes to the activity log with a named machine actor (framework §3 Z8).

### G3 · The toolbelt (per-family worker images)
One container image per capability cluster, versioned, pinned:
- **media**: ffmpeg/ffprobe, MediaInfo, whisper-class ASR, PySceneDetect
- **docs**: LibreOffice headless, pandoc, mammoth/python-docx, python-pptx, pdfium
- **mesh/cad**: trimesh + manifold3d + Open CASCADE (via CadQuery/pythonocc), Blender headless, slicer CLIs (PrusaSlicer/Orca)
- **gcode**: parser (settings/thumbnail/object extraction), estimator
- **universal**: exiftool, libmagic, archive tools
Tool + version stamped on every rendition/enrichment (reproducibility + "re-run with better tool later").

### G4 · Renditions model + CDN conventions
The table above, plus naming conventions for multi-file renditions (HLS segment dirs, sprite sheets + their index JSON, tiled deck pages). Cards read *only* renditions/enrichments — never the original — for anything hot-path.

### G5 · Lineage & versions (`derived_from`)
The edge described in §2. Without it: no design→gcode→print traceability, no safe manipulation, no "which version did the client get." With it: the Record zone's version list and the maker chain fall out of one mechanism.

### G6 · ML inference layer
Buy first, own later: hosted ASR (Whisper-class via Groq/Deepgram/OpenAI) for transcription+diarization; Claude for summarize/entities/items/captions; an embedding service (text + CLIP/SigLIP image) into **pgvector** (fits the existing Supabase). Add a **cost meter per artifact per boost level** from day one — boost economics (framework §9.1) is unanswerable without metering.

### G7 · Embedded-metadata extractors — the free lunch
A disproportionate share of "intelligence" is already sitting *inside* the files, deterministic and free: EXIF/GPS, ID3+cover art, **gcode slicer-settings headers and base64-embedded preview thumbnails**, 3MF plate previews + print settings, docx/pptx core properties + speaker notes, PDF outlines. Rule: **exhaust embedded metadata at L1 before spending a single ML token at L3.** This layer is small, cheap, and should be first code written.

### G8 · Viewer/manipulator components (client)
The card hero components, one per family, from the same kit: video player with storyboard hover-scrub; `<model-viewer>`/three.js orbit stage; gcode layer-viewer; paged reader (PDF/deck); redline/clean doc toggle; grid+histogram dataset explorer (prototyped); waveform+transcript (prototyped). Each with its light-manipulation affordances (trim handles, orient gizmo, layer slider, slide picker) that call G2 jobs.

### G9 · Format registry + honest fallback
A single registry mapping signature → family/subkind → pipeline → card modules, with the `blob` fallback card and a visible "we don't parse `.xyz` yet" path (framework rule R8/§5.16). New format support = one registry row + toolbelt entry, not a project.

### G10 · Connectors (the studio's hands)
- **Printer farm**: Moonraker/OctoPrint APIs, Bambu (cloud/LAN) — send gcode, capture outcomes back onto the artifact (print history = the maker's lab notebook).
- **A Mac hand**: Keynote/Pages/Fusion-class proprietary formats can't be parsed server-side; a small macOS companion (or Shortcuts automation) that exports PDF/pptx/STEP on demand turns "unsupported" into "one round-trip."
- **Calendar/tasks write-through** for accepted Items (framework §9.2).

## 4. Per-family capability stacks

Legend: **E**xtract · **R**ender · En**rich** · **M**anipulate. Effort: S/M/L. ◇ = hosted-service shortcut exists.

### 4.1 Video

| Capability | Tooling | What it yields | Effort |
|---|---|---|---|
| **E** Probe | ffprobe/MediaInfo | container + per-stream codec/profile, HDR transfer (PQ/HLG detect), VFR detect (`r_frame_rate ≠ avg_frame_rate`), rotation matrix, chapters, iPhone GPS/creation time | S |
| **R** Poster + storyboard | ffmpeg + sprite tiler | poster (scene-filtered, not black), sprite sheet + WebVTT `#xywh` index for hover-scrub (Mux/YouTube mechanism), 2–4s muted webp hover loop | M |
| **R** Playable rendition | ffmpeg → H.264/AAC MP4 (+HLS) | the *browser-safe proxy* — mandatory because HEVC/DV originals won't play broadly; tone-map HDR→SDR | M ◇ (Cloudflare Stream $5/1k min stored + $1/1k delivered; Mux per-min) |
| **R** Waveform | bbc/audiowaveform | peaks JSON for the audio-track strip | S |
| **En** Transcribe+diarize | WhisperX (~70× realtime, 1 GPU) or hosted ASR | timestamped, word-aligned, speaker-labeled transcript | M ◇ |
| **En** Scenes/chapters | PySceneDetect (+topic pass on transcript) | scene boundaries → keyframes, chapter candidates | S |
| **En** Frame OCR | Tesseract/PaddleOCR on deduped keyframes | time-anchored on-screen text (screen recordings!) | M |
| **En** Visual embeddings | CLIP/SigLIP per scene → pgvector | "shots of the CNC" natural-language b-roll search | M ◇ |
| **M** Trim (fast/exact), rotate-fix, audio extract/normalize, speed, caption burn-in, GIF/webp excerpt, CFR-normalize | ffmpeg one-shots | new artifacts with `derived_from`; fast trim labeled *approximate* (keyframe snap) | S–M |

### 4.2 3D models (`model`)

| Capability | Tooling | What it yields | Effort |
|---|---|---|---|
| **E** Mesh analysis | trimesh (+ numpy only) | bbox/dimensions, volume, area, triangle & shell counts, watertight flag, unit guess (bbox magnitude), cross-sections | S |
| **E** 3MF unwrap | ZIP reader | project + per-plate thumbnails, full print settings JSON, embedded gcode — **free, no slicer needed** | S |
| **E** Proprietary peek | structured-storage readers | `.sldprt` embedded preview bitmap + metadata (no geometry); `.f3d` none offline (Autodesk APS cloud translates) | S / ◇ |
| **R** Normalize to GLB | trimesh export; STEP via cascadio → CadQuery → FreeCAD headless (OCCT ladder) | the one format web viewers want; tessellate coarse for thumbs, medium for viewer | M |
| **R** Headless thumbnails | F3D CLI (`--rendering-backend=egl`) — reads meshes **and** STEP; stl-thumb fallback; Blender headless for beauty/turntables | consistent ¾-view thumbnails, turntable MP4s | M |
| **R** Web LOD | Open3D quadric / fast-simplification + Draco/meshopt | decimated viewer GLB; original download-only | S |
| **En** Printability | manifold3d + trimesh ray/SDF sampling | manifold report, repairability, wall-thickness heuristic (weakest OSS spot — heuristic only) | M |
| **En** Auto-orient | Tweaker-3 | suggested print orientation (min support volume/surface) | S |
| **En** Real estimates | PrusaSlicer CLI (`--export-gcode --load profile`) | true time/filament per printer profile, read back from gcode comments | M |
| **En** Shape similarity | OpenShape-class point-cloud embeddings → pgvector | "find similar parts," text→shape search | L ◇ |
| **M** Orient/scale/unit-fix (×25.4), repair, decimate, split shells, section, convert (STEP→mesh one-way) | trimesh/manifold3d | minted versions with `derived_from` | S–M |

### 4.3 G-code (`gcode`)

| Capability | Tooling | What it yields | Effort |
|---|---|---|---|
| **E** Header/footer parse | head+tail ~64KB only; `prusa3d/gcode-metadata`, Moonraker `metadata.py` as reference | slicer+version, est. time, filament mm/g, layer height/count, temps, nozzle Ø, printer model, per-slicer dialects (Prusa `; key = value` footer · Bambu HEADER/CONFIG blocks · Cura `;TIME:`) | S |
| **E** Embedded thumbnail | base64 `; thumbnail begin` blocks (+QOI variant); Bambu: `plate_N.png` inside `.gcode.3mf` | list + card preview with zero rendering | S |
| **E** Object labels | `EXCLUDE_OBJECT_DEFINE` / `M486` markers | per-object geometry for exclude-object UX | S |
| **R** Toolpath viewer | `gcode-preview` (three.js) client-side; feature coloring from `;TYPE:` comments; decimate/cap layers >100MB | the layer-slider hero | M |
| **En** Honest re-estimate | klipper_estimator (Rust) | recomputed time (slicer estimates drift), per-move breakdowns | S |
| **En** Cost + compat | arithmetic + **printer registry** (bed AABB, nozzle, materials) | $/unit fact; the ✓/⚠ compatibility verdict — the loudest fact on the card | S |
| **En** Settings diff | key=value config dumps | "v3→v4: first_layer_speed 20→35" | S |
| **M** Insert pause/M600 at layer, exclude-object preprocess, bounded temp edit | line-based rewrites at `;LAYER_CHANGE` markers; never touch Bambu header blocks; re-estimate after | minted versions | S |
| **Act** Print/requeue + outcome capture | Moonraker HTTP/WS · OctoPrint REST · Bambu FTPS/MQTT (authorization-control caveat on new firmware) | send-to-printer gated on compat verdict; success/fail/duration written back to the artifact | M |

### 4.4 Decks (`deck`)

| Capability | Tooling | What it yields | Effort |
|---|---|---|---|
| **E** PPTX parse | python-pptx (+ raw XML for SmartArt/chart text, theme fonts; `ppt/media/*` unzip) | per-slide text, titles, speaker notes, tables, image inventory, dimensions/aspect | S |
| **E** Google Slides | Slides API `presentations.get` + `pages.getThumbnail` + Drive export | structured text + first-party per-slide PNGs — the easiest source | S |
| **E** Keynote reality | keynote-parser (text/media; version-brittle; **no rendering**) + embedded QuickLook preview | best-effort search text + cover; real renders via the **Mac hand** | M |
| **R** Render farm | LibreOffice headless / Gotenberg **with fonts installed** (carlito/caladea minimum); render PDF once → rasterize per-slide PNGs; Aspose-class API as escalation | one pipeline feeds preview, filmstrip, slide-grab, OCR | M ◇ |
| **En** Per-slide index | parsed text + notes + **OCR fallback** on rendered PNGs (image-only slides, .key, PDF decks) | "find the deck with that one slide" — hits land on slide N | M |
| **En** Version families | pHash slide thumbnails + text shingling | clusters the 40 versions of the company deck; slide-level diff ("3 changed, 2 added") | M |
| **En** Render-clean verdict | deck font inventory vs installed fonts | the fonts ✓/⚠ fact; warn before client PDF export | S |
| **M** Deck→PDF, slide→PNG, extract images (lossless unzip), compose harvested slides→PDF, find/replace (normalize runs), reorder/delete (XML-level, experimental) | LibreOffice + python-pptx; native merge only via commercial libs | minted versions | S–M |

### 4.5 Text documents (`doc/wordproc`, `text`)

| Capability | Tooling | What it yields | Effort |
|---|---|---|---|
| **E** Structure + tables | python-docx, ODT/`content.xml` direct, Docs API structured JSON | headings→outline (with heuristic fallback for hand-formatted docs), tables→CSV, styles | S |
| **E** Tracked changes + comments | **pandoc `--track-changes=accept\|reject\|all`** (triple-render: Clean/Original/Redline with author+timestamp spans); raw `w:ins`/`w:del` + `commentRangeStart/End` parse | the markup toggle + LLM-digest input; comments **with** anchored ranges | S |
| **E** Google halo | Drive export (md/docx/pdf; 10MB cap), Docs `suggestionsViewMode` (view-only), Drive comments API; revisions lossy → **snapshot at ingest** | clean + redline structural fetches; platform comments captured, not lost | M |
| **E** .pages | bundled preview jpg / QuickLook PDF + pyiwa-class best-effort text | honest limited support; Mac hand for real exports | S |
| **R** Two-tier render | mammoth → semantic HTML (reading view; warnings = quality flags) · LibreOffice → PDF (pixel-true, "what the client saw"; instance pool via separate profiles) | both cached at ingest | S–M |
| **En** Contract intelligence | LLM over the *accepted* render | parties/amounts/dates/obligations + deadlines → Items; flag entities inside pending changes | M ◇ |
| **En** Changes digest | LLM over pandoc `all` spans (or diffed gdoc suggestion previews) | "what changed v3→v7, in plain English" — the Changes tab | S ◇ |
| **En** Draft dedupe | shingles + embeddings | `final_FINAL.docx` clusters → one card, version strip | M |
| **M** Accept/reject-all, strip comments, split by heading, convert matrix (docx↔md↔html↔pdf), extract media | pandoc + LibreOffice (UNO when formatting must survive exactly) | minted clean copies with lineage | S |



## 5. Sequencing

**Free-lunch first, spine before organs, buy ML before owning it.**

- **Horizon 1 — the spine + prototyped families**: G1/G2/G4/G5/G7/G9 + media & docs toolbelt slices. Unlocks: voice, image, PDF/text, screenshot cards end-to-end (matches framework T1), video probe+thumbnail+transcript ◇.
- **Horizon 2 — the studio families**: mesh/cad + gcode toolbelt, model-viewer + gcode viewer components, printer connectors (G10a). Unlocks: 3D, gcode, project cards with lineage — MUTHR's differentiation.
- **Horizon 3 — the long tail + ownership**: deck rendering farm, Mac hand (G10b), self-hosted ASR/embeddings if volume justifies, similarity search across 3D shapes and slides.

Concrete first moves inside Horizon 1, in order:

1. **G7 embedded extractors** — exiftool/ID3/gcode-headers/3MF-unwrap/docx-pptx-media. A weekend of code, and half the library gets real thumbnails and facts.
2. **G4 renditions table + G5 `derived_from`** — schema before workers, so everything the workers produce has a home.
3. **G2 queue + one worker image** (media) — ffprobe/thumbnails/waveforms/proxies; hosted ASR behind a flag.
4. **G3 docs image** — LibreOffice+fonts+pandoc+mammoth; this one container serves docs *and* decks.
5. **Registries** (G9 formats + the printer/font registries that power verdict facts).

Two cross-cutting decisions to make early, because they're expensive to retrofit:
- **Verdict facts need registries** — printers (bed/nozzle/materials), installed fonts, browser-support matrix. Small tables, big UX payoff; schema them with the spine.
- **The Mac hand (G10)** is the only route to Keynote/Pages/Fusion natives. Even a manual v0 ("MUTHR asks; you export from the app") beats silent unsupported — design the request/fulfill loop into the card from day one.
