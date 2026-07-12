# Detail cards — research pass

> How best-in-class apps design file/asset detail screens, per file family.
> Feeds the framework in [`detail-card-system.md`](./detail-card-system.md).

## Method

Deep-research harness, July 2026: the question was decomposed into 5 search angles (DAM/file managers · voice & meeting transcription · music/video media pages · photo & design-asset inspectors · docs/datasets/maker + chat-with-file). 24 sources fetched → 72 falsifiable claims extracted → the top 25 put through 3-vote adversarial verification: **23 confirmed, 2 refuted**.

Confidence labels used below:
- **✅ Verified** — survived 3-vote adversarial verification against primary sources.
- **◐ Observed** — extracted from a fetched source with a verbatim quote, but not put through the verification round (the verify budget covered 25 of 72 claims). Treat as directionally reliable, screenshot-check before copying details.
- **✗ Refuted** — claimed by a source or synthesis, killed in verification. Listed because the *correction* is design-relevant.

Known biases: nearly everything rests on vendor help docs (authoritative for anatomy, favorable in framing); most layout language ("hero", "two-column") paraphrases text rather than screenshots; SaaS UIs drift — Frame.io findings are V4-specific, Otter's doc describes its "new" layout.

---

## The seven patterns that generalize

These are the cross-cutting takeaways; each is grounded in at least one verified finding.

### P1 — Everyone converges on "universal skeleton + type modules" ✅
Brandfolder serves **one asset-modal anatomy for every file type** — tabs for overview/details/usage, hero preview left, attachments/download right, lifecycle facts (created, creator, last-updated, publish/expiry, approver) directly beneath the preview. Bynder's detail view is the same shape with different labels. Even Finder is architecturally this: QuickLook renders the hero while a parallel Spotlight query populates the field list below it ◐. Nobody builds a per-type screen from scratch; they build one skeleton and swap modules. *(Validates the framework's core premise.)*

### P2 — Semantic metadata is first-class; technical metadata is collapsed **but still indexed** ✅
Bynder's primary surface shows metaproperties, AI auto-tags, copyright, custom fields; Brandfolder collapses EXIF and OCR text into a dedicated Metadata tab — **"all information on this tab is indexed by Brandfolder and can be searched by any user."** The demotion is visual, never functional. Design rule for mother: collapsing a field must never remove it from retrieval; Z8's "All metadata" is a display decision only.

### P3 — When AI enrichment exists, it displaces the raw content as the hero ✅
Otter's conversation page leads with a **Summary tab** (AI summary + outline); the transcript and player live in the second tab. Fireflies' Notepad gives the literal center of the screen to the AI-generated structured summary; transcript, recording, analytics flank it. The raw recording is one click away, never gone. Implication: a mature detail card is *digest-first* — the card leads with what the machine understood, and the source content backs it.

