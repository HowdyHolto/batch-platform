# Fable queue

> Items that need frontier judgment. Any session (any tier) **appends** here instead of guessing; Fable sessions start here. Keep entries short: question · why it ripples · links. Move resolved items to the log at the bottom with the decision.

## Open

1. **Boost economics UX** — per-source rules exist in schema (SPEC-006) but the *user-facing* rules surface (defaults per source, cost visibility, "boost everything from voice memos" toggles) is undesigned. Ripples: every card's L-state, settings IA. Refs: framework §9.1, feasibility §4.
2. **The brain / retrieval architecture** — cards feed "the brain," but memory write policy, cross-referencing, and Converse retrieval (what context, which receipts) are unarchitected. Biggest open design in the system. Refs: framework §4 Converse, Z7.
3. **Calendar/task write-through** — accepted Items → Google Calendar/Reminders: which direction of sync, failure handling, undo. Refs: framework §9.2.
4. **Shared-card policy** — do shared links allow Converse? Which zones travel? Refs: framework §9.4, rule 8.
5. **Voiceprint/face consent UX** — enrollment, per-speaker consent notes, deletion flows; conservative posture drafted but not designed. Refs: framework §5.1, feasibility (faces ⚠).
6. **Bambu Production-extension 3MF parser** — design the own-parser scope (geometry vs settings-only) after prototyping; decides how deep `model` cards go for Bambu projects. Refs: feasibility matrix ◐, browser-verification flag.
7. **gcode-preview at 50–100MB** — prototype outcome decides viewer strategy (decimate vs layer-cap vs server-render fallback). Blocks the last ◐ in SPEC-001.
8. **MUTHR × Batch platform relationship** — same repo, shared Supabase? When does MUTHR split from the shop codebase? Architectural fork-in-road; cheap to decide early, expensive late.

## Resolved

- *(none yet — record decisions here with date + one-line rationale)*
