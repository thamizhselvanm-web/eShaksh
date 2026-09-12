# MPLADS Expenditure Intelligence & Anomaly Triage System
## Updated PRD · TRD · Implementation Plan · App Flow — Three Core Feature Focus

**Version:** 2.0 (supersedes v1.0 PRD)
**Target:** SIH 2026
**Scope decision:** All Section-6 foundational capabilities (ingestion, normalization, baseline, Z-score/IQR, dashboard shell) are retained as *platform plumbing* — they're necessary but not differentiating. This version narrows the product's identity to three signals that a tabular-statistics-only competitor (e.g. the existing "Nirikshak AI" repo) structurally cannot replicate without rebuilding their data model:

1. **Vendor & Contractor Network Graph** — shell-vendor and vendor-concentration detection
2. **Ground-Truth Verification Engine** — claimed-vs-actual work cross-check via geotagged photo evidence
3. **Cost-Realism Benchmarking** — pricing anomaly detection against PWD/CPWD Schedule of Rates

> Anomaly ≠ Fraud. The product remains a decision-support system; it makes no legal, fraud, or criminal-intent determinations.

---

# PART 1 — PRD

## 1. Product Vision
Convert MPLADS expenditure data into ranked, explainable investigation priorities — not by asking "is this number unusual," but by answering three questions a human auditor actually asks: *Who's really getting paid? Was the work actually done? Was the price real?*

## 2. Problem (unchanged from v1.0)
Large transaction volume, fragmented reporting, and inconsistent agency naming make manual monitoring infeasible. A large transaction isn't inherently suspicious — agencies operate at different scales — so pure magnitude-based flags produce noise. Existing tools in this space (including comparable public repos) stop at statistical deviation over self-reported numbers, which misses the two most common real-world failure modes: **fabricated vendor networks** and **overstated/undelivered work**.

## 3. Users (unchanged)
**Primary:** District monitoring authorities, audit/investigation teams, MPLADS oversight authorities
**Secondary:** MPs/nodal authorities, implementing agencies, researchers/citizens

## 4. Goals
- Detect fraud patterns invisible to per-agency statistics (shared shell vendors across "unrelated" agencies)
- Verify that claimed work has a physical, ground-truth counterpart
- Detect price manipulation independent of behavioral novelty
- Keep every flag traceable to its evidence and grounded, non-hallucinated
- Preserve the existing Overview → Agency → Anomaly → Evidence → Source Records navigation, extended with three new evidence types

## 5. Non-Goals
- Automatic fraud verdicts, criminal-intent accusations, punitive action
- Replacing auditors/investigators
- LLM-based calculation of anomaly metrics (LLM explains only; never scores)
- Legal certification of land/asset ownership from imagery
- Full computer-vision "proof" of construction quality — the CV layer flags *absence/mismatch*, not quality certification

## 6. Core Features

### 6.0 Platform Foundation (retained, not differentiating)
Data ingestion (CSV/XLSX) → normalization (agency/vendor/category canonicalization) → agency behavioral baseline (mean, median, dispersion, rolling window) → Z-score/IQR statistical layer → investigation dashboard shell.

### 6.1 CORE FEATURE 1 — Vendor & Contractor Network Graph
Build an entity-resolved graph: `Agency —(pays)→ Vendor —(bank_account)→ Account`, with edges weighted by transaction frequency, amount, and time proximity.

Detects:
- **Vendor concentration** — one vendor serving an anomalous number of "unrelated" agencies
- **Rotation patterns** — a small set of vendors cycling across agencies, especially clustered before reporting deadlines or elections
- **Shell indicators** — vendors with no cross-agency history suddenly receiving large, isolated payments; vendors sharing bank account prefixes/registration details across nominally distinct entities
- **Sub-network isolation** — graph community detection to surface clusters of agencies + vendors that transact almost exclusively with each other

