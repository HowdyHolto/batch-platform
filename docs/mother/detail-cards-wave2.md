# Detail cards — wave 2 deep-dives

> Video · 3D models · G-code · Decks · Text documents — the five families explored to spec depth: jobs-to-be-done, full card behavior, manipulation verbs, and what each demands of the platform.
> Framework: [`detail-card-system.md`](./detail-card-system.md) · Capability gaps: [`muthr-capability-gaps.md`](./muthr-capability-gaps.md) · Wave-1 research: [`detail-card-research.md`](./detail-card-research.md)

Three of these families forced taxonomy changes (now reflected in the framework): **3D models** (`model`) and **G-code** (`gcode`) are promoted out of `project` into their own families, and **decks** (`deck`) are new — they were missing from wave 1. The `doc` family gains a real `wordproc` subkind.

A shared rule for every manipulation verb below: **manipulations mint, never mutate** — each produces a new artifact/version with a `derived_from` edge recording op + params + tool. The original is immutable.

---

## 1 · Video (`video`)

### Jobs to be done
For a studio that records bench videos, screen recordings, product b-roll, and meetings:

1. **Find the moment** — "where did I torque that fastener," "where did they say the price." Transcript search with click-to-seek; chapters; scene thumbnails.
2. **Clip and share** without opening an editor.
3. **Grab a frame** — a full-res still for a listing (and the *sharpest* frame near the chosen moment, not the exact blurry one).
4. **Extract the audio** (meeting → voice artifact; bench video → narration).
5. **Caption it for social** — burned-in captions + SRT/VTT export.
6. **Check edit-compat before importing** — will Premiere/Resolve choke on this codec/bit-depth/VFR?
7. **Read the text in screen recordings** — error messages, URLs, terminal output should be searchable.
8. **Find b-roll visually** — "shots of the CNC, warm light" across untitled clips.
9. **Make it playable for anyone** — hand out a link that just plays regardless of source codec.
10. Cheap wins: fix sideways phone video, normalize/mute audio, speed a timelapse, GIF/webp excerpt for a README.

