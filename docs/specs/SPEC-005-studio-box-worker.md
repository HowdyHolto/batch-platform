# SPEC-005 · Studio-box worker, phase 1 (media)

| | |
|---|---|
| **Status** | spec-ready |
| **Tier** | Opus |
| **Lane** | 🅑 studio box |
| **Depends on** | SPEC-004 |
| **Framework refs** | muthr-capability-gaps.md G2/G3 · muthr-feasibility.md (studio-box + worker plumbing, audio decision table) |

## Outcome
A worker process on the studio machine (target: the M-series Mac, bare processes) that polls `muthr_jobs` outbound-only and runs the first toolbelt: probe, thumbnails/storyboard, web-safe proxy, waveform peaks, and whisper transcription — writing renditions/enrichments back with named machine actors and tool versions.

## In scope
- TS (or Python — builder's call, document it) daemon: pgmq `read_with_poll` via **Supavisor session mode**, visibility-timeout semantics, per-job-kind handlers, crash-safe re-delivery, structured logs.
- Handlers v1:
  - `probe` — ffprobe JSON → meta (codec/HDR transfer/VFR flag/rotation matrix/GPS) + **browser-safe verdict** input fields.
  - `thumbs` — poster (scene-filtered) + storyboard sprite sheet + WebVTT `#xywh` index (Mux convention) → R2.
  - `proxy` — H.264 High + AAC MP4, tone-mapped SDR from HDR (`zscale`+`tonemap`), honor rotation in output; VideoToolbox HW encode on the Mac.
  - `waveform` — peaks JSON (ffmpeg PCM downmix + peak-pick; audiowaveform optional/GPL-fine).
  - `transcribe` — whisper.cpp Metal, **large-v3-turbo** default, word timestamps; writes `transcript` enrichment (segments with t0/t1/text).
- R2 upload via S3 API with the renditions key convention (`{family}/{artifact}/{kind}/…`); tool + version stamped on every row.
- Cost/duration metering per job into `activity` (source = `worker:{handler}@{version}`).
- `.env`-driven config; `launchd` plist (Mac) for always-on; graceful drain on SIGTERM.

## Out of scope
- Diarization/voiceprints (next phase — sherpa-onnx + ECAPA, own spec), LibreOffice/deck rendering, printer connectors, GPU paths, Cloudflare Containers fallback.

## Acceptance checks
- [ ] Kill -9 mid-job → job redelivered after visibility timeout; no double renditions (idempotency by storage key).
- [ ] iPhone HEVC/HDR fixture: proxy plays in Chrome/Linux, colors not washed out, orientation correct; verdict fields populated.
- [ ] 20-min voice memo transcribed on the Mac in under coffee-break time; segments queryable.
- [ ] Storyboard VTT loads in a stock Video.js hover-preview demo.
- [ ] Box offline for an hour → jobs queue and drain on reconnect; nothing lost.

## Verification steps
- [ ] Integration test against local Supabase + MinIO (R2-compatible) in CI; manual end-to-end on the real box documented in the PR with artifacts/screenshots.

## Notes for the builder
Outbound-only is a hard requirement — no inbound ports, no tunnels. Serialize ffmpeg jobs to 2 concurrent max on a Mac mini. Whisper model files live on-box (`~/.muthr/models`), downloaded once, hash-pinned.
