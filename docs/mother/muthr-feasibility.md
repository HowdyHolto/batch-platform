# MUTHR — feasibility & build-vs-buy

> Every capability the eleven prototype cards promise, sorted by **where it can run** and **what it costs** — verified against licenses, browser reality, and current pricing (July 2026).
> Companions: [`muthr-capability-gaps.md`](./muthr-capability-gaps.md) (what to build) · [`detail-cards-wave2.md`](./detail-cards-wave2.md) (why).

<!-- HEADLINE -->

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

<!-- LANES_DETAIL -->

## 2. Per-card feasibility matrix

Legend: 🅐 browser · 🅑 studio box · 🅒 metered · ★ = I'd build this with high confidence today · ◐ = workable, needs integration effort · ⚠ = genuinely hard or gated (noted why).

<!-- MATRIX -->

## 3. What you already pay for — and what it covers

<!-- ALREADY_PAYING -->

## 4. Where money genuinely helps (and where it doesn't)

<!-- MONEY -->

## 5. Build order (confidence-first)

<!-- BUILD_ORDER -->

## 6. Verification notes & sources

<!-- SOURCES -->