### P4 — "Chat with this file" is a docked companion panel, and answers cite positions ✅
Otter keeps a persistent, collapsible right panel hosting Otter AI Chat + Outline + Comments regardless of active tab; Fireflies embeds AskFred, "trained on your actual meeting," with suggested + free-form questions. Acrobat AI Assistant is the text-side proof of the citation half ◐: answers carry **numbered clickable citations, and clicking one highlights the source passage in the document** — and on upload it pre-populates an overview + suggested questions instead of an empty chat box. (NotebookLM's three-pane Sources/Chat/Studio layout with per-source scoping checkboxes matches this pattern, but its help page blocked fetching — unverified.)

### P5 — Actions anchor to coordinates inside the content, not to the file ✅
Frame.io V4: comments are **timestamp-anchored by default** (pagestamp for PDFs), with an explicit toggle to detach; every comment gets dual representation — card in the panel *and* bubble on the scrubber; range comments (I/O keys) become the playback window when clicked; on-frame drawings submit *with* the comment and stay hidden during playback until the card is clicked. Fireflies: highlighting transcript text surfaces create-soundbite / comment / bookmark / copy *at the selection*. Generalization: capture verbs live inside the hero, scoped to a position (timestamp, page, cell, region), with a receipt both in a list and on the content.

### P6 — Enrichment runs at ingest, asks one amortized human question, and is provenance-logged ✅
Descript: speaker detection is **on by default and runs at import**; when done, a notification offers "Identify speakers"; you name each voice **once** and labels propagate project-wide and survive cut/copy/paste. Otter mines action items and auto-assigns them from conversation content, with manual assign as fallback. And Brandfolder's Asset History Log records every change with **Update / Source / User / Date, where Source explicitly names the machine actors** (Auto-Tagging, Asset Automations) — AI edits are logged like human edits. Mother's boost ladder + "name this speaker once" + machine-attributed activity log follow exactly this shape.

### P7 — Versions, related assets, and activity logs are standard modules, gated by relevance ✅
Bynder ships a Versions tab (history, compare, restore) and related-assets module (variations, derivatives, renditions); Brandfolder collapses the full 180-day history log behind "View recent updates" while keeping summary lifecycle facts first-class — and gates the full log to Owners/Admins. mother is single-user, so role-gating translates to **relevance-gating**: same collapse, no permissions wall.

---

## Per-family teardowns

### 1 · Voice & meeting transcription — Otter, Fireflies, Descript
- **Hero:** AI summary/digest (Otter Summary tab ✅, Fireflies center-screen summary ✅); player + transcript one tab/pane away. Fireflies' default summary is itself modular ◐: Keywords, Meeting Overview, time-stamped Outline.
- **First-class:** summary, action items, outline, speakers; the audio itself is secondary.
- **Actions:** selection-scoped (highlight → soundbite/comment/bookmark/copy ✅); "AI Skills" automations from the top bar ◐; reactions/highlights/images anchored to transcript ◐.
- **AI:** diarize at ingest by default, name-once propagation (Descript ✅); auto-extracted action items with auto-assignment (Otter ✅); per-meeting chat (AskFred/Otter Chat ✅).
- **Not found:** calendar-event *extraction* from transcript content produced no surviving claims — Otter/Fireflies dock upcoming-calendar integration, but "detected a proposed meeting in the talk" appears to be open ground. **mother's calendar scanner is differentiation, not table stakes.**

### 2 · Music & samples — (verification did not reach this family)
- From search-phase snippets only: Spotify song-credits pages (performers/songwriters/producers/label as a first-class panel), Splice's audition-loop browse. Treat the framework's `track`/`sample` specs as design intent pending a screenshot pass.
- Jellyfin (adjacent, media servers) ◐: detail pages are fed by **external metadata providers** (TMDb, OMDb, local `.nfo` sidecars) with plugin extensibility — enrichment-by-lookup, with documented failure modes (language- and geography-limited providers). Pattern for mother: fingerprint → external lookup fills blanks (as the prototype's track card shows), and lookups need graceful degradation.

### 3 · Photos & images — Apple Photos, Lightroom, Eagle
- **Apple Photos** ◐ (secondary source): the `ⓘ` Info pane surfaces EXIF first-class (camera, lens, shutter), plus file size and **provenance — which app the photo was saved from**; capture date/time is *editable inline* (Adjust). EXIF display migrated from third-party tools to built-in — table stakes now.
- **Lightroom Classic** ◐ (primary): the Metadata panel is **switchable field-set views** (Default / EXIF / IPTC / others) rather than one fixed layout; EXIF view elevates Exposure, Focal Length, ISO, Flash; and **metadata fields double as navigation** — IPTC fields with an arrow click through to all photos sharing that value. *(Direct precedent for the framework's tappable Facts.)*
- **Eagle** ◐ (vendor-blog): previews for 81+ formats as the differentiator; hover/spacebar/smart-zoom quick-looks ahead of the full detail view; per-type preview modules (GIF frame-by-frame); **auto color analysis on every import** with copyable PMS/CMYK/RGB/HEX and right-click "find similar-colored files"; inspector fields: title, source URL, tags, folder, note, rating, dates. *(Direct precedent for the palette module + same-palette search.)*

### 4 · Vector & design assets — Figma Community
- ◐ (primary): resource pages put **like count + use count** beside the creator; description, comments, creator contact on-page; the file page is a **live hero** — you can explore the file and interact with prototypes before duplicating; primary action is Duplicate (price-on-button for paid). Pattern: engagement/usage counts as first-class facts; previews should be the real, interactive thing, not a thumbnail.

### 5 · Video review — Frame.io V4
- Fully covered under P5 ✅: timestamp/pagestamp anchoring with detach toggle, dual card+bubble representation, range comments as playback windows, annotation tools (arrow/line/box/free-draw, color, undo/redo) submitted with the comment, annotations hidden during playback until the card is clicked ◐.

### 6 · Documents & chat-with-doc — Acrobat AI Assistant
- ◐ (primary): citations → highlight-in-source (P4); proactive overview + suggested questions on upload; **heterogeneous inputs (DOCX/PPTX/TXT/RTF) normalized to PDF** before chat — one canonical preview/interaction format per family; a no-training privacy promise is surfaced *inside the product experience*. For mother: normalize doc renders to one canonical pipeline, and state the privacy posture on-card where AI touches personal content.

### 7 · Datasets & catalogs — Amundsen
- ◐ (primary, README): the canonical detail screen is the **Table Detail Page**; a **column-level view with optional per-column stats** (the schema-explorer pattern); a Data Preview Page shows sample rows (integrating Superset rather than rebuilding viz); search ranks **page-rank-style by query usage** — usage is enrichment. For mother: track opens/plays/queries/citations per artifact and feed them to ranking and the Connections zone. (Kaggle's column histograms were in scope but its page blocked fetching — the prototype's dataset card follows the pattern as design intent.)

### 8 · Maker & project files — (verification did not reach this family)
- No surviving claims for GitHub/Printables/Fusion/DAW pages. The framework's `project` spec (orbitable 3D hero, app+version, dependency presence, print history) stands as design intent from domain knowledge, pending a screenshot pass. Flagged in open questions.

### 9 · File managers & DAM — Finder, Brandfolder, Bynder
- Brandfolder/Bynder: P1/P2/P6/P7 above ✅. Also ◐: Brandfolder's Usage tab pairs distribution (CDN embed links) with analytics; downloads offer **on-the-fly format/size conversion** per attachment. Bynder adds a Collections tab (containment context) and share = link or embed.
- **Finder** ◐ (reputable blog): metadata appears in three synchronized surfaces (Preview pane, Get Info, list columns) fed by the same Spotlight pipeline; which fields are first-class is **type-dependent and user-configurable** (Show Preview Options, per file type). Precedent for letting power users re-pick a family's Facts.

---

## Refuted — and why the corrections matter ✗

1. **"An Edit tab gates annotations/version history/check-out by role" (Brandfolder)** — killed 1-2. The tab exists but the specific role-gating description didn't hold. Correction: don't copy DAM permission plumbing into a single-user product; gate by relevance instead.
2. **"Otter auto-generates Summary, Action Items and Outline first-class for *every* conversation"** — killed 0-3. AI artifacts are **conditional** (plan-, settings-, content-dependent). Correction: mother should treat enrichment presence as conditional too — cards must render honestly at every boost level, and never promise a module that processing hasn't produced (the framework's L0–L4 ladder + "hero shows enrichment state, never a blank box").

---

## What this changed in the framework

1. **Digest-first voice cards** — once L3 lands, the Intelligence panel defaults to Summary (Transcript one tab away); `memo` subkind keeps transcript-first (§5.1). *(P3)*
2. **Collapsed ≠ unindexed** — everything in Z8's All-metadata is searchable; consistency rule added (§6). *(P2)*
3. **Anchored capture generalized** — notes/highlights/comments attach to content coordinates (timestamp, page, cell, region) by default with an explicit detach, and get dual representation (panel card + marker on the content) (§4). *(P5)*
4. **Selection-scoped actions** — highlight transcript/text → clip/todo/copy/comment at the selection (§5.1). *(P5)*
5. **Converse spec sharpened** — docked collapsible panel scoped to the artifact, persists across tabs, opens pre-populated (caption/summary + suggested prompts), answers cite positions and clicking highlights the receipt (§4). *(P4)*
6. **Machine actors in the activity log** — every Record entry carries what/source/actor/when, with enrichers named like users (§3 Z8). *(P6)*
7. **Usage as signal** — opens/plays/queries/citations tracked per artifact, feeding ranking + Connections (§3 Z7). *(Amundsen)*
8. **Canonical render pipelines** — heterogeneous formats in a family normalize to one preview format (docs → PDF-like render) (§5.8). *(Acrobat)*
9. **Calendar scanning flagged as differentiation** — no incumbent verified doing transcript→calendar-event extraction; keep receipts + explicit accept as the trust mechanism (§4). *(family 1 gap)*

## Open questions carried forward

1. Screenshot-verify the four families vendor docs couldn't cover: music/sample pages, maker/3D pages (Printables/MakerWorld), Kaggle's column-stat UI, NotebookLM's source panel.
2. How do Otter/Fireflies/Granola push accepted items *out* (calendar/task systems) — write-through UX and failure modes?
3. Which enrichments should be unconditional at ingest for a single-user platform, given incumbents gate by plan/role? (Cost model → framework §9.)
4. Do document chat UIs beyond Acrobat anchor answers to positions the same way (NotebookLM inline citations, ChatGPT file uploads)?

## Sources

**Verified against:** Brandfolder/Smartsheet — [Anatomy of the Asset Modal](https://help.smartsheet.com/articles/2482883-The-Anatomy-of-the-Asset-Modal), [Asset History Log](https://help.smartsheet.com/13664386046487-Asset-History-Log), [asset details](https://help.brandfolder.com/hc/en-us/articles/360011668313) · Bynder — [Asset Detail View](https://support.bynder.com/hc/en-us/articles/21745299220882-Exploring-the-Asset-Detail-View), [versions](https://support.bynder.com/hc/en-us/articles/360013931859), [auto-tagging](https://support.bynder.com/hc/en-us/articles/16841116279570) · Otter — [Conversation Page Overview](https://help.otter.ai/hc/en-us/articles/5093228433687-Conversation-Page-Overview), [action items](https://help.otter.ai/hc/en-us/articles/25983095114519) · Descript — [Detect and label speakers](https://help.descript.com/hc/en-us/articles/10249423506061-Detect-and-label-speakers-in-your-transcript) · Fireflies — [Notepad](https://guide.fireflies.ai/articles/6653885315-learn-about-the-fireflies-notepad), [AskFred](https://guide.fireflies.ai/articles/6556345325), [Soundbites](https://guide.fireflies.ai/articles/1026795385) · Frame.io V4 — [Commenting](https://help.frame.io/en/articles/9105251-commenting-on-your-media), [ranges](https://help.frame.io/en/articles/9105278), [annotations](https://help.frame.io/en/articles/9105536).

**Observed (unverified):** [Lightroom Classic metadata panel](https://helpx.adobe.com/lightroom-classic/help/metadata-basics-actions.html) · [Apple Photos EXIF (MacRumors)](https://www.macrumors.com/how-to/view-exif-metadata-photos-app/) · [Eagle vs Bridge](https://en.eagle.cool/blog/post/adobe-bridge-alternative) · [Figma Community](https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-the-Figma-Community) · [Jellyfin metadata](https://jellyfin.org/docs/general/server/metadata/) · [Acrobat AI chat-PDF](https://www.adobe.com/acrobat/online/ai-chat-pdf.html) · [Amundsen](https://github.com/amundsen-io/amundsen) · [Finder metadata (Eclectic Light)](https://eclecticlight.co/2025/11/19/viewing-metadata-in-the-finder/).
