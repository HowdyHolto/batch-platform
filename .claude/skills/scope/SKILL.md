---
name: scope
description: Turn an articulated idea, framework section, or queue item into spec-ready work packages in docs/specs/. Use when the user says "scope this", "spec this out", "make this buildable", "turn §X into work", or hands over a design/feature idea that should become implementable specs for a later (possibly cheaper-model) session.
---

# Scope — from articulation to spec-ready

You are converting design intent into work packages another session — possibly a smaller model — can execute without re-deriving decisions. The quality bar: **a spec is done when routing it down-tier is safe.**

## Procedure

1. **Read the source material**: the framework section / wave doc / feasibility matrix rows / queue item being scoped, plus `docs/process/ways-of-working.md` (routing rubric, spec-ready definition) and `docs/specs/_TEMPLATE.md`.
2. **Slice by shippable outcome**, not by layer. One spec = one thing a user could see or a system could prove within a few days' work. If a slice needs >1 tier, split it (SPEC-001 splits parser [Sonnet] from viewer [Opus] inside one spec only because they share fixtures).
3. **Check dependencies** against existing specs (`ls docs/specs/`); wire `Depends on` honestly. Prefer specs that can land independently with stubs.
4. **Fill the template completely.** The load-bearing sections:
   - *Implementation notes*: name exact libraries **with the constraints the feasibility doc verified** (license, size, known traps). Don't send a builder to re-research what's already verified.
   - *Acceptance checks*: observable, with fixtures named. "Works" is not a check.
   - *Verification steps*: always include the repo habits — Playwright screenshot, 390px overflow = 0, no console errors, palette validator for new categorical colors, unit tests with committed fixtures.
   - *Tier + lane*: from the ways-of-working rubric; when unsure, one tier up.
5. **Flag judgment gaps.** Anything you'd have to guess about (naming, policy, cross-family ripple) goes to `docs/mother/fable-queue.md` as an entry, and the spec references it as a boundary — don't bake guesses into specs.
6. **Number sequentially** (`SPEC-NNN-slug.md`), status `spec-ready` only if it truly is; otherwise `draft` with the blocking question named.
7. Update nothing else — specs are additive. Commit with a message listing the specs created; push to the session branch.

## Guardrails

- Never restate framework content in specs — link to it. Specs drift; the framework is canonical.
- Every manipulation feature in a spec inherits **mint-never-mutate** and receipts rules implicitly; restate only the check, not the philosophy.
- Privacy lane ordering (browser → box → metered) is policy: a spec that jumps straight to metered must say why in Context.
- If the material being scoped is thin (no framework section exists), stop — that's an Articulate-stage gap; say so and offer to run the articulation first (or queue it for Fable).
