# mother — Detail Card System

> A framework for artifact detail cards: one skeleton, many organs.
> Companion research: [`detail-card-research.md`](./detail-card-research.md) · Visual prototype: [`prototypes/detail-cards.html`](./prototypes/detail-cards.html)

---

## 1. The problem

mother ingests everything — voice memos, music, samples, photos, screenshots, vectors, videos, PDFs, notes, spreadsheets, databases, project files, archives, bookmarks. When you open any one of those artifacts, you land on a **detail card**.

Two failure modes to avoid:

1. **One generic card for everything** — a filename, a size, a date, a gray icon. Technically consistent, contextually worthless. (This is Finder's Get Info.)
2. **A bespoke screen per type** — every card its own app. Contextually rich, but the user re-learns the UI on every artifact, and every new file type is a ground-up build.

The answer is a **skeleton/organ system**: every card shares one fixed anatomy (same zones, same order, same visual grammar), and each file family supplies type-specific *modules* that slot into those zones. Familiarity comes from the bones; value comes from the organs.

---

## 2. Design principles

1. **Same bones, different organs.** Zones never reorder. A voice memo and a database feel like siblings, not strangers — but each shows what matters for *it*.
2. **The content is the hero.** The single most valuable region of every card is a rich preview of the thing itself — not metadata about it. Every type gets the best preview we can render, and it's interactive (play, zoom, scrub, query), never a dead thumbnail.
3. **First-class facts, then the long tail.** Each type earns 4–6 headline facts (duration, BPM, dimensions, pages, rows × cols). Everything else — full EXIF, codec internals, hashes — lives behind "All metadata." Never make the user scan 40 rows to find the one that matters.
4. **Every artifact is conversable.** "Prompt against this" is a universal affordance, not a PDF feature. The chat context = the artifact + everything mother has extracted from it.
5. **Capture beats classify.** Humans add context (a note, a tag, a speaker's name, a link to a project) in one tap; the machine does the classifying. Every human capture is training signal.
6. **Cards get smarter over time.** Enrichment (boost) is visible and progressive. A card is never "done" — it upgrades in front of you: transcript appears, speakers get named, todos surface, connections form.
7. **Everything feeds the brain — with receipts.** Anything mother learns or suggests links back to its source (this timestamp in this recording, this cell in this sheet). Memory with provenance.

---

## 3. Anatomy — the eight zones

Every detail card is a bento grid of modules (visually: `GridBlock`s — dashed hairline borders, tag labels, accents from the brand palette). The zones and their order are **fixed**; the modules inside them vary by type.

```
┌─────────────────────────────────────────────┬───────────────────┐
│  Z1  HERO                                   │  Z2  IDENTITY     │
│  preview / player / visualization           │  type · title     │
│  (the type's richest interactive render)    │  caption · source │
│                                             │  dates            │
├──────────┬──────────┬──────────┬────────────┼───────────────────┤
│  Z3  FACTS — 4–6 type-specific stat blocks  │  Z4  ACTIONS      │
├──────────┴──────────┴──────────┴────────────┤  primary verb +   │
│  Z5  INTELLIGENCE                           │  universal verbs  │
│  tabs: Transcript · Summary · Text ·        ├───────────────────┤
│  Items · Entities · Schema · Dependencies   │  Z6  CONTEXT      │
│  (only the tabs that apply)                 │  tags · project · │
│                                             │  notes            │
├─────────────────────────────────────────────┼───────────────────┤
│  Z7  CONNECTIONS                            │  Z8  RECORD       │
│  related artifacts · people · timeline      │  activity · vers. │
│                                             │  all metadata     │
└─────────────────────────────────────────────┴───────────────────┘
```

### Z1 — Hero (type module)
The interactive preview. Waveform, player, zoomable image, schema explorer, file tree. Full-bleed inside its block. If we can't render content yet (unsupported/processing), the hero shows the enrichment state — never a blank gray box.

### Z2 — Identity (universal, type-flavored)
- **Type badge** — icon + family chip (`VOICE`, `TRACK`, `IMAGE`, `DATASET`…), format chip (`m4a`, `svg`, `sqlite`).
- **Title** — editable inline. Default = best available (ID3 title > filename > AI caption).
- **AI caption** — one machine-written sentence: *"Kitchen conversation about the Magpod launch timeline, 3 speakers."* Distinct styling so it never masquerades as human input.
- **Provenance** — where it came from: device / app / integration / person / watch-folder, plus original path or URL. Captured-at vs ingested-at vs modified-at.

### Z3 — Facts (type module)
4–6 stat blocks in the homepage idiom (big light number, small uppercase label). These are *chosen per type* — the facts a human actually asks about. Tappable facts filter the library (tap `BPM 92` → other 90–94 BPM material).

### Z4 — Actions (universal + type verbs)
- **Primary verb** — one per type, always the same position: Listen / Play / View / Watch / Read / Query / Open. Spacebar triggers it.
- **Universal verbs** — Prompt (chat), Share, Boost, Add-to (project/collection), Export/Download, Open-in, Archive.
- **Type verbs** — up to 3 extras (e.g., *Name speakers*, *Copy text*, *Export PNG @2x*, *Run query*).

### Z5 — Intelligence (type module, fixed tab vocabulary)
Everything the machine extracted, in tabs drawn from a **fixed vocabulary** — types pick which apply, never invent new ones:

| Tab | Contents | Appears on |
|---|---|---|
| **Transcript** | diarized, timestamped, speaker-colored, searchable | voice, video, music-with-vocals |
| **Summary** | TL;DR + key points, regenerate control | anything with content |
| **Text** | OCR / extracted raw text, copyable | image, screenshot, PDF, video frames |
| **Items** | detected todos, calendar events, follow-ups, decisions — each with accept/dismiss | voice, video, docs, email |
| **Entities** | people, places, orgs, products, dates | anything with content |
| **Schema** | tables, columns, types, stats | dataset, database, spreadsheet |
| **Dependencies** | linked assets, fonts, samples, referenced files | project files, code, archives |

### Z6 — Context & capture (universal)
- **Tags** — user tags and auto tags, visually distinct (auto tags carry a confidence dot; confirming one promotes it). One-tap add.
- **Project / collection** membership.
- **Notes** — freeform, always one tap away. This is the "add context" surface; notes are indexed and feed retrieval.
- **Custom fields** — per-type or per-project (e.g., `license`, `client`, `print-profile`).

### Z7 — Connections (universal, machine-fed)
- **Related artifacts** — same session/day/place, same project, semantically similar, explicitly linked.
- **People** — speakers, faces, authors, senders → person pages.
- **Timeline strip** — what was captured just before/after this.
- **Usage as signal** — opens, plays, queries, and citations are tracked per artifact and feed both ranking and this zone ▸(Amundsen ranks tables page-rank-style by query usage — the things you actually use surface first).

### Z8 — Record (universal)
- **Activity** — every entry records **what changed · source · actor · when**, and machine actors are named like human ones ("Transcriber L2", "Speaker-ID", "Boost") ▸(Brandfolder's Asset History Log attributes changes to Auto-Tagging and Asset Automations alongside users — AI provenance logged like human edits).
- **Versions** — edits and re-ingests, diffable where possible.
- **All metadata** — the exhaustive table (full EXIF, codec params, hashes, storage key). Collapsed by default — but **collapsed ≠ unindexed**: every field here remains searchable ▸(Brandfolder collapses EXIF/OCR into a tab yet indexes all of it for anyone's search).
- **Storage** — where the bytes live (R2 key, original location), integrity hash.

---

## 4. The six verbs (interaction model)

Every card supports six verb families. Types differ only in *how* each verb manifests:

| Verb | What it means | Examples |
|---|---|---|
| **Consume** | experience the content | listen, watch, view, read, browse, query |
| **Capture** | add human context | title, note, tag, highlight, name a speaker, link |
| **Enrich** | deepen machine understanding (boost) | transcribe, OCR, diarize, summarize, cross-ref |
| **Act** | do something outward | share, export, open-in, create todo/event, send |
| **Converse** | prompt against the artifact | "what did we decide about pricing?" |
| **Connect** | wire it into the graph | link to project/person/artifact, merge duplicates |

### Capture is anchored
Notes, highlights, and comments attach to a **coordinate inside the content** — timestamp, page, cell, region — by default, with an explicit toggle to detach for file-level remarks ▸(Frame.io anchors comments to timecode/pagestamp by default; detaching is the deliberate act). Every anchored capture gets **dual representation**: a card in the panel *and* a marker on the content itself (scrubber bubble, page-rail tick, cell badge). Range captures (a span of audio, a page range) become a playback/reading window when tapped. And capture verbs also surface **at the selection**: highlight transcript or document text → clip / todo / copy / comment right there ▸(Fireflies' highlight-to-soundbite).

### Converse, concretely
The prompt affordance opens a **docked, collapsible companion panel** scoped to this artifact — it persists across Intelligence tabs, never a modal ▸(Otter Chat + Outline + Comments share a persistent right panel; Fireflies embeds AskFred per-meeting). It opens **pre-populated** — the caption/summary plus 2–3 suggested prompts derived from the content — never an empty box ▸(Acrobat AI scans the doc on upload and leads with an overview + suggested questions). Answers **cite positions** (timestamp, page, cell) and tapping a citation highlights the receipt in the hero ▸(Acrobat's numbered citations highlight the source passage). Context = artifact + all its enrichments + its notes.

### Boost ladder (enrichment states)
Visible on every card as a compact state indicator:

- **L0 Ingested** — bytes stored, hashed, format sniffed.
- **L1 Fingerprinted** — thumbnails/waveform/preview rendered, core metadata parsed (EXIF/ID3/schema headers), auto-filed.
- **L2 Extracted** — content pulled out: transcript, OCR, text layer, schema + column stats, dependency list.
- **L3 Understood** — summary, entities, topics, items (todos/events), captions, quality signals.
- **L4 Connected** — cross-referenced against the brain: people resolved, projects suggested, related artifacts linked, memories written.

L0–L1 run at ingest for everything. L2–L4 run automatically for high-value types (voice, screenshots, docs) and on-demand ("Boost") for bulk types — with per-source rules the user can set ("always fully boost voice memos; never auto-transcribe music").

### Suggestions (the scanners)
L3 detection produces **suggestion chips rendered inside the Items tab and as a banner** when high-confidence: *"2 possible calendar events · 3 todos"*. Each suggestion:

- shows its receipt (the transcript span / cell / sentence it came from — tap to jump),
- has explicit **Accept / Edit / Dismiss** controls (accepted → creates the todo/event in mother and, if connected, external calendar/task apps),
- learns: dismissals tune future thresholds per user.

Nothing auto-creates externally without acceptance. mother's own memory ingestion (L4) is automatic but always attributed and reversible.

---

## 5. Type modules — the contextual layer

The taxonomy has two levels: **family** (drives the card layout) and **subkind** (tunes modules and facts within it). Below, each family's spec: Hero, Facts, primary verb, Intelligence tabs, type verbs, and capture affordances.

Patterns marked ▸ cite an app precedent. Their evidence status (verified / observed / design intent) is tracked per family in the [companion research doc](./detail-card-research.md).

---

### 5.1 Voice recording (`voice`) — memos, meetings, calls
*Subkinds: memo, meeting, call, dictation.*

- **Hero:** waveform scrubber with **speaker-colored segments** ▸(Otter's diarized timeline); playhead follows a live **synced transcript** that highlights word-by-word ▸(Voice Memos '26, Descript). Skip-silence and 1–2× speed controls on the player.
- **Facts:** duration · speakers · captured (when) · where (if location) · device/source · words.
- **Primary verb:** **Listen** (with transcript follow).
- **Intelligence tabs:** Transcript · Summary · Items · Entities. **Digest-first:** once L3 lands, `meeting`/`call` subkinds default to the Summary tab with the transcript one tab away ▸(verified: Otter leads with the Summary tab; Fireflies gives center screen to the AI summary — the raw content backs the digest, not vice versa). Short `memo`s stay transcript-first.
- **Selection actions:** highlighting transcript text surfaces clip / todo / copy / comment at the selection ▸(Fireflies' highlight-to-soundbite).
- **Speakers module (the signature feature):**
  - Chips per detected speaker: `Speaker 1 (14 min)` → tap → **Name this speaker** with typeahead against known people.
  - Once named, mother stores a **voiceprint** and *suggests* the identity on future recordings: "Sounds like Danny — confirm?" Confirmation is always explicit; voiceprints are user-deletable (this is sensitive biometric data — opt-in, local to the user's brain, never shared).
  - Naming a speaker retro-labels their segments everywhere and links the artifact to the person page.
- **Scanners:** todos ("I need to…", "let's get…"), calendar intents (date/time + commitment), decisions, follow-ups ▸(Otter verified: mines action items and auto-assigns them from conversation content). Surfaced as accept/dismiss chips with jump-to-timestamp receipts. **Note:** transcript→calendar-event extraction produced *no* surviving claims for any incumbent in the research pass — the calendar scanner is differentiation, not table stakes.
- **Type verbs:** Name speakers · Share clip (time-range) · Export transcript.
- **Capture:** correct transcript inline (feeds retraining), highlight a passage (becomes a quotable memory), tag moments at timestamps.

### 5.2 Music track (`track`)
*Subkinds: song, album, mix/DJ set, podcast episode.*

- **Hero:** artwork-forward player ▸(Spotify/Apple Music: art is the emotional anchor) with a slim waveform underneath ▸(SoundCloud) for scrubbing.
- **Facts:** artist · album/year · duration · BPM · key · format/bitrate.
- **Primary verb:** **Play** (queue-aware).
- **Intelligence tabs:** Summary (what/why it's here) · Transcript (lyrics, if vocal) · Entities (credits ▸ Spotify's songwriter/producer credits panel).
- **Enrichment:** audio fingerprint → identify unknown files (fills artist/album/art automatically); BPM/key analysis; similar-in-library by sound.
- **Type verbs:** Add to playlist · Open in player/DAW · Trim to sample.
- **Capture:** rating, mood/use tags ("video-bed", "reference-mix"), license note.

### 5.3 Sample / loop (`sample`)
*Own family, not a `track` subkind — producers ask different questions.*

- **Hero:** fat waveform, **loop-play on hover/tap**, sync-preview at project BPM ▸(Splice's browse-audition loop).
- **Facts:** BPM · key · length (bars) · instrument/type (one-shot vs loop) · sample rate/bit depth.
- **Primary verb:** **Audition** (looped).
- **Type verbs:** Drag-to-DAW · Pitch/tempo preview · Find similar sounds.

### 5.4 Image — photo (`image`)
*Subkinds: photo, scan, artwork/render.*

- **Hero:** full-bleed zoomable image (pinch/scroll), long-press to peek at 1:1.
- **Facts:** dimensions · captured date · camera + lens · location (tappable map chip ▸ Photos/Google Photos info sheet) · size/format.
- **Primary verb:** **View** (fullscreen).
- **Intelligence tabs:** Text (OCR) · Entities (people/objects/scenes) · Summary (auto-caption).
- **Modules:** EXIF capture-settings strip (ISO · f-stop · shutter · focal ▸ Lightroom's info panel); **palette** — 5–6 dominant swatches, tap to copy hex, tap to find same-palette artifacts; faces row → person pages; duplicates/near-duplicates alert.
- **Type verbs:** Edit · Copy text · Export sizes · Set as cover.
- **Capture:** name faces (same consent model as voiceprints), caption, favorite.

### 5.5 Image — screenshot (`screenshot`)
*Screenshots are not photos — they're captured information.*

- **Hero:** the image, but **OCR text is the co-star** — selectable directly on the image.
- **Facts:** source app (detected) · captured date · device · dimensions · detected links.
- **Intelligence tabs:** Text (first-class) · Items (todos implied by content) · Entities · Summary.
- **Enrichment:** detect source app/site, extract URLs (make them live), find UI text, link to the project you were working on at capture time.
- **Type verbs:** Copy all text · Open detected link · Stitch (combine multi-shot scrolls).

### 5.6 Vector (`vector`) — SVG, AI, EPS
- **Hero:** rendered preview on a **toggleable background** — dark / light / checkerboard ▸(icon-manager pattern; a white logo on a white card is invisible) — with free zoom (it's a vector; show off infinite crispness).
- **Facts:** viewBox/dimensions · artboards · colors used (swatch row) · paths/points · fonts referenced · size.
- **Primary verb:** **View** (zoom playground).
- **Intelligence tabs:** Text (text elements within) · Summary (auto-describe subject) · Dependencies (fonts, linked rasters).
- **Type verbs:** Export PNG @1×/2×/4× · Copy SVG code · Recolor (swap palette non-destructively).
- **Capture:** subject tags ("logo", "icon/arrow"), brand link.

### 5.7 Video (`video`)
*Subkinds: recording, screen-recording, produced/edit, clip.*

- **Hero:** player with **hover-scrub thumbnails** and chapter ticks ▸(YouTube); filmstrip of keyframes below.
- **Facts:** duration · resolution · fps · codec · captured date · size.
- **Primary verb:** **Watch**.
- **Intelligence tabs:** Transcript (timestamped, diarized if speech) · Summary · Items · Entities (faces/objects/scenes) · Text (on-screen OCR — critical for screen recordings).
- **Modules:** auto-chapters from scene/topic detection; **timecoded comments/notes** ▸(Frame.io — a note pinned to 02:14, not to the file).
- **Type verbs:** Clip & share range · Extract frame · Extract audio.

### 5.8 Document (`doc`) — PDF, Word, Pages
- **Hero:** cover page + page-thumbnail rail ▸(Acrobat/Preview); toggle to continuous **reading view**. Heterogeneous formats normalize to **one canonical render pipeline** per family — docx/pptx/rtf render through the same PDF-like pipeline rather than bespoke viewers ▸(Acrobat AI converts DOCX/PPTX/TXT/RTF to PDF before chat).
- **Facts:** pages · words · author · created/modified · language · format.
- **Primary verb:** **Read**.
- **Intelligence tabs:** Summary · Text · Items (deadlines, obligations — think contracts) · Entities (parties, amounts, dates).
- **Modules:** document outline/TOC (from headings or bookmarks); highlights list (yours + AI-suggested key passages).
- **Type verbs:** Chat with doc (Converse, pre-focused ▸ NotebookLM/Acrobat AI: answers cite page + snippet) · Annotate · Export text.
- **Capture:** highlights become quotable memories with page receipts.

### 5.9 Text / note (`text`) — md, txt, rtf, clipped articles
- **Hero:** rendered reading view (markdown rendered, code fenced, links live).
- **Facts:** words · read time · created/modified · source (clipped from URL?) · format.
- **Primary verb:** **Read**.
- **Intelligence:** Summary · Entities · Items; backlinks (which notes/artifacts reference this).
- **Type verbs:** Edit in place · Append note · Publish/share.

### 5.10 Spreadsheet / CSV / dataset (`dataset`)
- **Hero:** **live sample grid** (first ~50 rows, virtualized) with typed column headers; each column header carries a **mini stat** — histogram for numerics, top-values bar for categoricals, null % ▸(Kaggle's dataset column panels — the single best "understand this data fast" pattern on the web).
- **Facts:** rows × columns · sheets · size · encoding/delimiter · completeness %.
- **Primary verb:** **Query** (natural-language ask → table/chart answer, with the generated query visible).
- **Intelligence tabs:** Schema (columns, types, stats, anomalies) · Summary ("what is this data") · Items (detected date columns → potential calendar relevance).
- **Type verbs:** Ask this table · Quick chart · Export filtered.
- **Capture:** column descriptions (they compound — future queries get smarter).

### 5.11 Database (`database`) — SQLite, db dumps
- **Hero:** **schema explorer** — table list with row counts; select a table → sample rows + column stats (reuses the dataset module); relationship mini-map (inferred FKs).
- **Facts:** engine · tables · total rows · size · last modified.
- **Primary verb:** **Query** (NL → SQL, query shown, read-only by default).
- **Intelligence tabs:** Schema · Summary · Dependencies (cross-table relations).
- **Type verbs:** Browse table · Run SQL · Export table → dataset artifact.

### 5.12 Project file (`project`) — the maker family
*Subkinds: design (.fig/.psd/.ai/.sketch), DAW (.als/.logicx/.flp), CAD (.f3d/.step/.dwg), 3D-print (.3mf/.stl/.gcode), video-edit (.prproj/.fcpbundle).*

- **Hero:** best embedded render/thumbnail; **STL/3MF/STEP get a real orbitable 3D viewer** ▸(Printables/MakerWorld — rotating the model *is* the preview); gcode gets a toolpath/layer preview.
- **Facts (by subkind):**
  - design: artboards/pages · app + min version · linked assets · fonts
  - DAW: BPM · tracks · length · plugins used · sample refs
  - CAD/3D: dimensions · volume · triangles · units
  - gcode: est. print time · filament g/m · layer height · nozzle/bed temps ▸(slicer summary blocks)
- **Primary verb:** **Open in [app]** (deep-link; mother knows the owning app + version).
- **Intelligence tabs:** Dependencies (the killer module — which linked assets/fonts/samples exist *in mother*, which are missing) · Summary · Text (extractable layer/track names).
- **Modules:** version/thumbnail history (visual diff of saves ▸ Fusion 360/Onshape version lists); print history for 3D (times printed, settings used, success notes — *the maker's lab notebook*).
- **Type verbs:** Collect dependencies · Export preview · (3D) Send to slicer/printer.
- **Capture:** build notes, settings that worked, client/project link.

### 5.13 Archive (`archive`) — zip, tar, dmg
- **Hero:** expandable **file tree** with per-entry type icons and sizes; tap an entry → inline Quick-Look-style peek.
- **Facts:** entries · unpacked size · compressed size (ratio) · encrypted? · format.
- **Primary verb:** **Browse**.
- **Type verbs:** Extract selected · **Ingest contents** (fan out entries into real artifacts, archive becomes their provenance parent) · Peek entry.

### 5.14 Code / repo snapshot (`code`)
- **Hero:** rendered README, else annotated file tree ▸(GitHub's repo page: README *is* the detail card).
- **Facts:** languages (breakdown bar) · files · LOC · last commit · license.
- **Primary verb:** **Browse**.
- **Intelligence tabs:** Summary (what this project does) · Dependencies (manifests parsed) · Entities.
- **Type verbs:** Open in editor · Copy clone path.

### 5.15 Bookmark / web clip (`link`)
- **Hero:** reader-mode capture (frozen at save time) with original screenshot toggle.
- **Facts:** domain · saved date · read time · author/published · alive? (link-rot check).
- **Primary verb:** **Read** (the frozen copy — mother owns the content even if the page dies).
- **Intelligence tabs:** Summary · Entities · Items.

### 5.16 Fallback (`blob`) — anything unrecognized
Never a dead end: hex/text peek if plausible, full universal layer (provenance, tags, notes, prompt, share), and a visible path to support — "We don't understand `.xyz` yet — boost it anyway and mother will OCR/parse what it can."

---

## 6. Consistency rules

What keeps 16 families feeling like **one product**:

1. **Zones never reorder.** A module may be absent; its zone collapses. Nothing ever moves.
2. **One primary verb per family**, always in the same position, always on spacebar.
3. **Facts are always the stat-block idiom** — big light value, small tracking-caps label (the homepage's `1 / AT A TIME` blocks). 4–6, never more.
4. **Intelligence tabs come from the fixed vocabulary** (Transcript, Summary, Text, Items, Entities, Schema, Dependencies). New file type ≠ new tab names.
5. **Auto vs human is always legible.** AI captions, auto-tags, and suggestions have one consistent visual treatment (confidence dot + distinct hue); confirming promotes them to human-weight.
6. **Every suggestion shows its receipt** and every acceptance is explicit.
7. **Same component kit everywhere:** GridBlock, stat block, chip, tag, list row, tab bar, player shell. A new family is a *composition*, not new components.
8. **Cards are shareable views.** Share renders the same card (minus private zones — notes, activity, connections stay home) as a link/snapshot.
9. **Collapsed is a display decision, never a retrieval decision.** Anything demoted to Z8 stays fully indexed and searchable.
10. **Modules render honestly at every boost level.** Never promise a tab that processing hasn't produced ▸(the "Otter generates everything for every conversation" claim was *refuted* in verification — AI artifacts are conditional in every real product; design for their absence).

**Adding a new file family is a checklist, not a project:**
choose hero → pick 4–6 facts → pick primary verb + ≤3 type verbs → pick intelligence tabs → define L1/L2 enrichers → map capture affordances. Ship.

---

## 7. Data model sketch (Supabase-aligned)

```sql
artifacts (
  id uuid pk,
  family text,            -- 'voice' | 'track' | 'image' | ... | 'blob'
  subkind text,           -- 'meeting' | 'screenshot' | 'gcode' | ...
  title text, caption text,           -- caption = AI one-liner
  mime text, ext text, size_bytes bigint, content_hash text,
  storage_key text,                   -- R2 object key
  source jsonb,           -- {kind:'device'|'app'|'watch'|'share', device, app, path, url, actor}
  captured_at timestamptz, ingested_at timestamptz, modified_at timestamptz,
  boost_level int default 0,          -- 0..4 ladder
  status text,                        -- 'processing' | 'ready' | 'failed'
  meta jsonb              -- family-typed first-class facts (validated per family)
)

enrichments (
  id uuid pk, artifact_id fk,
  kind text,              -- 'transcript'|'ocr'|'summary'|'entities'|'palette'|'schema'|'deps'|...
  status text, payload jsonb, model text, created_at timestamptz
)

people (id, name, avatar_key, voiceprint_key nullable, faceprint_key nullable)  -- prints opt-in, deletable
transcript_segments (artifact_id, t0_ms, t1_ms, speaker_person_id nullable, speaker_label text, text, confidence)

suggestions (
  id, artifact_id, kind text,         -- 'todo'|'event'|'contact'|'link'
  payload jsonb, receipt jsonb,       -- receipt: {segment_id | page | cell | span}
  status text                         -- 'pending'|'accepted'|'edited'|'dismissed'
)

tags (id, label, kind text)           -- 'user' | 'auto'
artifact_tags (artifact_id, tag_id, source text, confidence real)
links (a_id, b_id, relation text, source text)        -- artifact↔artifact/person/project
collections (id, name, kind) / collection_items (collection_id, artifact_id)
activity (id, artifact_id, actor, verb, detail jsonb, at timestamptz)
```

Notes:
- `meta` carries the Facts row (per-family JSON schema validation at the edge); `enrichments.payload` carries Intelligence tab content. Cards render entirely from `artifact + meta + enrichments + suggestions` — one query shape for every family.
- Embeddings live alongside enrichments (pgvector) → powers Connections and Converse retrieval.
- Voiceprints/faceprints: opt-in, stored as user-scoped keys, hard-deletable, never used cross-account.

---

## 8. Rollout tiers

| Tier | Families | Why first |
|---|---|---|
| **T1** | voice, screenshot, image, doc, text | Highest capture volume + highest enrichment payoff (transcripts, OCR, items). Proves the skeleton + boost ladder + suggestions loop. |
| **T2** | track, video, dataset, link | Player/consumption patterns + the query hero. |
| **T3** | vector, project, database, sample, archive, code | Deeper renderers (3D viewer, schema explorer) on a proven skeleton. |

Every family not yet built renders as `blob` — full universal layer from day one, so nothing ingested is ever a dead end while its module is in the queue.

---

## 9. Open questions

1. **Boost economics** — which L2/L3 enrichers run automatically vs on-demand at scale (transcription minutes, vision passes)? Per-source rules UI needed.
2. **External sync** — accepted events/todos: mother-only first, or write-through to Google Calendar/Reminders at T1?
3. **Voiceprint consent UX** — per-speaker consent notes for recordings of others? (Legal posture varies by state for recordings; product posture should be conservative.)
4. **Shared cards** — do shared links allow the viewer to Converse with the artifact, or view-only at first?
5. **Edit-in-place scope** — mother as viewer/enricher vs light editor (crop, trim, rename speakers is capture; where's the line?).
