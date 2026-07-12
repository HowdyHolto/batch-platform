# MUTHR — feasibility & build-vs-buy

> Every capability the eleven prototype cards promise, sorted by **where it can run** and **what it costs** — verified against licenses, browser reality, and current pricing (July 2026).
> Companions: [`muthr-capability-gaps.md`](./muthr-capability-gaps.md) (what to build) · [`detail-cards-wave2.md`](./detail-cards-wave2.md) (why).

## 0. Headline

**Yes — effectively all of it is feasible, and none of it requires a new subscription.** Verified across four passes (browser/WASM libraries, local audio AI, existing-platform pricing, OSS licensing + hardware):

1. **Six of the eleven cards reach real usefulness entirely in the browser** — g-code, dataset, vector, image, sqlite, PDF/doc reading — private by construction, $0, all ★-confidence code.
2. **One always-on machine you probably already own** (an M-series Mac is ideal — it's also the only path to Keynote/Pages) covers everything heavier: ffmpeg, LibreOffice rendering, whisper transcription, diarization, voiceprints, embeddings, slicer estimates, printer connectors. No license blocks any of it for private use.
3. **Your existing services already cover the platform primitives**: Supabase (queue via pgmq + pgvector, both included), R2 (renditions, $0 egress), Cloudflare Workers AI (transcription at **$0.03/hr**, embeddings ~free at your scale), Claude (summaries/entities at **~$0.01/artifact**, half that batched). Realistic total marginal cost at studio scale: **single-digit dollars per month.**
4. **The genuinely uncovered item is exactly one**: Fusion 360 `.f3d` geometry translation — Autodesk's cloud API at ~$0.60/translation, or the manual policy already in the framework (open-in-app + export STEP alongside). Everything else labeled "paid" below is an optional quality tier, not a requirement.

The privacy ordering holds: prefer browser → studio box → metered API, and the metered lane is gated by per-source boost rules with cost logged in the activity record.



## 1. The three lanes

Everything below is sorted into three lanes, in priority order. The ordering *is* the privacy policy: a capability only moves down a lane when the lane above genuinely can't hold it.

| Lane | What it is | Privacy | Marginal cost |
|---|---|---|---|
| **🅐 Browser** | Client-side JS/WASM in the MUTHR web app. The file never leaves the user's machine for these features (originals still sync to R2 for storage). | Maximum — compute happens on your device | $0 |
| **🅑 Studio box** | One always-on machine at the studio (existing Mac/workstation, or a cheap mini PC) running the MUTHR worker: ffmpeg, LibreOffice, whisper, mesh tools, printer connectors. Polls the job queue in Supabase. | Full — bytes stay on hardware you own | $0 services; electricity + hardware you likely own |
| **🅒 Paid, metered** | API calls with per-use cost, used only where 🅐/🅑 can't reach or quality demands it. Every call is logged with cost in the activity record. | Data leaves — use per-source rules to gate | cents per artifact |

**Not a lane: new subscriptions.** Nothing in the plan requires a new monthly service. The only recurring costs are ones you already carry (Supabase, R2, Netlify, Claude).

### The studio box, concretely (verified)

The legal frame first: GPL/LGPL obligations trigger on **distribution**, AGPL adds **network access to a modified version**. Running any of these tools as CLI subprocesses from a private worker — unmodified, never shipped — attaches **zero obligations**. The one documented tripwire: if MUTHR ever became a *public* "upload STL → get gcode" service running a *modified* slicer, the slicer's source would have to be offered. Internal studio use never triggers anything.

Three configurations, in order of preference:

| Config | Unlocks | Doesn't cover |
|---|---|---|
| **The Mac you likely already own** (M1/M2, ~$0) | whisper.cpp with Metal (small ~10× realtime, medium usable, large fits on 16GB); full ffmpeg/LibreOffice/mesh/slicer pipeline; **the only machine that can export Keynote/Pages via AppleScript** (verified working through current macOS) — the "Mac hand" from the gaps doc; silent, ~10W always-on | CUDA speed for diarization/large-ASR; run processes bare (Docker on macOS is a VM, no Metal passthrough) |
| **$250 used mini PC** (i5/i7, 32GB, Linux + Docker) | The whole doc/media/mesh/gcode pipeline in containers (Gotenberg for LibreOffice with fonts baked in); whisper small near-realtime, medium overnight; CPU embeddings; cheapest always-on | Fast large-model ASR, usable local LLM, iWork exports |
| **Mini-tower + used RTX 3060 12GB** (~$450–550 total) | The private-AI tier: faster-whisper large-v3 ≈ **8× realtime** (1h memo → ~7min, top quality), pyannote diarization in minutes, 8B local LLM at 30–45 tok/s, NVENC transcodes | iWork (still wants a Mac hand); silence (~200W bursts) |

**Worker ↔ Supabase plumbing (verified):** the box makes **outbound-only** TLS connections — no port forwarding, nothing exposed at the studio. Supabase direct connections are IPv6-only (most home ISPs aren't), so the worker connects through the **Supavisor pooler (IPv4 on every tier)**; queue = **pgmq** (the extension Supabase Queues is built on, included) with visibility-timeout polling — jobs are Postgres rows, crash-safe, surviving restarts by construction.



## 2. Per-card feasibility matrix

Legend: 🅐 browser · 🅑 studio box · 🅒 metered · ★ = I'd build this with high confidence today · ◐ = workable, needs integration effort · ⚠ = genuinely hard or gated (noted why).

### Voice
| Feature (from the card) | How | Lane | Verdict |
|---|---|---|---|
| Waveform + playback | WebCodecs/ffmpeg-derived peaks (Web Audio `decodeAudioData` OOMs on 1h files — 1.27GB PCM) rendered on canvas | 🅐 | ★ |
| Transcription | whisper.cpp (Metal) / faster-whisper **large-v3-turbo**; 1h memo ≈ 2–8 min on Mac/3060, coffee-break on CPU | 🅑 | ★ |
| Diarization (speaker-colored waveform) | **sherpa-onnx** (Apache-2.0, 45MB models, CPU-fine, zero account gating) default; pyannote community-1 as the higher-accuracy option (free, one-time HF gate) | 🅑 | ★ |
| Speaker naming + voiceprints | ECAPA-TDNN embeddings (Apache-2.0, 192-d) → pgvector cosine; enroll 3–5 clips/person, confirm-loop UX; ~90–95% top-1 suggestion accuracy cross-mic | 🅑 | ★ |
| Summary · Items · Entities (+ receipts) | Claude Haiku (cents) or local Qwen2.5-14B via Ollama at ~80–90% of Haiku quality | 🅒 or 🅑 | ★ |
| Calendar/todo suggestion chips | Own UI + LLM extraction with timestamp receipts | 🅐+🅒/🅑 | ★ |
| Share clip (time range) | ffmpeg `-c copy` on box; ffmpeg.wasm in browser for small files | 🅑/🅐 | ★ |
| Transcript search | Postgres FTS on segments (Supabase) | already-owned | ★ |

### Track / Sample
| Feature | How | Lane | Verdict |
|---|---|---|---|
| ID3 + artwork | music-metadata parse in browser | 🅐 | ★ |
| Fingerprint → identify | fpcalc/Chromaprint (LGPL) on box → **AcoustID + MusicBrainz** (free APIs, key signup only) | 🅑 + free API | ◐ |
| BPM / key | aubio or Essentia on box (essentia.js exists for browser) | 🅑 (🅐 possible) | ◐ |
| Playback / queue / loop audition | Native audio element | 🅐 | ★ |

### Image / Screenshot
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Zoomable hero, EXIF + GPS strip | exifr (MIT, 22KB — dormant since 2021 but format-stable) | 🅐 | ★ |
| Map chip | Leaflet + OSM tiles (free) | 🅐 | ★ |
| Palette + same-palette search | Canvas quantization (~30 lines) + color distance in SQL | 🅐 | ★ |
| OCR (screenshot first-class) | tesseract.js in browser (fine on clean UI text); PaddleOCR on box for photos/tables | 🅐 → 🅑 | ★ |
| Objects/scenes auto-tags | CLIP zero-shot via transformers.js (90–150MB model, cached, self-hosted weights) or box; Claude vision as quality tier | 🅐/🅑 (🅒 optional) | ◐ |
| Faces → people | Local-only face embeddings on box (privacy: never cloud) | 🅑 | ◐ ⚠ consent UX first |
| Near-duplicate detection | pHash in browser/box + pgvector | 🅐/🅑 | ★ |
| Crop/rotate/export sizes | Canvas in browser; libvips/sharp on box for batch | 🅐/🅑 | ★ |

### Vector
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Render + bg toggle + ∞ zoom | Native SVG | 🅐 | ★ |
| Geometry/color/font facts | Parse the XML directly | 🅐 | ★ |
| Export PNG @1×/2×/4× | Canvas rasterize | 🅐 | ★ |
| Optimize/copy SVG | svgo (browser build) | 🅐 | ★ |

### Video
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Probe + browser-safe verdict | mediainfo.js (BSD-2, chunked — multi-GB files probe fine client-side) against a baked support matrix | 🅐 | ★ |
| Thumbnails + storyboard sprites | `<video>`+canvas seek-grab for playable codecs; WebCodecs for speed; box ffmpeg for HEVC/HDR originals | 🅐 → 🅑 | ★ |
| Web-safe proxy (H.264+AAC, tone-mapped) | Box ffmpeg (NVENC/VideoToolbox); *not* browser (1GB+ files, 10–20× slower in wasm) | 🅑 | ★ |
| HLS instant-seek rendition | Box ffmpeg → R2 | 🅑 | ◐ |
| Transcript + diarization | Same audio stack as voice, on extracted track | 🅑 | ★ |
| Auto-chapters / scenes | PySceneDetect (BSD-3) + topic pass | 🅑 | ◐ |
| Pause-frame OCR / frame text search | tesseract.js on grabbed frames (browser) or box batch over keyframes | 🅐/🅑 | ◐ |
| Visual b-roll search | CLIP embeddings per scene → pgvector | 🅑 | ◐ |
| Clip/trim (fast + exact), rotate-fix, audio extract, captions burn, GIF/webp | Box ffmpeg one-shots; browser ffmpeg.wasm for ≤1GB quick jobs (2GB hard wasm cap) | 🅑 (🅐 small) | ★ |
| Timecoded notes (dual representation) | Own UI + schema | 🅐 | ★ |

### 3D Model
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Orbit viewer (STL/OBJ/PLY/GLB) | three.js loaders (MIT) | 🅐 | ★ |
| 3MF view + plate/settings free lunch | JSZip/fflate unwrap (thumbnails + `Metadata/*.config`) + geometry via 3MFLoader — **Bambu/Prusa project 3MFs need own parse** (Production extension unsupported by the stock loader) | 🅐 | ◐ |
| STEP/IGES → mesh | Browser: occt-import-js (LGPL, ~10MB wasm, v0.0.x — workable); box: cascadio/CadQuery for batch + quality | 🅐/🅑 | ◐ |
| Mesh facts (dims/volume/watertight/shells) | Cheap stats in JS + **manifold-3d** (Apache-2.0, active) for authoritative manifoldness/volume; trimesh on box for batch | 🅐/🅑 | ★ |
| Repair | manifold `Merge` for slightly-broken meshes; trimesh/Blender pipeline on box for trashed ones | 🅐 → 🅑 | ◐ |
| Wireframe/section/measure/dims overlay | three.js (own code) | 🅐 | ★ |
| Pinned 3D annotations | Own UI (xyz + camera pose in schema) | 🅐 | ★ |
| Batch thumbnails | F3D CLI headless (BSD-3; reads meshes *and* STEP) | 🅑 | ★ |
| Auto-orient | Tweaker-3 (GPL-3, stale-but-stable 2021) | 🅑 | ◐ |
| Slice → time/filament estimate | PrusaSlicer CLI (AGPL — private subprocess use unconditional) | 🅑 | ★ |
| Shape similarity search | OpenShape-class embeddings | 🅑 | ⚠ research-grade; defer |
| `.f3d` / `.sldprt` | Embedded thumbnail + metadata only; geometry needs Autodesk APS (cloud) or commercial SDKs — **policy: open-in-app + export-STEP nudge** | 🅐 peek / 🅒 optional | ⚠ by design |

### G-code
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Header/footer parse (all facts) | Pure text parse of first+last 64KB via `File.slice` — fully client-side, any file size | 🅐 | ★ |
| Embedded thumbnail | Base64 block extraction in browser | 🅐 | ★ |
| Toolpath viewer + layer slider | gcode-preview (MIT) — **prototype at 50–100MB before committing**; decimate/cap layers as fallback | 🅐 | ◐ |
| Settings diff | Text diff of `key = value` dumps | 🅐 | ★ |
| Cost per unit | Arithmetic + filament price table | 🅐 | ★ |
| Compatibility verdict | Own printer registry (Supabase table) checked client-side | 🅐 | ★ |
| Honest re-estimate | klipper_estimator (MIT; **repo archived 1/2026 — pin the binary**) | 🅑 | ◐ |
| Pause@layer / bounded temp edit | Line-based rewrite (browser or box), re-estimate after | 🅐/🅑 | ★ |
| Send-to-printer + outcome capture | Box connectors: Moonraker HTTP/WS, OctoPrint REST, Bambu FTPS/MQTT (LAN-mode caveats on new firmware) | 🅑 | ★ |

### Deck
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Text/notes/media extraction (pptx) | JSZip + OOXML parse in browser | 🅐 | ★ |
| Slide rendering (the one true server job) | LibreOffice headless via **Gotenberg** (MIT wrapper) with Carlito/Caladea/brand fonts baked in; render PDF once → rasterize pages | 🅑 | ★ |
| Per-slide search index (+OCR fallback) | Parsed text + tesseract on rendered PNGs | 🅑 | ★ |
| Fonts verdict | Deck font inventory vs box font list | 🅑 | ★ |
| Version-family clustering | pHash slide thumbs + text shingling | 🅑 | ◐ |
| Google Slides | First-party APIs (structured text, per-slide PNG, exports) — free quota | free API | ★ |
| Keynote | `keynote-parser` best-effort text + embedded preview (browser) + **Mac-hand AppleScript export (verified alive in current macOS)** | 🅐 peek + 🅑 Mac | ◐ |
| Present mode / slide→PNG / harvest→PDF | Browser over rendered renditions; pdf-lib compose | 🅐 | ★ |

### Documents (redline) + Text
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Reading view (docx→HTML) | mammoth browser build (BSD-2) — semantic, fast | 🅐 | ★ |
| Clean/Redline/Original triple render | pandoc `--track-changes` on box; or own `w:ins`/`w:del` OOXML parser in browser (JSZip + ~200 lines) | 🅑 (🅐 buildable) | ★ |
| Comments with anchored ranges | Raw OOXML parse (`commentRangeStart/End`) | 🅐/🅑 | ★ |
| Pixel-true "what the client saw" | LibreOffice→PDF on box | 🅑 | ★ |
| Changes digest, contract entities, obligations→Items | LLM over author-attributed spans (Claude Haiku or local 14B) | 🅒 or 🅑 | ★ |
| Which-version-went-out | Content hashing + correlation (own code) | 🅐 | ★ |
| Tables→CSV, images out, split by heading | python-docx/pandoc box; much also browser-side | 🅐/🅑 | ★ |
| `.pages` | Bundled preview harvest (browser) + Mac hand | 🅐 + 🅑 Mac | ◐ |
| Google Docs snapshot-at-ingest | Drive/Docs APIs (free quota; md export since 2024, 10MB cap → docx fallback) | free API | ★ |

### Dataset / Database
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Sample grid + column stats + histograms | **DuckDB-WASM** (MIT, ~8MB, `SUMMARIZE`) — the single best browser win in the system | 🅐 | ★ |
| Ask-this-table (NL→SQL) | LLM writes SQL (schema+samples in prompt), DuckDB-WASM executes locally — data never leaves, only schema does; fully-local option via Ollama | 🅐+🅒/🅑 | ★ |
| Quick chart / export filtered | Own UI over DuckDB results | 🅐 | ★ |
| Open .sqlite read-only | official SQLite WASM (public domain) | 🅐 | ★ |
| xlsx | SheetJS CE (Apache-2.0 — pin from their CDN registry) or exceljs (MIT) | 🅐 | ★ |

### Universal layer
| Feature | How | Lane | Verdict |
|---|---|---|---|
| Format sniffing, hashing, dedupe | file-type/magic bytes + SHA-256 (WebCrypto) in browser at upload; libmagic on box | 🅐/🅑 | ★ |
| Renditions store + CDN | R2 (already owned, zero egress) | owned | ★ |
| Queue + workers | pgmq on Supabase (included) + studio-box poller via Supavisor session mode, outbound-only | owned + 🅑 | ★ |
| Text embeddings / semantic related | MiniLM/bge-small ONNX int8 on box CPU (1k chunks ≈ seconds) → pgvector (included in Supabase) | 🅑 + owned | ★ |
| Captions/summaries at scale | Claude Haiku with Batch API; local LLM for the privacy lane | 🅒 or 🅑 | ★ |
| Converse (chat with artifact) | Claude API with artifact context; answers cite receipts (own retrieval) | 🅒 | ★ |
| PDF render/text/outline | pdf.js (Apache-2.0) | 🅐 | ★ |
| Web-clip freezing | monolith (CC0) on box; readability for reader view | 🅑 | ★ |
| Activity log, lineage, suggestions | Plain schema + UI — no exotic tech anywhere | owned | ★ |



## 3. What you already pay for — and what it covers

Verified July 2026 against official pricing pages.

| MUTHR primitive | Covered by (owned) | Marginal cost |
|---|---|---|
| Job queue | **Supabase Queues (pgmq)** — included, jobs are Postgres rows | $0 |
| Vector search | **Supabase pgvector** — included every tier (index ≤2,000 dims — fine: MiniLM 384, ECAPA 192) | $0 beyond DB disk |
| Object storage + CDN for renditions | **Cloudflare R2** (already in use) | $0.015/GB-mo, **$0 egress**, 10GB free |
| Transcription (cloud lane) | **Workers AI** `whisper-large-v3-turbo` | **$0.0005/min = $0.03/hr**; ~214 min/day rides the free daily neurons |
| Embeddings (cloud lane) | Workers AI `bge-m3` | $0.012/M tokens (10k chunks ≈ $0.03, usually free-tier) |
| LLM summarize/extract/converse | **Claude Haiku 4.5** ($1/$5 per MTok) | **≈ $0.01/artifact**; 1,000-artifact backfill ≈ **$5.20** via Batch (50% off); prompt-cache reads 0.1× |
| Heavy jobs without a studio box | **Cloudflare Containers** on the $5 Workers plan (real Linux containers, ffmpeg-capable, scale-to-zero) | included quotas, per-second beyond — the cloud fallback if the box is down |
| Headless screenshots/PDF of web clips | CF Browser Rendering | 10 min/day free, then $0.09/browser-hr |
| Video delivery *if sharing at scale* | Cloudflare Stream | $5/1k min stored + $1/1k delivered — or DIY HLS on R2 at $0 egress |
| App hosting | Netlify (as today) | hosting only — its functions are glue, not media workers |

**Supabase tier caveats:** the free tier's 500MB database, 1GB storage, and 7-day auto-pause don't fit an always-on MUTHR — assume **Pro ($25/mo, likely already carried)**: 8GB disk, 100GB storage ($0.021/GB after), no pausing. **Edge Functions confirmed unable to run ffmpeg-class binaries** (256MB / 2s CPU) — they're the glue tier; real work happens on the box or in CF Containers.



## 4. Where money genuinely helps (and where it doesn't)

**Money helps (small, optional):**
- **Claude Haiku for the intelligence layer** — ~$0.01/artifact is cheaper than the electricity to match its quality locally; keep local Qwen-14B as the privacy lane, not the default. This is the one metered spend I'd actually turn on day one.
- **A used RTX 3060 12GB (~$200–250 one-time)** if voice volume grows — flips transcription+diarization+local-LLM from coffee-break to minutes-fast, entirely private, no recurring cost.
- **Autodesk APS (~$0.60/F3D translation)** only if the export-STEP-alongside habit proves annoying.
- **AssemblyAI ($0.15/hr, diarization included)** only if sherpa-onnx/pyannote diarization disappoints on your real meeting audio — test local first.

**Money doesn't help:**
- **No transcription subscription** — Workers AI at $0.03/hr and whisper on the Mac both embarrass per-seat transcription products.
- **No DAM/asset-management SaaS** — the entire point of MUTHR.
- **No commercial CAD SDKs** (`.sldprt` geometry) — the preview+open-in-app policy costs $0 and covers the real jobs.
- **No Cloudflare Stream until you're sharing video externally at volume** — private playback of proxies from R2 costs $0 egress.
- **No new queue/orchestration service** — pgmq is included and correct.



## 5. Build order (confidence-first)

Ordered by confidence × payoff, not by card. Each step ships something visible.

1. **Browser-only cards first — no infra at all.** G-code (header parse + embedded thumbnail + viewer), dataset (DuckDB-WASM grid/stats/histograms), vector, image EXIF/palette, gcode settings-diff, sqlite browser, pdf.js reader, mammoth reading view, JSZip free-lunch extraction (3MF plates/settings, pptx text/media, docx media, .pages previews). This is 6 of 11 cards at real usefulness with **zero services beyond what exists** — and it's all ★-confidence code I can write now.
2. **Schema + queue.** `artifacts`/`renditions`/`enrichments`/`derived_from`/`suggestions` tables, pgmq queue, activity log (machine actors included). Still no new spend — it's the Supabase you have.
3. **The studio box, phase 1 (the Mac you own).** Worker polling pgmq outbound-only: ffmpeg probe/proxy/thumbnails, whisper.cpp Metal transcription, sherpa-onnx diarization, ECAPA voiceprints, MiniLM embeddings, Gotenberg/LibreOffice deck+doc rendering with fonts, F3D thumbnails, PrusaSlicer estimates, monolith clipping — and the **Mac hand** (Keynote/Pages AppleScript export). Voice/video/deck/doc cards come alive.
4. **LLM layer, metered.** Haiku for captions/summaries/entities/items with per-artifact cost logging and per-source boost rules; Batch API for backfills. Add the Ollama lane later if a GPU box arrives or privacy demands it.
5. **Printer connectors.** Moonraker/OctoPrint first (open HTTP), Bambu after; outcomes write back to gcode/model cards.
6. **Prototype-before-promising list** (flagged by verification): gcode-preview at 50–100MB · Bambu Production-extension 3MF parse · browser Whisper on non-WebGPU machines · occt-import-js on big STEP assemblies. Each has a fallback already named above.



## 6. Verification notes & sources

Four verification passes, July 2026, all against primary sources (official repos, license files, vendor pricing/docs pages):

1. **Browser/WASM** — ffmpeg.wasm (2GB wasm cap confirmed in FAQ; published core is GPL-built), mediainfo.js (BSD-2, chunked probing), WebCodecs support matrix, tesseract.js v7, transformers.js (WebGPU Whisper at/above realtime for base/small; `allowRemoteModels=false` confirmed for self-hosted weights), exifr (MIT, dormant 2021), three.js loaders (3MFLoader lacks the Production extension Bambu saves by default), occt-import-js (LGPL-2.1, v0.0.x), manifold-3d (Apache-2.0, active 2026), gcode-preview (MIT; 100MB unproven), DuckDB-WASM (MIT, v1.33), SQLite WASM (public domain), pdf.js, mammoth (BSD-2), JSZip/fflate, SheetJS CE (Apache-2.0, CDN-distributed). COOP/COEP on Netlify: supported via headers; only needed for threaded wasm.
2. **Local audio AI** — whisper.cpp MIT (M2 Pro ≈ 5× realtime on large-v3); faster-whisper MIT (large-v3 batched: 13min audio in 17s on 8GB GPU); large-v3-turbo ≈ 6× faster within ~1–2% WER; pyannote community-1 (MIT code, free gated weights, offline after download; AMI DER 17.0); **sherpa-onnx** (Apache-2.0, ~45MB models, CPU-friendly, no gating); speechbrain ECAPA (Apache-2.0, EER 0.8% lab / plan for confirm-loop reality); Ollama structured outputs (schema-constrained JSON); MiniLM/bge-small ONNX int8 ≈ seconds per 1k chunks on CPU. Anchors: Deepgram $0.26/hr prerecorded, AssemblyAI $0.15/hr, OpenAI $0.36/hr.
3. **Owned platforms** — Supabase free/Pro quotas + pause rules, pgmq + pgvector included, Edge Function limits (256MB/2s CPU — no native binaries); R2/Workers/Workers AI/Stream/Containers/Browser-Rendering pricing as tabulated; Claude Haiku 4.5 $1/$5 per MTok, Batch −50%, cache reads 0.1× (Haiku min cacheable prefix 4,096 tok); Autodesk APS Flex ~0.2 tokens (~$0.60) per simple-format translation.
4. **Licenses + hardware** — full table in §1 lane notes: no license blocks private subprocess use; corrections captured (audiowaveform GPL-3, Tweaker-3 GPL-3, klipper_estimator archived 1/2026 — pin, cascadio MIT+OCCT-LGPL); Keynote AppleScript export verified alive through current macOS; studio-box configs benchmarked (M-series / $250 mini PC / +3060); pgmq-over-Supavisor session-mode confirmed as the outbound-only worker pattern (direct connections are IPv6-only without the IPv4 add-on).

Full agent reports with per-claim URLs are preserved in the session transcripts; the load-bearing sources are linked inline throughout the companion docs.