### Card spec (expands framework §5.7)
- **Hero:** player with **storyboard hover-scrub** — a sprite-sheet of tiles + a WebVTT index using `#xywh` coordinates, the exact Mux/YouTube mechanism ([Mux hover previews](https://www.mux.com/docs/guides/create-timeline-hover-previews)); chapter ticks on the scrubber (auto-generated unless manually overridden ▸[YouTube chapters](https://support.google.com/youtube/answer/9884579)); **pause → OCR the frame**, text selectable in place ▸(Apple Live Text on paused video — the killer steal for screen recordings). Under the player: the AI block — title/summary/**tasks with accept-decline** ▸(Loom auto-titles/summaries/chapters/tasks).
- **Facts:** duration · resolution/fps · **browser-safe? verdict** · captured date · size · clips/frames minted from it.
- **Two-tier tech metadata** ▸(Plex's Media Info modal): facts stay human ("4K · 30fps · plays everywhere ✓ / needs proxy ⚠"); the full stream table (container vs per-stream codec/profile/HDR/audio channels/subtitle streams — labeled separately, never conflated) lives in Z8 All-metadata.
- **Intelligence tabs:** Transcript (diarized) · Summary · Items (Loom-style tasks) · Text (frame OCR, time-anchored) · Entities (scenes/objects/faces).
- **Modules:** auto-chapters (scene+topic); timecoded notes with dual representation (card + scrubber bubble — wave-1 P5); **retention-style heat only if shared** (viewer analytics à la Loom, private by default).
- **Type verbs (consume/act):** Watch · Clip & share range · Grab frame · Extract audio · Caption.
- **Manipulation verbs (mint versions):**
  - *Trim/clip* — offer both **fast (keyframe-snapped, `-c copy`, labeled "approximate")** and **exact (smart-cut/re-encode)** — long-GOP phone footage snaps seconds off otherwise.
  - *Fix rotation* — metadata-only display-matrix rewrite first, re-encode fallback.
  - *Normalize/mute audio* (EBU R128 loudnorm) · *Speed/timelapse* · *Burn-in captions* · *GIF/webp excerpt* · *Make web-safe proxy* (H.264+AAC MP4; tone-mapped SDR from HDR).
  - *CFR normalize* — one-click fix for variable-frame-rate screen recordings (surface a **VFR badge** when detected; VFR desyncs audio and chokes editors).

### What the incumbents taught
- YouTube Studio: title/desc/thumbnail first-class, everything else behind SHOW MORE; chapters must start 00:00, ≥3, ≥10s each; retention graph with typed moments (intro, spikes, dips) ([details](https://support.google.com/youtube/answer/57404), [analytics](https://support.google.com/youtube/answer/9314415)).
- Loom: the AI block *under* the player — auto title, summary, chapters, and **tasks extracted from speech with accept/decline**; transcript powers search/CC/chapters; note the gating (titles free, summaries/chapters/tasks paid) ([Loom AI](https://support.atlassian.com/loom/docs/loom-ai-features/)).
- Plex: human metadata first-class; codec forensics complete but one click away; container and stream codecs as **separately labeled fields** ([media info](https://support.plex.tv/articles/201998867-investigate-media-information-and-formats/)).
- Descript: transcript-as-editing-surface; filler-word removal; AI clip extraction ([descript.com/video-editing](https://www.descript.com/video-editing)).
- Mux: every derived artifact URL-addressable per playback ID (`storyboard.vtt`, `storyboard.webp`) — copy this convention for MUTHR's renditions CDN ([docs](https://www.mux.com/docs/guides/create-timeline-hover-previews)).

### Capability dependencies → [gaps doc §4-video](./muthr-capability-gaps.md)
ffprobe probe (incl. HDR transfer detection, VFR detection via `r_frame_rate ≠ avg_frame_rate`, iPhone GPS/rotation metadata) · storyboard sprite + VTT generation · HLS packaging for instant seek · `audiowaveform` peaks · WhisperX transcription+diarization (~70× realtime on one GPU) · PySceneDetect · frame OCR · CLIP embeddings per scene · ffmpeg manipulation one-shots · optional Cloudflare Stream/Mux for delivery ($5/1k min stored + $1/1k min delivered vs Mux's per-min encode/store/deliver).

**Gotchas that shape the card:** HEVC won't play in many Windows/Linux browsers without hardware decode (hence *browser-safe verdict* + always-proxy policy) ([caniuse](https://caniuse.com/hevc)); iPhone Dolby Vision 8.4 needs ffmpeg ≥5 to remux and tone-mapping for the proxy; rotation lives in metadata that naive thumbnailers ignore — honor the display matrix in **every** rendition.

---

## 2 · 3D models (`model`)

### Jobs to be done
1. **Recognize it instantly** — the thumbnail must show geometry, never a generic icon; slicer projects show their *plate* preview (already embedded in the 3MF).
2. **Is this the right version?** — v2 vs v3 by date + dimension/triangle deltas + visual diff ▸(Onshape's auto-tracked Versions & History).
3. **Measure without opening CAD** ▸(Onshape's measure tool; McMaster pre-extracts every dimension into the spec table).
4. **Check printability** — watertight? shells? min wall? fits the plate? units sane?
5. **Grab-and-go** — download original · open-in-slicer · **send-to-printer with a known-good profile** ▸(MakerWorld's one-click print is the modern bar).
6. **Remember what worked** — attach the per-file print settings and the actual gcode that produced the good batch ▸(Printables treats print files as first-class objects with their own settings, plus community "User Print Files").
7. **Export for someone else** — STEP for the machinist, GLB for the web, STL for a collaborator; multi-fidelity like McMaster's full vs simplified models.
8. **Inspect quality** — wireframe/matcap/normals ▸(Sketchfab's Model Inspector), section view for internal features.
9. **Annotate decisions in 3D** — "this boss cracked, thicken it" pinned to the spot ▸(Sketchfab's numbered 3D annotations with camera fly-to).
10. **Track remix/derivative lineage** ▸(Thingiverse/Printables remix graphs).

### Card spec (expands framework §5.13)
- **Hero:** GLB orbit viewer (fit-to-view, ¾ top-front default camera, ground shadow) with **inspection toggles** — wireframe · matcap · dimensions overlay · **section plane** — and **annotations pinned to 3D coordinates** (the anchored-capture rule extended to space: a note carries an xyz + camera pose, dual-represented as list card + numbered hotspot).
- **Facts:** L×W×H (with **unit confidence** — see gotcha) · volume · triangles · shells · **watertight/printable ✓/⚠** · format. A McMaster-grade spec table is the aspiration: facts dense enough to answer "does it fit" without opening anything.
- **Intelligence tabs:** Geometry (manifold report, wall-thickness heuristic, overhang estimate, auto-orient suggestion) · Dependencies (3MF: plates, per-plate settings, embedded gcode, AMS/filament mapping; OBJ: sidecar MTL/textures — flag orphans) · Summary.
- **Modules:** **print record** — per-file print settings + linked outcomes (the lab notebook); version strip with dimension deltas; derived-from/derived-to chain (source project ↔ sliced gcode); remix lineage for published designs.
- **Type verbs:** Orbit/Inspect · Measure · Open in slicer · Send to printer (via profile) · Export STEP/GLB/STL.
- **Manipulation verbs (mint versions):** rotate/orient (incl. **auto-orient** ▸Tweaker-3) · scale/unit-fix (one-click ×25.4) · repair (manifold merge + hole fill) · decimate (web LOD) · split shells · convert (STL↔3MF↔GLB↔OBJ; STEP→mesh **one-way** — B-rep is never recoverable from triangles, say so in the UI).

### What the incumbents taught
Printables: print files are first-class siblings of the mesh, each with printer/nozzle/material/layer settings; makes + remixes + per-model analytics ([model pages](https://www.printables.com/model), [analytics](https://blog.prusa3d.com/revealing-the-new-detailed-analytics-for-your-models-on-printables-com_71849/)). MakerWorld: profile-attached models with straight-to-printer printing; ratings accrue to *profiles* ([FAQ](https://makerworld.com/en/faq)). Sketchfab: the inspector (wireframe/matcap/UV/PBR channels) + position-pinned annotations ([inspector](https://sketchfab.com/blogs/community/inspect-models-and-textures-like-never-before)). McMaster-Carr: spec table as interface; multi-fidelity CAD downloads ([cad models](https://www.mcmaster.com/cad-models/)). Onshape: versions, BOM, measure in a web viewer ([measure](https://cad.onshape.com/help/Content/View/measure_tool.htm)). Bambu/Prusa 3MF: **a slicer project is a ZIP that self-describes** — 512×512 project thumbnail, per-plate PNGs, full settings JSON, even embedded gcode — extractable with a ZIP reader alone ([Bambu 3MF](https://wiki.bambulab.com/en/software/bambu-studio/3mf-compatibility)).

### Capability dependencies → [gaps doc §4-model](./muthr-capability-gaps.md)
Normalize-to-GLB at ingest (`<model-viewer>`/three.js want GLB) · trimesh for the whole analysis pass (bbox/volume/watertight/shells/sections/conversions) · manifold3d for repair · OCCT ladder for STEP/IGES (cascadio → CadQuery → FreeCAD headless), tessellated **twice** (coarse thumb, medium viewer, originals for download) · F3D CLI (`--rendering-backend=egl`) as the one headless thumbnailer covering meshes *and* STEP, stl-thumb as fallback · Tweaker-3 auto-orient · PrusaSlicer CLI for real time/filament estimates · OpenShape-class point-cloud embeddings for "find similar parts" · **proprietary honesty**: `.sldprt` yields an embedded preview bitmap + metadata but no geometry without commercial SDKs; `.f3d` has no offline OSS reader (Autodesk APS cloud translates it) — baseline is thumbnail + open-in-app + a nudge to co-export STEP.

**Gotchas that shape the card:** STL has no units (hence the unit-confidence fact + ×25.4 verb); huge scan meshes need decimated LOD GLB with the original download-only; 3MF vendor extensions fragment (core geometry + OPC thumbnails are portable; `Metadata/*.config` is vendor-specific — parse defensively); OBJ's sidecar MTL/textures orphan easily — ingest file *groups*.

---

## 3 · G-code (`gcode`)

### Jobs to be done
G-code is the **terminal artifact** of design → CAD → 3MF → slice → print, and in a studio it's re-run as-is for repeat batches:

1. **Verify before burning 6 hours** — right printer, nozzle, material, plate? Wrong-target sends are physical-crash territory, not just failed prints.
2. **Which gcode produced the good batch?** — outcomes recorded on the file ▸(OctoPrint stores success/failure counts + last-print *on the file itself*; Moonraker links file↔job history via `job_id`).
3. **Cost per unit** — filament g × $/kg + time × (watts × tariff + machine rate). Every input is already in the header; this is arithmetic, not ML.
4. **Requeue to a specific printer** — gated on the compatibility check.
5. **Lineage both ways** — back to the 3MF/STL (Bambu's `.gcode.3mf` literally *contains* the project; Prusa footers name the profiles used), forward to print outcomes.

### Card spec (expands framework §5.14)
- **Hero:** 3D toolpath viewer with **layer slider + move slider**, feature-type coloring (perimeter/infill/support), and a **legend that doubles as toggles** with per-feature time fractions ▸(PrusaSlicer's viewer — and since 2.3 the file itself carries `;TYPE:`/`;LAYER_CHANGE` annotations, so any tool can reconstruct the same coloring). L1 fallback: the slicer's **embedded thumbnail** (base64 PNG in comments — free).
- **Compatibility strip (the loudest thing on the card):** target printer model · nozzle Ø · material + temps · fits-bed check — rendered as a ✓/⚠ verdict against MUTHR's printer registry. *This fact outranks everything else because the failure mode is physical.*
- **Facts:** est. time (slicer-claimed **and** recomputed — they drift) · filament g + $ · layer height · layers · temps · sliced-with + version.
- **Intelligence tabs:** Settings (the parsed config dump — Prusa footers and Bambu CONFIG_BLOCKs are `key = value`, **trivially diffable**: "v3→v4: first_layer_speed 20→35") · Dependencies (source 3MF/STL, profiles used) · Summary; risk flags (first-layer speed/temp outliers per material, missing preheat).
- **Modules:** **print outcomes** written back from the farm (success/cancel/error, duration, filament, notes, photo) — the artifact accrues a production record; per-plate cards for `.gcode.3mf` containers.
- **Type verbs:** Print (send via Moonraker/OctoPrint/Bambu) · Reprint · Compare settings · Re-estimate (klipper_estimator).
- **Manipulation verbs (mint versions, line-based only):** insert pause/color-change (M600) at layer N ▸(PrusaSlicer's right-click-the-slider precedent) · add exclude-object markers (`preprocess_cancellation`) · bounded temp edit (clamped to material range) · *expert-only:* truncate-below-Z resume. **Never** reorder motion, never strip Bambu header blocks (crashes Bambu Studio on reopen); re-run the estimator after any edit.

### What the incumbents taught
PrusaSlicer viewer + comment annotations ([viewer](https://help.prusa3d.com/article/prusaslicer-g-code-viewer_193152), [insert-at-layer](https://help.prusa3d.com/article/insert-pause-or-custom-g-code-at-layer_120490)). **Moonraker's metadata model is the Rosetta stone** — slicer+version, layer stats, filament type/weight/colors, temps, printer model, thumbnails, `gcode_start_byte/end_byte`, job linkage — copy it nearly wholesale ([file manager API](https://moonraker.readthedocs.io/en/latest/external_api/file_manager/)). OctoPrint: print history on the file ([files API](https://docs.octoprint.org/en/master/api/files.html)). Bambu: task history with outcomes + one-tap reprint via the community-documented API ([OpenBambuAPI](https://github.com/Doridian/OpenBambuAPI)).

### Capability dependencies → [gaps doc §4-gcode](./muthr-capability-gaps.md)
Head+tail parsing only (~64KB each end — all headers/footers live there; 100MB+ files must never be fully parsed for metadata) · per-slicer comment dialects (Prusa-family `; key = value` footers; Bambu `HEADER_BLOCK`/`CONFIG_BLOCK`; Cura `;TIME:`/`;MINX…`) with `prusa3d/gcode-metadata` and Moonraker's `metadata.py` as reference parsers · base64 thumbnail extraction (+QOI variant) · `gcode-preview` (three.js) for the browser viewer, decimate/cap layers for huge files · klipper_estimator for honest re-estimates · printer registry + farm connectors (Moonraker HTTP/WS, OctoPrint REST, Bambu FTPS/MQTT — noting Bambu's authorization-control drift: LAN send may require Bambu Connect on newer firmware) · **laser/CNC dialect detection** (no E axis, `M3/S` spindle/power) routes to a sibling template — layer sliders and filament math are meaningless there, and the safety story is fire/origin, not temps.

---



## 4 · Decks (`deck`)

### Jobs to be done
1. **Find THE deck with that one slide** — the highest-value job. Search must hit *slide N of deck X* (with thumbnail), not just the deck. Requires per-slide indexing: titles, body text, speaker notes, **and OCR of the rendered slide** (catches image-only slides, Keynote, PDF decks).
2. **Grab one slide as an image** — free once per-slide PNGs exist for preview; expose on every filmstrip thumb.
3. **Is this the latest version?** — cluster the 40 near-identical versions of the company deck into one family; badge the newest; version timeline on-card.
4. **Present directly** — full-screen flip-through of rendered slides (static; badge "animated" slides whose builds won't show).
5. **Export a PDF for the client** — with a **font-substitution warning** when the deck uses fonts the renderer lacks.
6. **Who saw it, what changed since** — presented-to log; slide-level diff between versions ("3 changed, 2 added") as text + thumbnail diff.
7. **Harvest good slides** — slide-level favorites across decks → compose into a new PDF/image set (native .pptx recomposition is fidelity-risky; offer as best-effort).

### Card spec (expands framework §5.15)
- **Hero:** large paged **slide reader** ▸(Speaker Deck's minimalist reader; its embeds support per-slide deep links — copy that: every slide is addressable) with thumbnail filmstrip rail; cover slide is the library-card image ▸(Drive/Gamma).
- **Below the reader: per-slide transcript** ▸(SlideShare renders every slide's text under the player — the proof that slide text should be a first-class, searchable layer).
- **Facts:** slides · aspect (never assume 16:9 — Gamma cards aren't even fixed-aspect) · last edited · source app · fonts (with *renders-clean?* verdict) · has-notes/has-video flags.
- **Intelligence tabs:** Text (per-slide text + notes + OCR fallback, each hit deep-links to its slide) · Summary (deck abstract + outline from title placeholders) · Entities · Dependencies (fonts, embedded vs **linked** media — flag externally-linked media as broken-on-ingest).
- **Modules:** version family strip (near-duplicate clustering via slide-thumbnail pHash + text shingling); presented-to log; **share analytics** if shared ▸(Pitch's per-recipient slide-by-slide view time — with their engagement taxonomy: ≤2s glanced, ≤10s skimmed, longer = real attention; Canva's per-slide attention is the same pattern).
- **Type verbs:** Present · Export PDF · Slide → PNG · Extract all images (lossless — they're plain files in the zip) · Harvest slides.
- **Manipulation verbs (mint versions):** convert to PDF · rasterize slide(s) · compose harvested slides → new PDF · find/replace text (normalize runs first) · reorder/delete slides (XML-level, medium risk — mark experimental).

### What the incumbents taught
Speaker Deck: PDF-in, rasterized reader, per-deck download toggle, per-slide anchors ([comparison](https://speakerdeck.com/slideshare-alternative)). SlideShare: full slide-text transcript on the page ([teardown](https://slidesgrabber.com/speakerdeck-vs-slideshare/)). Pitch: per-share-link, per-slide view-time analytics ([engagement analytics](https://pitch.com/blog/introducing-engagement-analytics)) — and pitch.com 403s fetchers: cloud decks are API-export-only for ingest. Canva: per-slide attention + finished-vs-stopped ([design insights](https://www.canva.com/help/view-design-insights/)). Gamma: exports are PDF-faithful, PPTX "may require formatting adjustments" — prefer PDF snapshots of cloud decks, keep the live URL as the Present action ([export docs](https://help.gamma.app/en/articles/8022861-what-s-the-easiest-way-to-export-my-gamma)). OneDrive: inline preview with one-click escalation to the real editor ([previewers](https://techcommunity.microsoft.com/t5/Microsoft-OneDrive-Blog/Announcing-new-Word-and-PowerPoint-previewers-for-OneDrive-and/ba-p/82257)).

### Capability dependencies → [gaps doc §4-deck](./muthr-capability-gaps.md)
python-pptx extraction (text/notes/tables/dimensions; SmartArt+chart text need extra XML work; legacy .ppt must convert first) · LibreOffice/Gotenberg render farm **with a real font set** (carlito/caladea minimum) · render-PDF-once → rasterize-pages (one pipeline serves preview, filmstrip, OCR, slide-grab) · Google Slides first-party APIs (structured text + per-slide `getThumbnail` PNGs — the easiest source) · **Keynote reality**: `.key` = zip of media + Snappy-compressed protobuf `.iwa`; `keynote-parser` gets text/media but *cannot render* and breaks across Keynote versions — budget .key as text+media+embedded-preview only, with the **Mac hand** (G10) doing real PDF/PPTX exports · pHash slide clustering · Aspose-class commercial API as opt-in escalation for decks that render badly.

---

## 5 · Text documents (`doc/wordproc` + `text`)

*Unlike PDF (fixed layout), these are flowing, editable, multi-author, multi-version. The card's center of gravity shifts from "render pages" to **structure, revisions, and who-did-what**.*

### Jobs to be done
1. **Read it clean OR see what changed** — one toggle: Clean / Redline / Original ▸(Word's Simple Markup / All Markup / Original — one document, multiple render modes).
2. **Pull the final terms out of a contract draft** — parties, amounts, dates, term, renewal — extracted from the *accepted* view, **flagged if any figure sits inside a pending change**.
3. **Turn a draft into a published post** — one action: export md/html, images extracted, comments stripped, changes accepted.
4. **Find by half-remembered phrase** — index the plain text of **every version**, not just the latest (the phrase may only exist in v3).
5. **Lift a table → dataset artifact** with a provenance link.
6. **Which version did the client actually get?** — content-hash ingested files and cross-reference sent attachments; *nothing on the market does this well — differentiator.*
7. **What changed between v3 and v7, in plain English** — LLM digest over author-attributed change spans: "opposing counsel cut the exclusivity clause; fee 4.5k→6k; deadline moved to Nov 1."
8. **Harvest highlights into the brain** ▸(Readwise Reader: highlights as addressable, tagged, note-carrying objects); reading state (progress, read time) is a distinct axis from editing state.
9. SOPs: split-by-heading into steps; staleness badge ("untouched 14 months").

### Card spec (expands framework §5.8/§5.9)
- **Hero — two-tier render:** default is the **semantic reading view** (mammoth-style clean HTML: fast, reflows, themable); one tap to the **pixel-true view** (LibreOffice→PDF: pagination, letterhead, signature blocks — *"what the client saw"*). Contracts want the second on demand; drafts live in the first.
- **The markup toggle:** Clean / Redline / Original across the top of the hero. Redline shows ins/del inline with per-author color ▸(Google Docs colors edits per editor; Word's Reviewing Pane lists every revision with author+time).
- **Facts:** words · read time · last editor + when · **unresolved changes** · open comments · versions (named versions pinnable ▸ Google's named versions).
- **Intelligence tabs:** Summary · **Changes** (the plain-English version-diff digest — new vocabulary word, see framework Z5) · Items (obligations + deadlines → calendar/todo suggestions) · Entities (parties/amounts/dates, run on the accepted render) · Text.
- **Modules:** outline from headings (with a **heuristic fallback** — real-world docs use "bold 16pt Normal" as headings and break naive extraction; short-line + bold/size-delta detection, LLM fallback); properties panel from frontmatter for md ▸(Obsidian's typed Properties); backlinks ▸(Notion's "{n} backlinks" under the title).
- **Type verbs:** Read · Toggle markup · Export as… (md/html/pdf/docx) · Lift table · Harvest highlights.
- **Manipulation verbs (mint versions):** accept-all/reject-all changes (pandoc re-emit for content-true output; LibreOffice UNO path when formatting must survive exactly) · strip comments · split by heading · extract images/tables · find-replace (normalize runs first).

### What the incumbents taught
Google Docs: outline is structural, versions are colored per editor, **suggesting mode** is server-side ([version history](https://support.google.com/docs/answer/190843), [suggestions](https://support.google.com/docs/answer/6033474)). Word: the four markup render modes + reviewing pane ([track changes](https://support.microsoft.com/en-us/word/training/track-changes-in-word)). Dropbox/Drive: **preview-layer annotations live in the platform, not the file** — a provenance trap MUTHR must not repeat; capture both or state what's missing ([Dropbox annotations](https://dropbox.tech/application/annotations-on-document-previews)). Readwise Reader: progress/read-time/highlights + doc-anchored AI ([Reader docs](https://docs.readwise.io/reader)). Obsidian: frontmatter → typed properties panel, backlink panes ([properties](https://obsidian.md/help/properties)).

### Capability dependencies → [gaps doc §4-textdoc](./muthr-capability-gaps.md)
**pandoc `--track-changes=accept|reject|all`** — render the same docx three ways: Clean, Original, and `all` (spans classed insertion/deletion with author+timestamp attributes — the perfect LLM-digest input) · mammoth for semantic HTML (logs unmapped-style warnings → quality flags) · python-docx (tables, styles; comments API since 1.2.0 but **without anchored ranges** — parse `commentRangeStart/End` from the OOXML directly) · LibreOffice headless for pixel-true + ODT/RTF/legacy (single conversion per instance — pool with separate `UserInstallation` profiles) · Google: Drive export (md since 2024; 10MB cap → fall back to docx export), Docs API `suggestionsViewMode` (INLINE / PREVIEW_ACCEPTED / PREVIEW_WITHOUT — **view-only**, the API can't accept/reject), Drive comments API, revisions API is **lossy for hot docs → snapshot at ingest; history is perishable** · `.pages` = Snappy-compressed protobuf IWA — harvest the bundled preview jpg/QuickLook PDF + best-effort text (pyiwa-class), then open-in-app / Mac-hand export · frontmatter + wikilink parsing for md · near-dup clustering (shingles + embeddings) to collapse `post_v2_final_FINAL.docx` into one card with a version strip.

---

## Cross-family patterns wave 2 surfaced

Six patterns showed up in three or more families — promoted into the framework:

1. **The verdict fact.** Every family wants one precomputed ✓/⚠ answer to "will this work where I'm about to use it": video *browser-safe?* · gcode *matches printer?* (loudest fact on the card — the failure mode is physical) · deck *renders clean? (fonts)* · model *printable/watertight?* · doc *terms stable? (no pending changes on key figures)*. Verdicts are computed against registries MUTHR keeps (printers, fonts, browser matrix) — now a Facts convention in framework §3.
2. **The free lunch is bigger than expected.** Files carry their own previews and settings: gcode base64 thumbnails + full config dumps · 3MF project/plate PNGs + settings JSON · `.pages`/`.sldprt` embedded preview images · docx/pptx media folders · ID3/EXIF. The L1 embedded-extraction layer (gaps G7) is the highest-ROI code in the system.
3. **Two-tier rendering everywhere.** Semantic/fast vs faithful/heavy: mammoth HTML vs LibreOffice PDF (docs) · text layer vs rendered PNG (decks) · web proxy vs original (video) · decimated LOD GLB vs full mesh (models). Same rule each time: the hot path reads a derivative; the original is immutable and one click away.
4. **Anchors generalize; each family brings a coordinate system.** Timecode (video) · layer N (gcode) · slide N (deck) · xyz + camera pose (model annotations) · heading/range + author (docs). "Capture is anchored" (framework §4) now has a per-family anchor column.
5. **Proprietary-format policy.** `.key`, `.pages`, `.f3d`, `.sldprt`: extract embedded preview + best-effort text, say "limited support" honestly, offer open-in-app, and route real exports through the **Mac hand** (gaps G10). Never promise server-side rendering of Apple/Autodesk/SolidWorks natives.
6. **Snapshot at ingest; write outcomes back.** Cloud sources are perishable (Google revisions collapse; cloud decks are export-only snapshots) — capture when you see them. And artifacts accrue *records of use*: print outcomes on gcode, presented-to on decks, viewer analytics on shared video. The card is a lab notebook, not a static file view.