### 6.2 CORE FEATURE 2 — Ground-Truth Verification Engine
MPLADS-eSAKSHI already mandates geotagged photo uploads at work stages. This feature ingests those photos (where available) and cross-checks the *claim* against the *evidence*:
- Geotag validation — does the photo location match the registered work location?
- Timestamp validation — does photo capture time align with claimed completion date?
- Presence/absence classification (lightweight CV) — does the photo show a structure/asset consistent with the claimed work category (e.g., "road constructed" vs. bare land), without attempting quality certification
- Change-over-time diffing for multi-stage works — compare "before," "in-progress," and "completed" photos for consistency
- Produces a **Ground-Truth Confidence Score** (not pass/fail) — feeds the Evidence Object, never auto-fails a claim

### 6.3 CORE FEATURE 3 — Cost-Realism Benchmarking
Maintains a reference price table (state PWD Schedule of Rates / CPWD SOR, indexed by work category, unit, region, year) and compares each expenditure's unit cost against it, independent of whether the agency's own history looks "normal."
- Flags systematic overpricing even in agencies that show no behavioral deviation (the case existing tools miss entirely)
- Flags underpricing/under-invoicing as a secondary integrity signal
- Regional/inflation-adjusted so cross-state and cross-year comparisons stay valid

## 7. Updated Scoring Model

| Historical deviation | 30% | 15% | Retained, deprioritized |
| Spending velocity | 30% | 15% | Retained, deprioritized |
| Peer deviation | 20% | 10% | Retained, deprioritized |
| Spending concentration | 10% | 5% | Retained, deprioritized |
| Reporting irregularity | 10% | 5% | Retained, deprioritized |
| **Vendor Network Risk** | — | **20%** | New — Core Feature 1 |
| **Ground-Truth Mismatch** | — | **20%** | New — Core Feature 2 |
| **Cost-Realism Deviation** | — | **10%** | New — Core Feature 3 |

Priority bands unchanged (80–100 High / 60–79 Medium / 0–59 Low). Weights are prototype values requiring validation against real data, per v1.0.

## 8. LLM Rules (unchanged, extended)
The LLM (Qwen3/Ollama) receives the structured Evidence Object — now including vendor-graph summary stats, ground-truth confidence, and cost-realism deltas. It must still: use supplied numbers exactly, explain the violated baseline(s), identify supporting evidence across all applicable signals, suggest investigation focus, never invent facts, never claim fraud, never alter the score.

## 9. Success Criteria (extended)
All v1.0 criteria, plus:
- Vendor graph correctly resolves entity duplicates (same vendor, different spellings/registrations) with reviewable confidence
- Ground-truth engine processes available geotagged photos and produces a confidence score without false-failing agencies that simply lack photo data (absence of evidence ≠ evidence of absence — scored as "unverifiable," not "high risk")
- Cost-realism benchmarking flags at least one case in the demo dataset that the behavioral-deviation layer alone misses

## 10. MVP (revised)
### Must Have
Real MPLADS dataset · normalization · agency baseline · Z-score/IQR · **vendor graph construction + concentration/rotation detection** · **ground-truth photo ingestion + presence/absence CV check** · **SOR reference table + unit-cost comparison** · updated priority scoring · evidence traceability · React dashboard · investigation page · Qwen3/Ollama explanation
### Later
Velocity detection refinement, Isolation Forest, scheduled ingestion, user roles, notifications, cross-region analytics, feedback-driven tuning, satellite/street-view diffing for large works, public transparency portal

---

# PART 2 — TRD (Technical Requirements Document)

