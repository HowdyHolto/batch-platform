# Ways of working — the model cascade

> How work moves through this repo: **Articulate → Scope → Produce → Verify → Review**, with each stage routed to the cheapest model tier that can hold it.

## The operating model

One person (Holt) + a cascade of Claude tiers. The scarce resource is **frontier judgment** (Fable-class time); the abundant resources are **execution** (Opus/Sonnet-class) and **verification** (scripts, screenshots, validators — model-free). The system's job is to convert scarce judgment into durable artifacts (docs, specs, skills, checklists) that let cheaper tiers execute without re-deriving decisions.

```
ARTICULATE ──► SCOPE ──────► PRODUCE ─────► VERIFY ─────► REVIEW
voice memo,    specs from    implementation  harness-      periodic
research,      frameworks    against spec    enforced      coherence
frameworks,    (/scope)      + checklists    checks        audits
architecture
[Fable]        [Fable/Opus]  [Opus/Sonnet]   [any + CI]    [Fable]
```

Every stage hands the next a **written artifact**: Articulate produces framework docs; Scope produces specs (`docs/specs/`); Produce produces PRs referencing the spec; Verify produces evidence (screenshots, check output) in the PR; Review produces queue items and framework amendments.

## Routing rubric

Route by what makes the task hard, not by how important it feels.

| Task shape | Tier | Why |
|---|---|---|
| Fuzzy intent → structure (a voice memo into a taxonomy); multi-agent research + synthesis; design-system evolution; schema/architecture changes that ripple across families; `/new-family` runs; coherence audits; rescue debugging after 3 failed rounds | **Fable** | Judgment density: absorbing ambiguity, holding the whole system, fewer wrong turns per autonomous hour |
| Feature builds against a spec; systems integration (ffmpeg/LibreOffice/printer connectors); nontrivial debugging; writing new specs from an existing framework section; prompt/schema design for the intelligence layer | **Opus** | Excellent execution + solid judgment; the default builder |
| Well-specified implementation with acceptance checks; mechanical sweeps (rename, extract, port a pattern to a new card); test writing against defined behavior; doc formatting | **Sonnet** | Fast and cheap where the thinking is already done |

**Axes** (the user's own framing): *creativity* ↑ or *research breadth* ↑ or *cross-cutting complexity* ↑ → route up. *Specification completeness* ↑ → route down. A perfect spec is what makes routing down safe.

## Escalation & de-escalation

- **3-strikes rule:** three failed attempts at the same bug/task in one session → stop, write down what's known, escalate one tier (or to the Fable queue if architectural).
- **Ripple rule:** if a change touches ≥3 families, the zone system, the tab vocabulary, or the `derived_from` model → it's an Articulate-stage question. Queue it (`docs/mother/fable-queue.md`), don't improvise it.
- **Waste rule:** don't spend Fable time typing code a spec already describes — spend it on the queue. Conversely, don't ask Sonnet to invent a framework — that's how drift starts.
- **New filetype** → `/new-family` (Fable-preferred; Opus acceptable with the skill's guardrails).

## Definition of spec-ready

A spec can be routed to Produce when it has: outcome (one sentence) · framework references (sections, not vibes) · in/out of scope · concrete acceptance checks (runnable or observable) · verification steps (the screenshot/overflow/palette/test habits) · lane + tier recommendation · dependencies. Template: [`docs/specs/_TEMPLATE.md`](../specs/_TEMPLATE.md). The `/scope` skill produces these.

## Session hygiene (any tier)

1. Boot from root `CLAUDE.md` (doc map, rules, conventions live there).
2. Work against a spec when one exists; update its status header as you go.
3. Verify before declaring done — the habits are in each spec and in `CLAUDE.md`.
4. Commit + push before ending; work dies in ephemeral sessions otherwise.
5. Anything that needed judgment you didn't feel licensed to exercise → append to `docs/mother/fable-queue.md` with context, instead of guessing.

## Review cadence

When Fable time is available, spend the first session on the queue + a coherence audit: *"Read docs/mother/fable-queue.md and the diffs since the last audit tag; check them against detail-card-system.md rules; fix drift or amend the framework deliberately."* Tag the repo `audit/YYYY-MM-DD` after each pass so the next audit has a baseline.
