# SPEC-006 · Intelligence layer v1 (caption · summary · entities · items)

| | |
|---|---|
| **Status** | spec-ready |
| **Tier** | Opus (prompt/schema design matters) |
| **Lane** | 🅒 metered (Claude Haiku) with 🅑 local-LLM interface stubbed |
| **Depends on** | SPEC-004 (persists enrichments/suggestions); best after SPEC-005 (transcripts to chew on) |
| **Framework refs** | detail-card-system.md §4 (suggestions, receipts, boost ladder) · muthr-feasibility.md (Haiku pricing, Batch, local-LLM quality) |

## Outcome
Any artifact with extracted text/transcript can be boosted to L3: a one-line ✦ caption, a summary, entities, and **Items (todos/events/follow-ups) each carrying a receipt** — with per-artifact cost logged and per-source rules gating what runs automatically.

## In scope
- A single `enrich(artifact, kinds[])` service (runs on the box or as a script) calling Claude **Haiku 4.5** with strict JSON schemas per kind; receipts required in the schema (segment id / page / clause / timestamp — reject outputs without them).
- Prompt templates per family group (voice/meeting, doc/contract, video, generic) — templates live in-repo, versioned; model + template version stamped on the enrichment row.
- **Suggestions pipeline**: items land as `suggestions` rows (`pending`), never auto-create anything external (framework rule).
- Cost metering: tokens in/out × price table → `cost_cents` on the enrichment + running total per artifact; **Batch API** path for backfills (50% off).
- Per-source boost rules table (`boost_rules`: source pattern → max auto level, allowed kinds) enforced before any call — the privacy gate.
- `LocalLLM` interface (same signatures) with an Ollama implementation stubbed + one working example (Qwen-14B via structured outputs) behind a flag — the privacy lane exists from day one even if off by default.

## Out of scope
- Converse/chat UI, embeddings (separate small spec), calendar/task write-through (framework §9 open question), retrieval across the brain.

## Acceptance checks
- [ ] Kitchen-session-style transcript fixture yields: caption ≤140 chars; summary with the 3 decisions; ≥2 items with correct timestamps as receipts; total cost logged and ≈ $0.01 ± 50%.
- [ ] Contract fixture: amounts/parties extracted; an entity inside a tracked change is flagged `in_flux`.
- [ ] A source with `max_auto_level=1` never triggers a call (test asserts zero API invocations).
- [ ] Malformed model output → retried once with repair prompt, then failed-status enrichment; card renders honestly without the tab.
- [ ] Batch path processes 20 fixtures in one batch job.

## Verification steps
- [ ] Golden-file tests on prompts (fixtures in, schema-validated JSON out — record/replay so CI needs no API key) · cost table unit-tested against the pricing doc.

## Notes for the builder
Receipts are the product — an item without a receipt is a bug, not a style choice. Keep schemas flat; extract in passes (summary pass, items pass) rather than one mega-call; cache the shared system prompt only if >4,096 tokens (Haiku's min cacheable prefix).