## 1. Architecture Overview
```
                     ┌──────────────────────────┐
   MPLADS CSV/XLSX → │  Ingestion & Normalization│
   eSAKSHI photos  → │  (agency/vendor canon.)   │
                     └────────────┬──────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
   ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────────┐
   │ Statistical Layer│ │ Vendor Graph Engine│ │ Ground-Truth Engine  │
   │ (Z-score/IQR/    │ │ (Neo4j / pg graph) │ │ (CV + geotag/EXIF)   │
   │  baseline)        │ └─────────┬─────────┘ └──────────┬───────────┘
   └────────┬──────────┘           │                       │
             │          ┌──────────────────────┐           │
             │          │ Cost-Realism Engine    │           │
             │          │ (SOR reference DB)     │           │
             │          └──────────┬─────────────┘           │
             └───────────────┬─────┴───────────────┬─────────┘
                              ▼                     ▼
                    ┌────────────────────────────────────┐
                    │   Anomaly Priority Score Aggregator │
                    └───────────────┬──────────────────────┘
                                    ▼
                    ┌────────────────────────────────────┐
                    │  Evidence Object Store (Postgres)    │
                    └───────────────┬──────────────────────┘
                                    ▼
                    ┌────────────────────────────────────┐
                    │ Qwen3 (Ollama, local) — explanation  │
                    └───────────────┬──────────────────────┘
                                    ▼
                    ┌────────────────────────────────────┐
                    │  React Investigation Dashboard       │
                    └────────────────────────────────────┘
```

## 2. Tech Stack
- **Frontend:** React + Tailwind, graph visualization via `react-force-graph` or `d3`, image compare via a custom before/after slider component
- **Backend:** Node/Express (API layer) + Python microservice (data science: pandas, scikit-learn for Z-score/IQR, networkx for graph metrics, a lightweight vision model — e.g., a small CLIP/ResNet classifier fine-tuned or zero-shot for presence/absence — for the ground-truth CV check)
- **Graph store:** Neo4j (preferred for community detection/traversal) or PostgreSQL + Apache AGE if a single-DB footprint is required for the demo environment
- **Relational store:** PostgreSQL for expenditure records, Evidence Objects, SOR reference tables
- **LLM:** Qwen3 via Ollama, local/on-prem — no data leaves the environment
- **Image handling:** Pillow/EXIF-parsing for geotag+timestamp extraction; store originals + derived metadata, never re-upload to external APIs

## 3. Data Model Additions

**vendor_graph_nodes**: `node_id, type(agency|vendor|account), canonical_name, raw_name_variants[], region, first_seen, last_seen`

**vendor_graph_edges**: `edge_id, source_node_id, target_node_id, txn_count, total_amount, first_txn_date, last_txn_date, time_clustering_flag`

**ground_truth_records**: `record_id, work_id, photo_url, geotag_lat, geotag_lng, exif_timestamp, claimed_location, claimed_completion_date, location_match_score, timestamp_match_score, cv_presence_class, confidence_score`

**sor_reference**: `sor_id, work_category, unit, region, year, reference_unit_cost, source`

**cost_realism_flags**: `flag_id, work_id, actual_unit_cost, reference_unit_cost, deviation_pct, direction(over|under)`

**evidence_object** (extended): existing numerical evidence + `vendor_graph_summary (json), ground_truth_confidence (float, nullable), cost_realism_delta (float, nullable), source_work_ids[]`

## 4. Non-Functional Requirements
- **Explainability:** every score component traceable to a named signal and its evidence rows — no black-box aggregation
- **Missing-data handling:** ground-truth and cost-realism signals must degrade to "unverifiable" (neutral), never to "high-risk," when source data (photos, SOR entries) is absent
- **Privacy/on-prem:** LLM runs locally via Ollama; no expenditure or photo data sent to external APIs
- **Determinism:** statistical and graph scoring must be reproducible given the same input snapshot (required for audit defensibility)
- **Performance target for demo:** full pipeline (ingest → score → dashboard) on a representative constituency-scale dataset (~5–10K records) in under a few minutes on demo hardware

## 5. Key APIs (backend)
- `POST /ingest` — CSV/XLSX upload → normalization job
- `GET /agencies/:id/vendor-graph` — subgraph for an agency
- `GET /works/:id/ground-truth` — photo evidence + confidence breakdown
- `GET /works/:id/cost-realism` — SOR comparison
- `GET /anomalies?rank=priority` — ranked list for dashboard
- `GET /anomalies/:id/evidence` — full Evidence Object

---

# PART 3 — IMPLEMENTATION PLAN (SIH timeline)

