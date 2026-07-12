# SPEC-004 · MUTHR schema + queue (Supabase)

| | |
|---|---|
| **Status** | spec-ready |
| **Tier** | Opus |
| **Lane** | schema (owned infra) |
| **Depends on** | — (SPEC-001/002/003 can land before or after; they persist once this exists) |
| **Framework refs** | detail-card-system.md §7 · muthr-capability-gaps.md §2, G2, G4, G5 · muthr-feasibility.md (pgmq/Supavisor notes) |

## Outcome
The MUTHR data spine exists in Supabase: artifacts, renditions, enrichments, lineage, suggestions, tags, activity — plus a pgmq job queue a future worker can poll — with RLS on and a seed script proving the round trip.

## In scope
- Migrations for: `artifacts` (family/subkind/title/caption/mime/size/hash/storage_key/source jsonb/captured_at/ingested_at/boost_level/status/meta jsonb) · `renditions` (kind/format/storage_key/dims/duration/pages/tool/tool_version/status) · `enrichments` (kind/status/payload/model/cost_cents) · `derived_from` (parent_id/child_id/op/params/tool/at) · `suggestions` (kind/payload/receipt/status) · `people` (voiceprint_key nullable) · `tags` + `artifact_tags` (source/confidence) · `collections`/`items` · `activity` (artifact_id/actor/**source**/verb/detail/at — machine actors are named actors per framework Z8).
- `pgmq` queue `muthr_jobs` + enqueue trigger on artifact insert (L1 job) + a `jobs_dead` policy.
- pgvector: `embeddings` table (artifact_id, kind, model, vector(384)) with HNSW index — 384-d MiniLM default; separate column strategy documented for ECAPA-192 later.
- RLS: single-owner policies on everything (this is a personal system; keep policies simple and explicit).
- Content-hash uniqueness with dedupe behavior (same hash → new `source` recorded on existing artifact, activity entry, no duplicate row).
- Seed/round-trip script: insert fixture artifact → enqueue → fake-consume → write rendition + activity → read back card-shaped JSON in one query (document that query — it becomes the card loader).

## Out of scope
- The worker itself (SPEC-005), storage upload plumbing UI, sharing/multi-user.

## Acceptance checks
- [ ] `supabase db reset` applies clean; typegen produces types the app imports.
- [ ] Round-trip script passes against a local Supabase stack.
- [ ] Duplicate-hash ingest hits the dedupe path (activity shows "seen again from <source>").
- [ ] Card loader query returns artifact+meta+renditions+enrichments+suggestions in <50ms on 10k-row synthetic data.

## Verification steps
- [ ] Local stack first (`supabase start`), migration + tests in CI-runnable script; **no direct-to-prod migrations**.

## Notes for the builder
Follow the data-model sketch in the framework §7 but treat `renditions` (bytes) vs `enrichments` (JSON) as the load-bearing split (gaps doc §2). `meta` is family-typed JSON — validate shape per family at the edge, not with 19 column sets. Worker connectivity design constraint: consumers connect via **Supavisor session mode** (IPv4) — nothing in the schema may assume LISTEN/NOTIFY.
