---
title: "AMALI — SaaS LMS Product Markup"
version: "v1.0"
last_updated: "2025-08-05"
status: "Draft"
owners:
  - product: "TBD"
  - design: "TBD"
  - engineering: "TBD"
edit_instructions: |
  - Treat this file as the single source of truth.
  - Update the version and date when making changes.
  - Use the '🛠 Modification Guide' section below for structured edits.
  - Keep changes atomic and document them in the CHANGELOG.
  - Feature flags in 'Feature Toggles' drive scope for each edition.
---

# AMALI — SaaS LMS (Abstracted from Odoo/Webkul + IXL/Brilliant/Khanmigo/Quizlet/Duolingo)

> **Purpose:** Define a vendor-neutral, multi-tenant SaaS LMS that fuses **SIS + billing + adaptive learning + AI tutor + gamification + mobile + analytics**.

---

## 0) Table of Contents
- [1) Product Vision](#1-product-vision)
- [2) Personas & Roles](#2-personas--roles)
- [3) Editions & Feature Toggles](#3-editions--feature-toggles)
- [4) Modules & Bounded Contexts](#4-modules--bounded-contexts)
- [5) System Architecture](#5-system-architecture)
- [6) Data Model (Essentials)](#6-data-model-essentials)
- [7) UX/UI System](#7-uxui-system)
- [8) Learning & Assessment](#8-learning--assessment)
- [9) Adaptive & AI Orchestration](#9-adaptive--ai-orchestration)
- [10) Gamification Loop](#10-gamification-loop)
- [11) Analytics & Nudges](#11-analytics--nudges)
- [12) Messaging & Communications](#12-messaging--communications)
- [13) Compliance, Privacy & Security](#13-compliance-privacy--security)
- [14) Interoperability & Integrations](#14-interoperability--integrations)
- [15) Mobile (PWA + Native)](#15-mobile-pwa--native)
- [16) Pricing & Packaging](#16-pricing--packaging)
- [17) Delivery Plan (90 Days)](#17-delivery-plan-90-days)
- [18) Non-Functional Requirements](#18-non-functional-requirements)
- [19) 🛠 Modification Guide](#19--modification-guide)
- [20) Glossary](#20-glossary)
- [21) CHANGELOG](#21-changelog)
- [22) TODO Backlog (Quick)](#22-todo-backlog-quick)

---

## 1) Product Vision
AMALI is a **multi-tenant learning platform** that unifies **Student Information System (SIS)** features with **adaptive, gamified learning** and **AI copilots** for students and teachers. It aims to be the **habit-forming, mobile-first** platform that schools and training providers adopt without piecing together multiple vendors.

**North-star outcomes**
- Daily active learning sessions per student ≥ **5 minutes**.
- ≥ **10%** improvement in skill mastery over baseline within first 8 weeks.
- Teacher weekly time saved on grading/prep ≥ **3 hours**.
- On-time payment rate ≥ **95%** with parent self-serve plans.

---

## 2) Personas & Roles
- **Student** (mobile-first micro-learning; streaks, XP, AI tutor, mastery map)
- **Teacher** (Today/actions, Plan, Grade, Insights, Roster, Messages; AI copilot)
- **Parent/Guardian** (digest, dues, payments, messaging, progress)
- **Admin** (admissions, billing, compliance, users/SSO, reporting)

**RBAC**
- Roles: student, teacher, parent, admin, org_owner, auditor
- Scopes: read/write by collection (attendance, grades, billing, items, nudges)

---

## 3) Editions & Feature Toggles
**Starter**
- SIS basics, courses/sections, assignments, gradebook, attendance
- Certificates, PWA, basic analytics

**Learning Core**
- + H5P authoring, SCORM import, SSO (OIDC), parent portal, item bank

**Pro**
- + Adaptive diagnostics, mastery dashboard, AI tutor, teacher copilot, gamification (XP/streaks/badges), WhatsApp/SMS nudges

**Enterprise**
- + LTI 1.3 provider/consumer, OneRoster, SAML SSO, data export to DW, audit logs, data residency options, advanced SLA

**Feature Toggles (examples)**
- `features.ai.tutor=true|false`
- `features.adaptive.diagnostic=true|false`
- `features.gamification.streaks=true|false`
- `features.billing.enabled=true|false`
- `features.mobile.offline=true|false`

---

## 4) Modules & Bounded Contexts
- **Tenant & Identity**: orgs, domains, SSO (OIDC/SAML), RBAC, audit trails
- **SIS Core**: persons, guardians, enrollments, calendars, attendance, discipline, transcripts
- **Billing & Commerce**: plans, invoices, payments, refunds, taxes, coupons; AR dashboard
- **Learning Graph**: subjects → courses → units → lessons → activities; skills taxonomy
- **Content Services**: authoring blocks, media pipeline, SCORM 1.2/2004 import, versioning
- **Assessment**: item types (MCQ, numeric, open, code, draw), attempts, rubrics, grading queue
- **Adaptive & Mastery**: placement diagnostics, mastery estimator (Bayesian/IRT-1PL), next-best
- **AI Orchestration**: Socratic tutor, teacher copilot, step-checking, moderation/guardrails
- **Gamification**: events → XP → levels/badges → streaks → leagues; rewards ledger
- **Analytics**: event stream, cohort dashboards, next-best-action, parent digests
- **Messaging**: inbox, announcements, email/SMS/WhatsApp/push; nudge composer
- **Mobile**: PWA + React Native apps; offline cache, daily challenge

---

## 5) System Architecture
- **Gateway**: REST+GraphQL; API keys per tenant; rate limits
- **Services**: Identity, Tenant, SIS, Learning, Assessment, AI, Gamification, Messaging, Billing, Reporting
- **Event Bus**: Kafka/NATS for telemetry, nudge triggers, XP updates
- **Storage**: Postgres (OLTP), Redis (cache/queues), S3 (assets/SCORM), Columnar DW (ClickHouse/Snowflake)
- **AI Layer**: provider-agnostic router; RAG over approved content; prompt registry; evals
- **Interoperability**: LTI 1.3, OneRoster 1.2, SCORM 1.2/2004, CSVs, webhooks
- **Security**: per-tenant isolation, RLS, KMS-backed secrets, full audit trails
- **Observability**: logs, metrics, traces; experiment flags; SLIs/SLOs

**Sequence (example: student question)**
1. Student opens Lesson → AI Tutor panel loads with context
2. Tutor requests policy + content snippets from RAG
3. Tutor returns **Socratic hint** + citations; never auto-submits answers
4. Event emitted → analytics + possible nudge update

---

## 6) Data Model (Essentials)
**Actors**
- `User(id, org_id, roles[], status)`
- `Student(user_id, guardian_ids[])`
- `Teacher(user_id)`
- `Parent(user_id)`

**Learning**
- `Course(id, subject, grade, owner)`
- `Unit(id, course_id)` → `Lesson(id, unit_id)` → `Activity(id, lesson_id)`
- `Skill(id, descriptor, difficulty, standard_refs[])`
- `ActivitySkill(activity_id, skill_id)`

**Assessment**
- `Item(id, type, skill_id, difficulty)`
- `Attempt(id, student_id, item_id, response, score, duration, integrity_signals)`
- `MasteryEstimate(student_id, skill_id, theta, confidence, updated_at)`

**Gamification**
- `Event(id, user_id, type, payload_json)`
- `Ledger(user_id, points)`
- `BadgeAward(user_id, badge_id)`

**Billing**
- `Plan, Subscription, Invoice, Payment`

**Analytics**
- Immutable `EventStore` (page_view, activity_start, item_submit, mastery_update, nudge_sent, payment_success, etc.)

---

## 7) UX/UI System
**Principles**
- Mobile-first; action over data; consistent right-rail AI; accessible (WCAG 2.2 AA)

**Navigation**
- Student/Parent: Home · Learn · Assignments · Progress · Messages
- Teacher: Today · Plan · Grade · Insights · Roster · Messages
- Admin: Overview · Admissions · Academics · Billing · Users/SSO · Reports · Settings

**Today pages**
- Student: Continue, Daily Goal, Due Soon, AI Hint, Tiny Wins
- Teacher: Alerts (at-risk), Next Best Actions, Grading Queue, Comms
- Parent: Digest, Dues, Nudge, Contact
- Admin: KPIs, Risk, Compliance, Health

**Lesson layout**
- Left: content blocks; Center: activity; Right: AI Tutor, glossary, scratchpad
- Assessment drawer: progress bar, attempts, “Flag for review”
- Mastery map with color-blind-safe states

**Assessment & grading**
- Item types: MCQ, checkbox, numeric, free-response, code, diagram/draw
- “Show your work” steps; AI step-checking with teacher override
- Rubric side panel; integrity signals visible (focus loss, time anomaly)

**Gamification**
- Daily goal, streaks (with freeze), XP & Levels, badges, optional leagues
- Class leaderboards (privacy defaults), celebration on mastery milestones

**Messaging & nudges**
- Inbox with filters; Nudge composer (segment → channel → preview)
- Parent weekly digest; per-tenant rate limits to avoid spam

**Design tokens**
- Spacing 4/8/12/16/24/32; radius 12/16; elevation 0/2/4/8
- Type scale 12–32; ensure 4.5:1 contrast
- Components: AppBar, PageHeader, Card, ListRow, FilterBar, DataTable, StatTile, ProgressRing, SkillChip, Badge, Toast, Modal, Drawer, Stepper, EmptyState, Upload, CodeEditor

---

## 8) Learning & Assessment
- Course → Unit → Lesson → Activity; teacher pacing vs. adaptive routes
- Item bank with difficulty & discrimination metadata
- Attempts with remediation path; “Try a simpler example” pattern
- Certificates on completion; credit hours logged to transcript

---

## 9) Adaptive & AI Orchestration
**Adaptive**
- Short placement diagnostics per subject; seed ability (θ) per skill cluster
- Bayesian update on each attempt; **Next-Best Activity** ranked by information gain + teacher pacing constraints

**AI Tutor (student)**
- Socratic hints, worked examples on request, misconception fixes
- No final answer by default; “Reveal” requires confirmation
- Cited snippets; calculator/code sandbox when relevant
- Transcript available to teacher

**Teacher Copilot**
- Generate items aligned to chosen skills; distractors; rubrics
- Human-in-the-loop review → item bank
- Lesson plan generator with objectives, timing, materials

**Safety & Governance**
- Guardrails per tenant (age gating, restricted tools)
- Abuse/misuse reporting; content filters; audit trail of AI interactions

---

## 10) Gamification Loop
- Daily goal (minutes/problems) → streak → XP → level
- Weekly leagues (opt-in, matched by level); rewards ledger
- Anti-cheat: latency checks, focus-loss heuristics, similarity analysis
- Celebrations for mastery; never for mere login

---

## 11) Analytics & Nudges
- Teacher: heatmap (students × skills), funnel (Assigned → Started → Completed → Mastered), cohort compare, export
- Student: mastery map, suggested next steps
- Parent: weekly digest; goal tracking
- Admin: usage, outcomes, billing AR, SSO health, compliance metrics
- Nudge engine: goals → segments → channel (push/SMS/WhatsApp/email) → experiments; per-tenant rate limits

---

## 12) Messaging & Communications
- Inbox (assignments, announcements, messages)
- Channels: email, push, SMS, WhatsApp
- Templates with personalization (name, course, goal, due date)
- Quiet hours & frequency controls

---

## 13) Compliance, Privacy & Security
- FERPA/COPPA/GDPR-K aware data flows; consent & DSR
- SOC 2 roadmap: Type I (mo 3–4), Type II (mo 10–12)
- Data residency options; encryption in transit & at rest; key rotation
- WCAG 2.2 AA accessibility standards
- Full audit logging; legal hold; export & erasure tooling

---

## 14) Interoperability & Integrations
- **LTI 1.3** (consumer & provider)
- **OneRoster 1.2** (SIS rostering)
- **SCORM 1.2/2004** import
- CSV import/export, Google/Microsoft SSO
- Webhooks for events (enrollment.created, attempt.scored, payment.succeeded)

---

## 15) Mobile (PWA + Native)
- PWA install; offline cache for lessons & assignments
- React Native apps (iOS/Android); single codebase; background sync
- Daily challenge widget; push notifications; biometric login

---

## 16) Pricing & Packaging
- Per-active-student monthly pricing; teacher/admin free up to threshold
- Discounts: annual prepay, public-sector, region bundles
- Add-ons: data export, dedicated SSO, custom SLAs, data residency zones

---

## 17) Delivery Plan (90 Days)
**Days 0–30 (MVP Core)**
- Multi-tenant identity & SSO; org onboarding
- SIS basics: courses/sections, roster, attendance, gradebook
- Authoring lite + SCORM import; PWA
- Billing/payments; basic analytics; WhatsApp/SMS gateway

**Days 31–60 (Adaptive + AI v1)**
- Item bank + attempts; diagnostic for one subject
- Mastery estimator (Bayesian/IRT-1PL); next-best
- AI tutor (guardrailed) + teacher copilot (item authoring)
- Gamification: XP, streaks, badges

**Days 61–90 (Polish & Scale)**
- Teacher actionable dashboards; parent digest
- iOS/Android releases; offline cache
- LTI 1.3; OneRoster; CSV flows
- Data export to DW; admin audit logs

---

## 18) Non-Functional Requirements
- **Performance:** P90 page < 1.5s; P99 API < 300ms for read endpoints
- **Reliability:** 99.9% uptime; RPO ≤ 15 min; RTO ≤ 60 min
- **Security:** SSO, MFA optional; least-privilege; continuous scanning
- **Observability:** logs, metrics, traces; incident runbooks
- **Scalability:** 100K DAU, 1K RPS burst; horizontal scale via k8s

---

## 19) 🛠 Modification Guide
**How to change scope**
1. Update **Feature Toggles** in §3.
2. Adjust affected modules in §4 and UX in §7.
3. Update **Delivery Plan** milestones in §17.
4. Add an entry to **CHANGELOG** in §21.

**How to add a new capability**
1. Create a subsection under the relevant module in §4.
2. Extend data model in §6 and API surface in an API spec file.
3. Define UX flows in §7 with wireframe references.
4. Define analytics events in §11.
5. Gate behind a new feature toggle.

**How to propose UX changes**
- Add a note under §7 with the pattern/component to adjust.
- Include acceptance criteria and success metrics.
- Link to Figma frame IDs and experiment plan.

**Versioning**
- Semantic versioning: MAJOR.MINOR.PATCH
- Example: v1.1 adds new Pro features; v1.1.1 is bugfix copy updates.

---

## 20) Glossary
- **SIS**: Student Information System
- **LTI**: Learning Tools Interoperability
- **SCORM**: Sharable Content Object Reference Model
- **OneRoster**: Standard for SIS rostering and grade passback
- **IRT**: Item Response Theory (1PL/2PL/3PL)
- **DAU**: Daily Active Users
- **RPO/RTO**: Recovery Point/Time Objective

---

## 21) CHANGELOG
- 2025-08-05 — v1.0 initial draft

---

## 22) TODO Backlog (Quick)
- [ ] Define initial skills taxonomy per subject.
- [ ] Draft diagnostic blueprint for Math Grade 6.
- [ ] Select vector DB and set AI guardrails.
- [ ] Design streak/XP/badge assets and thresholds.
- [ ] Author 10 sample lessons (H5P) + 50 items per grade cluster.
- [ ] Create parent digest email templates.
- [ ] Wire WhatsApp/SMS gateway with per-tenant rate limits.
- [ ] Implement teacher heatmap + cohort compare.
- [ ] Draft DPA template + data residency policy.