| Phase | Focus | Key deliverables |
|---|---|---|
| **Phase 0 — Setup** | Data acquisition, environment | Real MPLADS dataset sourced, repo scaffolding, Ollama+Qwen3 running locally, Postgres + Neo4j provisioned |
| **Phase 1 — Foundation** | Platform plumbing | Ingestion pipeline, agency/vendor name normalization, baseline + Z-score/IQR layer, evidence object schema |
| **Phase 2 — Core Feature 1** | Vendor Graph | Entity resolution across vendor name variants, graph construction, concentration + rotation detection, community-detection flag |
| **Phase 3 — Core Feature 2** | Ground-Truth Engine | EXIF/geotag extraction, location/timestamp match scoring, presence/absence CV classifier, confidence-score aggregation with graceful "unverifiable" fallback |
| **Phase 4 — Core Feature 3** | Cost-Realism | SOR reference table build (start with 1–2 states' PWD rates for demo scope), unit-cost comparison engine, over/under-pricing flags |
| **Phase 5 — Integration** | Score aggregation + LLM | Updated weighted scoring model, Qwen3 explanation grounded across all signals, Evidence Object assembly end-to-end |
| **Phase 6 — Dashboard** | React frontend | Ranked anomaly list, agency drill-down, three new evidence views (graph viz, before/after photo compare, SOR comparison chart), Overview→Agency→Anomaly→Evidence→Source flow |
| **Phase 7 — Polish & Demo** | Judged-demo readiness | Seed a known planted case for each of the 3 core features so the demo can *show* a catch a pure-statistical tool would miss; pitch narrative alignment |

**Sequencing note:** Phases 2–4 can run in parallel across team members once Phase 1's normalized data model is stable — they're independent signal engines that only converge at Phase 5's aggregator.

---

# PART 4 — APP FLOW

## Primary navigation (extends v1.0)
```
Overview
  └─▶ Agency Profile
        └─▶ Anomaly (ranked list, filterable by dominant signal)
              └─▶ Evidence Object
                    ├─▶ Statistical Evidence (existing: baseline, velocity charts)
                    ├─▶ Vendor Graph View          ← NEW
                    │     - interactive subgraph centered on agency
                    │     - highlighted shared-vendor / rotation clusters
                    │     - click-through to other agencies sharing a vendor
                    ├─▶ Ground-Truth View           ← NEW
                    │     - claimed work details vs photo evidence
                    │     - before/after/in-progress image compare slider
                    │     - geotag map pin vs registered work location
                    │     - confidence score with "unverifiable" state handling
                    ├─▶ Cost-Realism View            ← NEW
                    │     - claimed unit cost vs SOR reference, by category/region/year
                    │     - deviation % with direction (over/under)
                    └─▶ Source Records (raw expenditure rows, unchanged)
              └─▶ Qwen3-generated explanation (grounded across all evidence panels above)
```

## Screen-level flow
1. **Overview** — ranked anomaly feed, filter by priority band and dominant signal (Vendor / Ground-Truth / Cost / Statistical)
2. **Agency Profile** — baseline summary + a compact preview of vendor-graph density and ground-truth coverage for that agency
3. **Anomaly Detail** — the Evidence Object tabs above; each tab is independently explorable, and the LLM explanation panel updates its citations based on which signals actually triggered
4. **Evidence → Source Records** — every number in every tab remains click-through to the underlying transaction/work row, preserving full traceability

---

*Weights, SOR reference scope, and CV classifier choice are prototype decisions to validate against real data before the demo — flagged as such per the original PRD's validation requirement.*
# UI/UX DESIGN DIRECTIVE — eSAKSHI

## 1. Official Product Identity

**Project Name:** eSakshi

**Product Descriptor:**
**MPLADS Expenditure Intelligence & Verification Platform**

The product must always be branded as:

> **eSakshi**

Do NOT use:

* Nirikshak AI
* MPLADS Insight
* MPLADS Expenditure Intelligence & Anomaly Triage System as the product name
* Generic names such as AI Monitor, Trust AI, Smart Audit, Fraud Detector

The long technical description may appear as a subtitle, but **eSakshi is the primary product identity throughout the application.**

---

# 2. Visual Direction — CRITICAL

The interface must NOT look "AI-generated", "vibe-coded", template-based, or like a generic SaaS analytics dashboard.

Use the supplied visual reference as the **design-language direction**.

The UI should feel like a combination of:

* Government technology platform
* Premium editorial data product
* Financial intelligence terminal
* Modern institutional dashboard
* High-end investigative analytics tool

The design should communicate:

> **Trust + Evidence + Intelligence + Government-grade seriousness**

Avoid making the interface look like a flashy AI startup.

---

# 3. Anti-Vibe-Coding Rules

These rules are mandatory.

### DO NOT use:

* Excessive rounded cards
* Every section inside a floating card
* Giant gradient backgrounds
* Purple/blue "AI" gradients
* Glassmorphism everywhere
* Neon glowing borders
* Excessive shadows
* Random blobs
* Excessive icons
* Emoji-based UI
* Generic AI robot illustrations
* Stock AI imagery
* Random 3D objects
* Huge dashboard KPI cards occupying most of the screen
* Excessive animations
* Generic "AI-powered" badges everywhere
* ChatGPT-style interface as the primary experience
* Excessive pill-shaped buttons
* Rainbow charts
* Arbitrary decorative elements with no functional purpose

The application must never look like it was generated from a generic Tailwind dashboard template.

---

# 4. Reference-Based Layout Philosophy

Use the provided reference image as inspiration for:

* Editorial typography
* Large whitespace
* Strong visual hierarchy
* Thin borders
* Restrained color palette
* Large serif display typography
* Clean navigation
* Premium institutional branding
* Asymmetric layouts
* Carefully positioned visual elements
* Strong headline/subheadline hierarchy
* Minimal but intentional buttons
* Large sections rather than dozens of small cards

The UI should feel **designed**, not assembled.

Every spacing value, typography scale, border, chart and component should have a visual purpose.

---

# 5. eSakshi Brand Language

The brand should be visually distinctive.

### Brand

**eSakshi**

Possible supporting line:

> **Evidence-led intelligence for MPLADS monitoring**

Alternative:

> **See the spending. Verify the work. Understand the risk.**

The wordmark should be simple and institutional.

Do not use an overly complicated logo.

The logo should work as:

```text
eSakshi
MPLADS INTELLIGENCE
```

The brand should feel appropriate for a serious government monitoring platform rather than a consumer AI application.

---

# 6. Color System

Use a restrained institutional palette.

Primary direction:

* Warm/off-white background
* Near-black typography
* Deep navy/charcoal secondary elements
* Muted teal/green as the primary accent
* Soft grey borders
* Subtle yellow/amber for warnings
* Red only for genuinely high-risk evidence states

Do NOT make the entire application dark mode.

The default interface should be **light, calm and highly readable**.

Accent colors must communicate meaning rather than decoration.

Example semantic usage:

```text
Teal      → verified / active / trusted
Amber     → review required / unusual
Red       → high-priority investigation signal
Grey      → neutral / unavailable / unverifiable
Black     → primary information
```

---

# 7. Typography

Typography is a major part of the visual identity.

Use a combination of:

### Display typography

A refined serif font for major page headings and editorial statements.

### Interface typography

A clean modern sans-serif for:

* Navigation
* Tables
* Metrics
* Filters
* Buttons
* Labels
* Charts
* Evidence metadata

Do not use one oversized font everywhere.

Create a clear hierarchy:

```text
Page Statement
      ↓
Section Heading
      ↓
Supporting Description
      ↓
Metric
      ↓
Metadata
```

Avoid huge "AI dashboard" headings.

---

# 8. Navigation

Navigation should be simple and persistent.

Recommended:

```text
eSakshi

Overview
Agencies
Anomalies
Vendor Network
Ground Truth
Cost Realism
Investigation
Source Records

                         Explore Dashboard →
```

Do not create 15–20 navigation items.

The navigation should make the product's three differentiating capabilities immediately visible.

---

# 9. Landing / Overview Page

The first screen should immediately explain what eSakshi does.

Hero message:

> **Evidence-led intelligence for MPLADS monitoring.**

Supporting text:

> Analyze expenditure behaviour, contractor relationships, physical work evidence and reference costs to identify projects that deserve human verification.

Then introduce the three core intelligence layers:

```text
WHO GETS PAID?
Vendor & Contractor Network

WAS THE WORK DONE?
Ground-Truth Verification

WAS THE PRICE REAL?
Cost-Realism Benchmarking
```

These three questions should become a major visual identity of the product.

---

# 10. Dashboard Design

The dashboard must answer one question:

> **"Where should an investigator look first?"**

Do not make the dashboard a collection of random statistics.

Prioritize:

### 01 — Investigation Priority

A ranked list of anomalies.

### 02 — Why It Was Flagged

Show the dominant signal:

```text
Vendor Network
Ground Truth
Cost Realism
Statistical Behaviour
```

### 03 — Evidence

Allow the investigator to move directly into:

```text
Agency
→ Anomaly
→ Evidence
→ Source Record
```

The dashboard should be investigation-oriented rather than merely descriptive.

---

# 11. Three Core Feature Visualizations

## A. Vendor Network

The Vendor Network screen should visually resemble an intelligence/network investigation interface.

Show:

```text
Agency
   │
   ├── Vendor A
   │      ├── Agency X
   │      └── Agency Y
   │
   ├── Vendor B
   │
   └── Vendor C
          └── Bank Account
```

Use an interactive graph.

Important:

The graph must communicate relationships.

Do NOT create a decorative node graph simply because "AI dashboards have graphs."

Each node and edge must represent real data.

Clicking a vendor should reveal:

* Agencies served
* Transaction count
* Total amount
* First transaction
* Last transaction
* Concentration
* Rotation indicators
* Related accounts/registration information where available

---

# 12. Ground-Truth Verification UI

This should be one of the most visually impressive parts of eSakshi.

Use an investigation-style evidence layout.

Example:

```text
CLAIMED WORK
────────────────────────

Work ID
Category
Location
Claimed Completion
Approved Amount

             VS

GROUND EVIDENCE
────────────────────────

Photo
GPS Location
EXIF Timestamp
CV Classification
Confidence
```

Include:

### Before / During / After

with a proper image comparison slider.

Include:

### Location Verification

Show:

```text
Registered Work Location
          ↓
      Map Pin
          ↓
Photo GPS Location
```

Then show:

> Location Match: 94%

or, when data is unavailable:

> Location: Unverifiable

Never represent missing evidence as failure.

---

# 13. Cost-Realism Interface

The Cost-Realism screen should feel like a professional procurement/financial analysis tool.

Show:

```text
WORK
Road Construction

Actual Unit Cost
₹X / unit

SOR Reference
₹Y / unit

Deviation
+XX.X%
```

Use a clean comparison visualization:

```text
SOR REFERENCE       ███████████
ACTUAL COST         █████████████████
```

Then show:

* Work category
* Unit
* Region
* Year
* Reference source
* Actual expenditure
* Deviation percentage

The reference source must always be visible.

Never show a cost anomaly without explaining what it was compared against.

---

# 14. Investigation Page

The Investigation page is the heart of eSakshi.

It should not feel like a normal analytics page.

Structure it like an evidence dossier:

```text
INVESTIGATION
────────────────────────────────

Agency / Work
Priority Level

WHY THIS CASE MATTERS
─────────────────────

Signal 01
Vendor Network

Signal 02
Ground Truth

Signal 03
Cost Realism

STATISTICAL CONTEXT
─────────────────────

Historical baseline
Velocity
Z-score
Peer comparison

EVIDENCE
─────────────────────

Vendor Graph
Photo Evidence
SOR Comparison
Source Records

AI EXPLANATION
─────────────────────

Qwen3-generated explanation
based ONLY on supplied evidence

HUMAN REVIEW
─────────────────────

Unreviewed
Under Review
Needs More Evidence
Closed
Escalated
```

The investigator should never need to navigate through multiple unrelated pages just to understand why a case was flagged.

---

# 15. AI Explanation UI

Qwen3 must NOT dominate the interface.

Do not make the product look like a chatbot.

Instead, present AI as an evidence interpretation layer.

Use:

> **eSakshi Analysis**

Then show:

### Summary

Short explanation.

### Key Evidence

Bullet points derived strictly from the Evidence Object.

### Baseline Violation

What statistical or reference baseline was exceeded.

### Investigation Focus

What a human investigator should verify.

### Disclaimer

> This explanation summarizes detected signals and supporting evidence. It is not a fraud determination.

The evidence should remain visually more important than the AI-generated text.

---

# 16. Evidence Traceability

Every important number must be traceable.

For example:

```text
₹44.2L
   ↓
View source
   ↓
Work ID W1042
   ↓
Source Record
   ↓
Original expenditure row
```

Do not display unexplained numbers.

The UI should make evidence provenance obvious.

---

# 17. Tables

Tables should look like professional government/financial records.

Use:

* Strong column hierarchy
* Minimal borders
* Compact rows
* Sticky headers
* Sorting
* Filtering
* Search
* Pagination
* Clear numeric alignment

Avoid turning every row into a giant rounded card.

Example:

```text
Work ID | Agency | Vendor | Amount | Signal | Priority | Status
```

---

# 18. Charts

Charts must be purposeful.

Use charts only when they answer a question.

Examples:

### Spending history

"Has spending behaviour changed?"

### Velocity chart

"Did spending accelerate suddenly?"

### Peer comparison

"Is this agency behaving differently from similar agencies?"

### Cost comparison

"Is the unit cost materially different from the reference?"

### Network graph

"Who is connected to whom?"

Avoid charts that exist only to make the dashboard look impressive.

---

# 19. Animation Philosophy

Animations must be subtle and purposeful.

Use:

* Fade-in
* Gentle slide
* Chart drawing
* Number transitions
* Graph node highlighting
* Evidence panel transitions
* Image comparison movement

Do NOT use:

* Excessive bouncing
* Flying cards
* Constant floating objects
* Particle backgrounds
* Neon animations
* Scroll-triggered animations everywhere

The application should feel **calm and intelligent**.

---

# 20. Responsive Design

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop should be the primary experience because the product is designed for investigation teams.

Do not simply shrink the desktop UI.

For mobile:

```text
Dashboard
↓
Priority Case
↓
Evidence
↓
Source Record
```

must remain usable.

---

# 21. Data Integrity Rules for UI

Never fabricate:

* Expenditure values
* Number of anomalies
* Vendor relationships
* GPS locations
* Photos
* SOR prices
* Risk scores
* Investigation outcomes
* Performance metrics

When data does not exist, explicitly show:

> **Data unavailable**

or:

> **Unverifiable**

Never create fake data merely to make the interface look populated.

Demo seed data must be clearly separated from production/source data.

---

# 22. Empty and Error States

Design these intentionally.

Examples:

### No photo

> Ground-truth evidence unavailable for this work.

### Insufficient history

> Insufficient historical data to establish a reliable agency baseline.

### No SOR reference

> No applicable reference rate available for this category and period.

### Vendor unresolved

> Vendor identity requires review before network analysis.

### AI unavailable

> Automated explanation unavailable. Evidence and statistical analysis remain accessible.

The application must remain functional even when individual intelligence layers fail.

---

# 23. Final Design Test

Before considering any screen complete, ask:

### Does this look like a generic AI dashboard?

If YES → redesign it.

### Does every visual element have a functional reason?

If NO → remove it.

### Can an investigator understand why a case was flagged?

If NO → redesign it.

### Can every important number be traced to source evidence?

If NO → redesign it.

### Does the screen communicate evidence rather than AI hype?

If NO → redesign it.

### Does the UI look appropriate for a serious government monitoring platform?

If NO → redesign it.

---

# 24. Core Design Principle

The final product should feel like:

> **A serious investigation instrument, not an AI demo.**

The visual identity of eSakshi should communicate:

**Observe → Detect → Verify → Explain → Investigate**

The UI should make the technology almost invisible.

The investigator should remember:

> **The evidence, not the AI.**
