---
name: new-family
description: Run the MUTHR detail-card exercise for a new filetype or content type. Use whenever the user names a filetype, format, or content type MUTHR/mother should support (e.g. "what about GPX files", "add email", "we should handle Procreate files", "/new-family epub") — research the family, spec its card, update the docs and capability gaps, prototype the card, and republish the artifact.
---

# New family exercise

You are extending MUTHR's detail-card system with a new file family or subkind. The system is documented in `docs/mother/` — read these before anything else:

1. `docs/mother/detail-card-system.md` — the framework: 8 zones, fixed Intelligence-tab vocabulary, verdict facts, six verbs, boost ladder, consistency rules (§6), current taxonomy (§5).
2. `docs/mother/detail-cards-wave2.md` — the per-family deep-dive template to follow (JTBD → card spec → incumbents → capability dependencies) and the six cross-family patterns.
3. `docs/mother/muthr-capability-gaps.md` — the capability spine and per-family stack tables.

Then run the loop:

## 1 · Classify

Decide: **new family, or subkind of an existing one?** (Check §5 taxonomy. Screenshots are a subkind of image; a new audio format is probably not a new family; email probably IS one.) Subkinds tune modules and facts; families get their own hero, primary verb, and pipeline. When ambiguous, prefer subkind — families must earn their place with a distinct hero + verb + JTBD set.

## 2 · Research (spawn an agent)

Launch one general-purpose agent with WebSearch/WebFetch (10–16 focused fetches, official docs preferred) using this brief structure — it matches the wave-2 reports:

- **A. Detail-screen teardowns** — how do the 3–5 best products present ONE artifact of this type? Hero treatment, first-class vs collapsed metadata, actions, AI features. Source URLs per claim.
- **B. Jobs-to-be-done** — for a maker/product studio (Batch Studio: 3D printing, laser, product photography, wholesale): what does the owner DO from this card?
- **C. Capability stack** — extraction (incl. **embedded metadata/thumbnails** — always check what's free inside the file), preview/render tooling (web-embeddable), enrichment (ML), light manipulation verbs (with reliable-vs-risky judgments), hosted alternatives.
- **D. Gotchas** — proprietary opacity, huge files, fidelity traps, browser support.

## 3 · Spec the card (the framework checklist, §6)

Choose: hero (interactive, never a dead thumbnail) → 4–6 facts **including one verdict** (✓/⚠ "will this work where I'm about to use it", computed against a registry) → one primary verb (spacebar) → ≤3 type verbs → Intelligence tabs **from the fixed vocabulary only** (Transcript · Summary · Text · Items · Entities · Schema · Dependencies · Changes) → capture affordances (anchored to a coordinate system: timestamp/page/layer/xyz/range) → manipulation verbs (**mint versions, never mutate** — each gets a `derived_from` edge) → L1/L2 enrichers (exhaust embedded metadata before spending ML tokens).

## 4 · Write it down

- Append the deep-dive to the current wave doc (or start `detail-cards-wave3.md` mirroring wave 2's structure) with sources inline.
- Update `detail-card-system.md`: §5 entry (keep it brief, link the deep-dive), family count in §6, rollout tier in §8. Only extend the Z5 tab vocabulary if genuinely no existing tab fits — that should be rare.
- Add the family's stack table to `muthr-capability-gaps.md` §4 (columns: Capability | Tooling | What it yields | Effort S/M/L, ◇ = hosted shortcut).
- Update `docs/mother/README.md` if a new doc was created.

## 5 · Prototype the card

Canonical source: `docs/mother/prototypes/detail-cards.html` (a full standalone HTML file). Add a new `<section class="card-section" id="...">` following the existing cards *exactly*:

- Zone-tagged cells (`Z1 HERO … Z8 RECORD`), identity strip with ✦ AI caption + boost dots, stat-block facts row, actions bar (`btn-primary` + `kbd space`, `btn converse` ✦ Prompt), Intelligence tabs (`data-tabs` wiring is generic), tags with auto-dot, connections + record strips.
- Design tokens are in the `:root` block (charcoal `#221f1d`, linen `#efede6`, bronze/saffron/mint accents, dashed hairlines). Validated categorical trio for any multi-series coloring: `#e2711d / #3fa46e / #5e8fc7` (CVD-checked on the dark surface). Light "paper" surfaces use `#eae7de` with darker author colors (`#a34d0e`, `#38648f`).
- Ground the sample content in Batch Studio's world (Magpod, PETG, walnut+brass, wholesale) — real-feeling, never lorem.
- Generative previews are canvas-drawn with the seeded `rng()` helper (never `Math.random()`), registered in `drawAll()`.
- Add the card to the sticky jump nav and bump the masthead card count.

**Verify before shipping:** render with Playwright (`executablePath: '/opt/pw-browsers/chromium'`), screenshot the new section, check zero page errors and **zero horizontal overflow at 390px** (`document.documentElement.scrollWidth - clientWidth`). Watch for the known trap: `aspect-ratio` boxes inside grid tracks need `minmax(0, 1fr)`.

## 6 · Republish the artifact

The artifact wants **body-content-only** (no doctype/html/head/body wrapper). Derive it from the repo file:

```bash
python3 - <<'EOF'
s = open('docs/mother/prototypes/detail-cards.html').read()
s = s.split('<body>', 1)[1].rsplit('</body>', 1)[0]
open('/tmp/detail-cards-body.html', 'w').write(s.strip())
EOF
```

Publish with the Artifact tool, favicon `🗂️`, **and pass the existing URL so the link stays stable**:
`url: https://claude.ai/code/artifact/9ceb597a-e623-4b8d-b962-9a60bc776dd7`
(Without `url`, a new conversation mints a new address. Load the artifact-design and dataviz skills before building if this session hasn't already.)

## 7 · Commit and push

Commit docs + prototype together with a message naming the family; push to the session's designated branch.

## Guardrails

- Never reorder zones, invent tab names, or exceed 6 facts — familiarity is the product.
- Machine voice stays legible: ✦ captions, dotted auto-tags, suggestions with receipts and explicit Accept/Dismiss.
- Proprietary formats get the honest treatment: embedded preview + best-effort text + open-in-app + Mac-hand export nudge. Never promise server-side rendering of Apple/Autodesk/SolidWorks natives.
- If the user only wants the thinking (no UI yet), stop after step 4 and say the prototype is one command away.
