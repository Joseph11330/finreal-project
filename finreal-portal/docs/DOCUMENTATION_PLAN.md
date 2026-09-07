# Finreal Portal — Documentation Plan
### A concrete, build-and-maintain plan for a student team
> Version: 1.0 — 2026-09-07 — Author: Tech Writer / Software Architect
> Audience: Student dev team (3–6 people), faculty adviser, IT auditor
> Stack at time of writing: Next.js 14 App Router, Prisma 5 + PostgreSQL, JWT httpOnly cookie, Zod, Tailwind + Radix, `MOCK_API` dual mode

---

## How to use this plan

- **Read top to bottom once.** Then jump to your assigned section.
- Every section follows the same pattern: **What to create → Where → Template/example → Owner → Effort**.
- Effort is in **person-hours** assuming a student who has read the codebase once.
- Priority tags: **Must** = do before next sprint review, **Should** = do within 2 sprints, **Could** = nice to have.
- All `docs/` paths are relative to `finreal-portal/` repo root.

---

## Table of Contents

1. [Documentation Structure](#1-documentation-structure-what-docs-where-why)
2. [Key Diagrams](#2-key-diagrams-to-create-and-tool-to-create-them)
3. [API Documentation Plan](#3-api-documentation-plan)
4. [Setup & Onboarding Guide](#4-setup--onboarding-guide)
5. [Decision Log (ADRs)](#5-decision-log-adrs--architecture-decision-records)
6. [Quality & Process Docs](#6-quality--process-docs)
7. [Roadmap & Backlog](#7-roadmap--backlog)
8. [Maintenance Plan](#8-maintenance-plan)
9. [Implementation Checklist & Next Steps](#9-implementation-checklist--next-steps)

---

## 1. Documentation Structure (What docs, where, why)

### Proposed `docs/` tree

```
finreal-portal/
├── README.md                          # repo front door (already exists — upgrade it)
├── CONTRIBUTING.md                    # how to contribute (root, GitHub-visible)
├── docs/
│   ├── README.md                      # docs index / map — start here
│   ├── architecture/
│   │   ├── ARCHITECTURE.md            # C4 + tech stack + request flow
│   │   ├── DATA_MODEL.md              # ER diagram + Prisma commentary
│   │   └── SECURITY.md                # threats, controls, RA 10173
│   ├── api/
│   │   └── API.md                     # complete API reference (source: route handlers + Zod)
│   ├── setup/
│   │   ├── SETUP.md                   # clone → run → seed (both modes)
│   │   └── DEPLOYMENT.md              # build, env, hosting, checklist
│   ├── decisions/
│   │   ├── DECISIONS.md               # ADR index
│   │   ├── ADR-001-nextjs-app-router.md
│   │   ├── ADR-002-jwt-httponly.md
│   │   ├── ADR-003-prisma.md
│   │   ├── ADR-004-mock-api-dual-mode.md
│   │   ├── ADR-005-branch-department-hierarchy.md
│   │   ├── ADR-006-zod-validation.md
│   │   ├── ADR-007-middleware-guard.md
│   │   └── ADR-008-mongodb-company-server.md
│   ├── process/
│   │   ├── TESTING.md                 # strategy + how to run
│   │   └── CONVENTIONS.md             # naming, commits, PR template
│   ├── diagrams/
│   │   ├── c4-context.mmd
│   │   ├── c4-container.mmd
│   │   ├── er-diagram.mmd
│   │   ├── sequence-signup-approve.mmd
│   │   └── state-application-user.mmd
│   └── backlog/
│       └── ROADMAP.md                 # what we don't do yet + sprint plan
└── .github/
    ├── pull_request_template.md
    └── workflows/ci.yml               # lint + build + test (future)
```

> **Why not `docs/architecture/ARCHITECTURE.md` flat in `docs/`?** Two reasons students care about: (1) GitHub renders `README.md`/`CONTRIBUTING.md` at repo root automatically; (2) grouping by folder keeps PR diffs small and makes ownership obvious (see §8). If your team prefers flat, collapse `architecture/` → keep files as `docs/ARCHITECTURE.md` etc. — the table below works either way.

### Document catalog

| # | File (where) | Purpose (one line) | Audience | Priority |
|---|--------------|--------------------|----------|----------|
| 1 | `README.md` (root) | Front door: what the system is, how to run in 5 min, link to docs | Dev, PM, visitor | **Must** |
| 2 | `docs/README.md` | Map of all docs — "where do I find X?" | Dev | **Must** |
| 3 | `docs/architecture/ARCHITECTURE.md` | Why this stack, C4 diagrams, request lifecycle, folder map | Dev, auditor | **Must** |
| 4 | `docs/architecture/DATA_MODEL.md` | ER diagram + every table/enum explained + constraints | Dev, auditor | **Must** |
| 5 | `docs/api/API.md` | Every endpoint: method, auth, request/response, curl, Zod ref | Dev, QA | **Must** |
| 6 | `docs/setup/SETUP.md` | Step-by-step setup for MOCK_API and real DB modes | Dev (new joiner) | **Must** |
| 7 | `docs/setup/DEPLOYMENT.md` | Build, env vars, hosting, pre-deploy checklist | Dev, PM | **Should** |
| 8 | `CONTRIBUTING.md` (root) | Branch naming, commits, PR process, code style | Dev | **Must** |
| 9 | `docs/decisions/DECISIONS.md` + `ADR-*.md` | Why we chose X over Y (8 decisions) — prevents re-litigation | Dev, auditor | **Must** |
| 10 | `docs/process/TESTING.md` | What to test, with what, where tests live, coverage goal | Dev, QA | **Should** |
| 11 | `docs/architecture/SECURITY.md` | Auth, JWT, PII/RA 10173, checklist before deploy | Dev, auditor | **Must** |
| 12 | `docs/process/CONVENTIONS.md` | Naming, file structure, commits, PR template | Dev | **Should** |
| 13 | `docs/backlog/ROADMAP.md` | What's missing + prioritized sprints | PM, Dev | **Should** |
| 14 | `docs/diagrams/*.mmd` | Source files for every diagram (Mermaid) | Dev | **Should** |
| 15 | `.github/pull_request_template.md` | Forces doc updates in PRs | Dev | **Could** |

| Section | What to create | Where | Template / Example | Owner | Effort |
|---------|----------------|-------|--------------------|-------|--------|
| Structure | Create folders + empty stubs with headers | `docs/{architecture,api,setup,decisions,process,diagrams,backlog}` | See catalog table + template in §1.1 below | Tech Lead | 1 h |
| Index | `docs/README.md` table of contents with links + status badges | `docs/README.md` | `| Doc | Status | Owner | Updated |` | Tech Writer | 1 h |
| Root | Rewrite `README.md` to 1-page front door | `/README.md` | Template §1.1 | Tech Writer | 2 h |

#### Template §1.1 — `docs/README.md` starter

```markdown
# Finreal Portal — Documentation Map
> Last updated: YYYY-MM-DD | Owner: @tech-lead

| Document | What it answers | Owner | Status |
|----------|-----------------|-------|--------|
| [SETUP.md](setup/SETUP.md) | "How do I run this on my laptop?" | Onboarding buddy | ✅ |
| [ARCHITECTURE.md](architecture/ARCHITECTURE.md) | "Why is it built this way?" | Backend lead | 🚧 |
...
```

#### Template §1.1b — `README.md` (root) skeleton — keep under 80 lines

```markdown
# Finreal Portal — HR/Admin Intranet (Philippine-compliant)
One-liner + screenshot
## Quick Start (60s per mode)
[MOCK_API] vs [Real DB] columns
## Documentation → docs/README.md
## Scripts | Tech Stack | License
```

---

## 2. Key Diagrams to Create (and tool to create them)

> **Rule for students:** If you can't draw it, you don't understand it. Every diagram below is copy-paste Mermaid — no Figma needed. Commit the `.mmd` source so it stays versioned.

| # | Diagram | What it shows | Why it matters (the "so what") | Tool | Where to embed |
|---|---------|---------------|-------------------------------|------|----------------|
| D1 | **System Context (C4 Level 1)** | Actors: Applicant, Employee, Admin/HR Officer, Department Head, Super Admin, System, PostgreSQL, Email (future), Browser | Proves you know the boundary — auditors ask "who touches PII?" | **Mermaid** (`flowchart`) | `ARCHITECTURE.md` §1 |
| D2 | **Container (C4 Level 2)** | Browser ↔ Next.js 14 (App Router, Middleware, Route Handlers) ↔ Prisma Client ↔ PostgreSQL; Browser ↔ cookies (JWT httpOnly) | Shows deployment shape + where auth lives | **Mermaid** (`flowchart` + subgraphs) | `ARCHITECTURE.md` §2 |
| D3 | **ER Diagram** | 6 models: `User`, `Branch`, `Department`, `Application`, `Announcement`, `CalendarEntry` + FKs + enums (`Role`, `AccountStatus`, `ApplicationStatus`, etc.) + indexes | Prevents "add column without thinking about FK" mistakes; auditor wants to see PII fields | **Mermaid `erDiagram`** (source of truth: `prisma/schema.prisma:47-227`) | `DATA_MODEL.md` §1 |
| D4 | **Sequence: Signup → Approve** | Flow: `Browser → POST /api/auth/register → Prisma (PENDING_REVIEW) → Admin approves → User login → GET /api/dashboard/schedule → Forms → POST /api/applications/:id/approve` | Captures the gate: nothing works until `PENDING_REVIEW → ACTIVE` | **Mermaid `sequenceDiagram`** | `ARCHITECTURE.md` §3 + `API.md` intro |
| D5 | **State: Application** | `PENDING_REVIEW → APPROVED` / `PENDING_REVIEW → REJECTED` (reject requires `rejectionReason`); terminal states don't transition | Guards enforce audit trail; devs know 409 means "already reviewed" | **Mermaid `stateDiagram-v2`** | `DATA_MODEL.md` §3 |
| D6 | **State: User Account** | `PENDING_REVIEW → ACTIVE → SUSPENDED` / `PENDING_REVIEW → REJECTED`; login blocked unless `ACTIVE`; middleware vs route-handler checks | Explains 403 "awaiting approval" vs 401 vs 403 | **Mermaid `stateDiagram-v2`** | `SECURITY.md` §1 + `DATA_MODEL.md` |

### Tool choice (why Mermaid)

- **Chosen:** Mermaid JS — renders natively on GitHub, no export step, versioned as text, works offline.
- **Alternative evaluated:** dbdiagram.io / PlantUML / draw.io — rejected for now because they add a tool dependency and binary images drift from code. You may use **dbdiagram.io** once to visually sanity-check the ER, then transcribe to Mermaid.
- **How to author:** Edit `docs/diagrams/*.mmd`, embed via ````mermaid` fenced block in Markdown, or use `npx mermaid-cli` to export PNG for presentations.

### Copy-paste starters (students: paste and tweak)

**D1 — System Context**
```mermaid
flowchart TB
  A[Applicant - unauthenticated] --> P[Finreal Portal - Next.js 14]
  E[Employee STAFF/HR] --> P
  AD[Admin/Super Admin] --> P
  P --> DB[(PostgreSQL + Prisma)]
  P --> B[Browser - httpOnly cookie]
```

**D3 — ER (excerpt, extend from schema.prisma)**
```mermaid
erDiagram
  Branch ||--o{ Department : has
  Branch ||--o{ User : employs
  Department ||--o{ User : groups
  User ||--o{ Application : submits
  User ||--o{ Application : reviews
  User ||--o{ Announcement : authors
  User ||--o{ CalendarEntry : creates
  CalendarEntry ||--o{ Announcement : linkedEvent
```

**D4 — Sequence**
```mermaid
sequenceDiagram
  participant U as Browser
  participant A as /api/auth/register
  participant DB as Prisma/Postgres
  participant AD as Admin
  participant L as /api/auth/login
  U->>A: POST fullSignupSchema (6 steps)
  A->>DB: create User status=PENDING_REVIEW
  U->>L: POST login (pending)
  L-->>U: 403 awaiting approval
  AD->>DB: activate user -> ACTIVE
  U->>L: POST login again
  L-->>U: 200 + Set-Cookie finreal_session (httpOnly)
  U->>A: GET /api/applications
```

**D5/D6 — State**
```mermaid
stateDiagram-v2
  [*] --> PENDING_REVIEW
  PENDING_REVIEW --> APPROVED
  PENDING_REVIEW --> REJECTED : reason required
  APPROVED --> [*]
  REJECTED --> [*]
```

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Diagrams | 6 Mermaid files + embed in docs | `docs/diagrams/*.mmd` + `ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY.md` | Snippets above | Tech Writer + Backend | 4–5 h total (1h ER, 1h C4, 2h sequences/states) |

---

## 3. API Documentation Plan

### Source of truth

> **Code is truth.** `docs/api/API.md` is a *view* of two places:
> 1. **Route handlers:** `app/api/**/route.ts` (13 files, listed below)
> 2. **Zod schemas:** `lib/validations/auth.ts:1-150`, `lib/validations/application.ts:1-20`, `lib/validations/announcement.ts:1-28`

Rule: **Change schema or route → update `API.md` in the same PR** (enforced via PR template checklist).

### Complete route inventory (audited 2026-09-07)

| # | Method | Path | Auth | Purpose | File | Zod / Validation |
|---|--------|------|------|---------|------|------------------|
| 1 | POST | `/api/auth/register` | **Public** | Final submit of 6-step wizard; creates `PENDING_REVIEW` user; 409 if email/employeeId duplicate | `app/api/auth/register/route.ts:23` | `fullSignupSchema` (`lib/validations/auth.ts:139`) |
| 2 | POST | `/api/auth/login` | **Public** | Verify credentials; only `ACTIVE` gets `finreal_session` cookie; generic 401; 403 if pending/suspended | `app/api/auth/login/route.ts:12` | `loginSchema` (`auth.ts:5`) |
| 3 | POST | `/api/auth/logout` | Cookie | Clear `finreal_session` | `app/api/auth/logout/route.ts` | — |
| 4 | GET | `/api/applications` | Cookie | List applications for Forms queue (sorted by `submissionDate` desc) | `app/api/applications/route.ts:6` | — |
| 5 | GET | `/api/applications/[id]` | Cookie | Get single application detail | `app/api/applications/[id]/route.ts` | — |
| 6 | POST | `/api/applications/[id]/approve` | Cookie | Approve `PENDING_REVIEW` → `APPROVED`; 409 if already reviewed | `app/api/applications/[id]/approve/route.ts:6` | — |
| 7 | POST | `/api/applications/[id]/reject` | Cookie | Reject with required `reason` (10–1000 chars) → `REJECTED` | `app/api/applications/[id]/reject/route.ts:11` | `rejectApplicationSchema` (`application.ts:4`) |
| 8 | GET | `/api/announcements` | Cookie (mock: public) | List announcements; `?pinned=1` filter; newest first | `app/api/announcements/route.ts:7` | `createAnnouncementSchema` for POST |
| 9 | POST | `/api/announcements` | Cookie | Publish announcement + optional linked `CalendarEntry` (event) | `app/api/announcements/route.ts:66` | `createAnnouncementSchema` (`announcement.ts:3`) |
| 10 | PATCH/PUT | `/api/announcements/[id]` | Cookie | Update subject/body/pinned | `app/api/announcements/[id]/route.ts` | `updateAnnouncementSchema` (`announcement.ts:23`) |
| 11 | GET | `/api/calendar-entries` | Cookie | Month view: `?month=&year=` or `?pinned=1` | `app/api/calendar-entries/route.ts:10` | Manual `month/year` check |
| 12 | GET | `/api/dashboard/schedule` | Cookie | Merged `CalendarEntry` + `Announcement` for `<Month> Schedule` panel | `app/api/dashboard/schedule/route.ts:11` | Manual |
| 13 | GET | `/api/employees` | Cookie + `ADMIN\|SUPER_ADMIN` | User Directory: `?search=&branchId=&departmentId=&status=&page=&pageSize=` | `app/api/employees/route.ts:11` | `employeeQuerySchema` (`application.ts:12`) |
| 14 | GET | `/api/branches` | **Public (mock static)** | Branches + departments for Step 3 select | `app/api/branches/route.ts:21` | — |

> Historical note: `/api/branches` currently returns hardcoded `MOCK_BRANCHES` even in real mode — flag this in `API.md` as `⚠️ TODO: wire to Prisma`.

### Common response shapes & status codes

| Status | When | Body |
|--------|------|------|
| 200 | Success (GET, approve/reject) | `{ message, status }` or resource list |
| 201 | Created (register, announcement) | `{ message, user\|id }` |
| 400 | Bad JSON | `{ error: "Invalid JSON body." }` |
| 401 | No/invalid cookie | `{ error: "Not authenticated." }` or `"Invalid email or password."` |
| 403 | Wrong role or `PENDING_REVIEW` login | `{ error: "Forbidden." / "awaiting approval" }` |
| 409 | Duplicate or already reviewed | `{ error: "...already exists / already been reviewed" }` |
| 422 | Zod validation fail | `{ error: "Validation failed.", issues: { field: string[] } }` |

### Documentation format (proposed — one section per endpoint)

For each route, `API.md` must contain:

```markdown
### POST /api/auth/register
**Auth:** Public · **File:** `app/api/auth/register/route.ts:23` · **Schema:** `fullSignupSchema` (`lib/validations/auth.ts:139`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | string(email) | yes | unique |
| password | string | yes | 8+ chars, 1 upper, 1 digit |

**Request — curl:**
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "email":"a@finreal.com", "password":"Password123", ... }'

**Success 201:**
{ "message": "Registration submitted...", "user": { "id":"...", "email":"...", "status":"PENDING_REVIEW" } }

**Errors:** 422 validation · 409 duplicate · 500 fallback
**MOCK_API behavior:** returns mock user without DB write
```

> Require: **method + path + auth + request table + curl + success/error examples + Zod reference line + MOCK_API note.** Add a copy button for curl.

### Keeping it in sync

- **Manual (now):** Owner of `API.md` checks `git diff app/api` each sprint.
- **Soon (Should):** Add a script `npm run docs:api-check` that parses `app/api/**/route.ts` exports (`GET/POST/PATCH`) and warns if `API.md` is missing a section. Even a 30-line `tsx` script helps.
- **Ideal (Could):** Generate `openapi.json` from Zod schemas (e.g., `zod-to-openapi`) and render with Swagger UI — defer until after testing is solid.

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| API ref | Full `API.md` with 14 endpoints in format above | `docs/api/API.md` | Endpoint template above | Backend dev | 6–8 h (first draft) + 15 min per route change |
| Sync | PR template checkbox: "API.md updated?" | `.github/pull_request_template.md` | `- [ ] API docs updated if route/schema changed` | Tech Lead | 0.5 h |
| Automation | `scripts/check-api-docs.ts` (optional) | `scripts/` | Compare route files vs API.md headings | Backend | 2–3 h (Could) |

---

## 4. Setup & Onboarding Guide

### Goal

> A new student clones the repo and is running `http://localhost:3000` in **< 15 minutes**, in either mode.

### What to create

- **`docs/setup/SETUP.md`** — the only place for setup steps (README links to it)
- **`.env.example` upgrade** — already exists (`finreal-portal/.env.example:1-4`) but needs `MOCK_API` + comments

### Step-by-step (final content for `SETUP.md`)

```markdown
# Setup & Onboarding

## Prerequisites
Node 18+ (check: node -v), npm, Git, PostgreSQL 14+ (only for real-DB mode),
VS Code + Prisma extension (recommended).

## 1. Clone & Install
git clone <repo-url>
cd finreal-portal
npm install          # installs Next, Prisma, Zod, bcryptjs, etc. (see package.json)

## 2. Environment
cp .env.example .env
# Edit .env — see table below

## 3a. Frontend-only mode (MOCK_API) — use this for UI work, no DB needed
# .env: MOCK_API=true, DATABASE_URL=dummy, JWT_SECRET=any-random-string
npm run dev          # http://localhost:3000
# Login with any email/password — auth is mocked, middleware accepts 3-part JWT

## 3b. Real DB mode — use this for API/Prisma work
# .env: MOCK_API=false (or unset), DATABASE_URL=postgresql://..., JWT_SECRET=<long random>
npx prisma migrate dev --name init   # or prisma migrate deploy on fresh clone
npm run prisma:seed                  # creates branches, departments, 3 users, 2 announcements, 2 calendar entries
npm run dev

## 4. Verify
- http://localhost:3000 redirects to /login (middleware guard)
- Seed logins: maria.santos@finreal.com / Password123 (ADMIN), david.chen@finreal.com / Password123 (DEPT_HEAD), sarah.jenkins@finreal.com / Password123 (SUPER_ADMIN)
- Register a new account → expect PENDING_REVIEW → login → 403 awaiting approval

## 5. How to Run / Test / Contribute
npm run dev | npm run build | npm run lint
# Testing — see TESTING.md (Vitest unit, Playwright E2E — planned)
# Contributing — see CONTRIBUTING.md (branch naming, PR flow)

## Troubleshooting
| Symptom | Fix |
|---------|-----|
| `JWT_SECRET must be set` | Set JWT_SECRET in .env; required in production (lib/auth.ts:9) |
| `Can't reach database` | Check DATABASE_URL, pg running, MOCK_API not true |
| Middleware redirects loop | Clear finreal_session cookie, restart dev server |
| Seed fails P2002 | DB already seeded — use `prisma migrate reset` to re-seed |
```

### Environment variables (document in SETUP.md + .env.example)

| Var | Required | Example | When | Notes |
|-----|----------|---------|------|-------|
| `DATABASE_URL` | Real mode only | `postgresql://user:pass@localhost:5432/finreal` | `prisma/schema.prisma:7` | Not needed if `MOCK_API=true` |
| `JWT_SECRET` | Always | `openssl rand -hex 32` | `lib/auth.ts:6` | Throws in production if missing |
| `JWT_EXPIRES_IN` | Optional | `8h` | `lib/auth.ts:7` | Default 8h; keep in sync with `maxAge` in `setSessionCookie` |
| `MOCK_API` | Optional | `true` / `false` | Every route handler | `true` = frontend-only, no DB calls |
| `NODE_ENV` | Auto | `development` / `production` | `middleware.ts`, `auth.ts` | Affects `secure` cookie flag |

### MOCK_API vs Real DB — when to use which

| | MOCK_API=true | MOCK_API=false (real DB) |
|---|---|---|
| **Use when** | UI/design, component work, offline, no Postgres | API work, Prisma, auth, approval flow, testing |
| **Auth** | Any creds succeed; JWT mocked; middleware accepts 3-part token (`middleware.ts:21-24`) | Real bcrypt + Prisma lookup; `PENDING_REVIEW` blocked (`app/api/auth/login/route.ts:56`) |
| **Data** | Hardcoded arrays in handlers | Live DB via Prisma; seeded via `prisma/seed.ts` |
| **Risk** | Masks real errors | Requires DB setup |
| **Switch** | `.env` change + restart dev server | — |

### How to contribute (lives in `CONTRIBUTING.md`, summarized in `SETUP.md`)

```
Branch:  feat/<scope>-<short> | fix/<scope>-<short> | docs/<topic>
Commits: feat: add CSV export  |  fix: guard employees route  |  docs: update API for branches
PR: fill template → link issue → checklist (lint, build, docs updated) → 1 reviewer → squash merge
```

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Onboarding | `SETUP.md` (full steps + troubleshooting) | `docs/setup/SETUP.md` | Steps above | Onboarding buddy / Tech Lead | 3 h |
| Env | Upgrade `.env.example` with `MOCK_API` + comments | `.env.example` | Table above → comments in file | Backend | 0.5 h |
| Contributing | `CONTRIBUTING.md` + PR template | `/CONTRIBUTING.md`, `.github/pull_request_template.md` | Branch/commit/ PR sections above | Tech Lead | 2 h |
| Deployment | `DEPLOYMENT.md` (build, env on host, migrate, seed) | `docs/setup/DEPLOYMENT.md` | `npm run build → prisma migrate deploy → start` | DevOps / Backend | 2 h |

---

## 5. Decision Log (ADRs — Architecture Decision Records)

### ADR template (save as `docs/decisions/ADR-000-template.md`)

```markdown
# ADR-000: Title (active voice, e.g., "Use JWT httpOnly cookies for auth")
Date: YYYY-MM-DD
Status: Accepted | Superseded by ADR-00X | Deprecated
Owners: @handle

## Context
What problem? What constraints (PH compliance, student team size, timeline)? What alternatives considered?

## Decision
We will ...

## Consequences
Good: ...
Bad / Trade-offs: ...
Follow-up: ...

## References
- File: `path:line`
- Issue/PR: #123
```

> **Process:** New decision → copy template → number sequentially → 1 reviewer approves → link from `DECISIONS.md` index.

### `docs/decisions/DECISIONS.md` index

```markdown
# Decisions (ADRs)
| ADR | Title | Date | Status |
|-----|-------|------|--------|
| 001 | Use Next.js App Router over Pages Router | 2024-03 | Accepted |
...
```

### 8 ADRs to write (from decisions already made — evidence in code)

| ADR | Title | Context | Decision | Consequence | File refs |
|-----|-------|---------|----------|-------------|-----------|
| **001** | Use Next.js 14 App Router over Pages Router | Team knows React; need file-based routing, layouts (`app/(auth)`, `app/(dashboard)`), route handlers co-located with UI, middleware. Pages Router lacks nested layouts + RSC. | Use `app/` directory, App Router, `middleware.ts` for guards; route handlers in `app/api/**/route.ts`. | + Co-location, layouts, middleware guards. − App Router learning curve, `cookies()` async nuance in Next 14. Follow-up: document RSC vs Client boundary in `ARCHITECTURE.md`. | `app/layout.tsx`, `middleware.ts:10`, `app/api/*` |
| **002** | JWT httpOnly cookie over server sessions/NextAuth | Need stateless auth that survives deploys without session store, PH intranet (not OAuth), RA 10173 minimal PII in cookie. NextAuth adds dependency + session table. | Sign JWT with `JWT_SECRET` (`lib/auth.ts:29-31`), store in `httpOnly, sameSite=lax, secure=prod` cookie `finreal_session` (`auth.ts:43-51`), verify in middleware + handlers. | + No session DB, XSS-resistant (httpOnly). − Revocation needs blocklist/expiry rotation; keep `JWT_EXPIRES_IN` and `maxAge` in sync (8h). | `lib/auth.ts:1-63`, `middleware.ts:17-36` |
| **003** | Prisma ORM over raw SQL / Knex | Student team; need type-safe models, migrations, seed, enums for `Role/AccountStatus`. Raw SQL invites injection + no types. | `prisma/schema.prisma` as single source of truth; `prisma/migrate`, `prisma/seed.ts`; client via `lib/prisma.ts`. PostgreSQL for production. | + Types, migrations, `P2002` handling. − Must run `prisma generate` after schema change; add to onboarding. | `prisma/schema.prisma:1-8`, `prisma/seed.ts:1`, `lib/prisma.ts` |
| **004** | Dual mode: MOCK_API for frontend-only development | New students blocked by DB setup; UI iteration shouldn't need Postgres; demo needs to run without infra. But mock can hide real bugs. | `process.env.MOCK_API === "true"` branch in every route handler + `middleware.ts:20-28`; hardcoded data mirroring DB shape. Default off. Document mode table in `SETUP.md`. | + Onboarding in <5 min, offline work. − Drift risk: mock shape diverges from DB — mitigation: keep mock shapes identical + note `TODO` where diverged (`/api/branches`). | `app/api/*/route.ts` (all), `middleware.ts:20`, `.env.example` |
| **005** | Branch → Department hierarchy (not flat) | Finreal has Olongapo Main + Subic Satellite + Head Office; departments belong to a branch; directory must filter by both. Flat list can't answer "Finance in Olongapo". | `Branch 1—* Department` (`@@unique([branchId,name])`), `User` FKs to both (`schema.prisma:47-66, 196-199`), query filters in `employees/route.ts:38-41`. | + Correct org model, filterable directory. − Seed must create branches first; UI Step 3 needs cascading selects. | `prisma/schema.prisma:47-66`, `app/api/employees/route.ts:38` |
| **006** | Zod for validation (single source of truth) | Need consistent validation: client (wizard UX), server (route handlers), API docs. Manual checks diverge. | Define schemas in `lib/validations/*.ts` (`auth.ts:1-150`, `application.ts`, `announcement.ts`); use `safeParse` in handlers returning `422` with `fieldErrors`; share with `react-hook-form` via `@hookform/resolvers`. | + One shape everywhere; great errors. − Six signup schemas must stay merged in `fullSignupSchema` — test merges. | `lib/validations/auth.ts:5-150`, `lib/validations/application.ts:12`, `app/api/auth/register/route.ts:31` |
| **007** | Middleware route guard + per-handler auth checks | Requirement: "Authorized Access Only" — unauthenticated users must not see dashboard/forms/directory; but `/api` needs its own checks (middleware skips `/api`). | `middleware.ts:4-40` redirects non-`/login|/signup|/api` to `/login?from=...`; every protected handler calls `getSessionFromCookies()` and checks `role` where needed (`employees/route.ts:25`). | + Defense in depth. − `middleware.ts` currently skips `/api` (line 14) — each handler must re-check; document this clearly + add note to `SECURITY.md`. Future: add role-based middleware for `/user-management/*`. | `middleware.ts:4-40`, `lib/auth.ts:57`, `app/api/employees/route.ts:23-25` |
| **008** | MongoDB on Company Physical Server — Single-Node Replica Set (Docker, rs0, db push) | Finreal requires on-prem storage on company physical server; team chose MongoDB for flexibility with evolving announcement poll/attachments shape; Prisma requires replica set for transactions even for single node. | Host MongoDB as single-node replica set in Docker on company server: `mongo:7 --replSet rs0` + `rs.initiate()`, `DATABASE_URL="mongodb://host:27017/finreal?replicaSet=rs0&directConnection=true"`, `npx prisma db push` (not migrate); Next.js on Vercel or same server via Tailscale/VPN; nightly `mongodump --gzip` to separate disk, UPS, auth+firewall. | + Meets on-prem requirement; Prisma transactions work; Docker isolation; no Atlas cost; nightly dumps satisfy RA 10173 audit. − Own DBA duties (patching, backup checks); single-node data-loss risk without RAID/UPS; no managed PITR. Follow-up: convert schema.prisma to MongoDB, `prisma generate` + `db push`, backup cron in `SELF_HOSTING.md`. | `prisma/schema.prisma`, `lib/prisma.ts`, `.env DATABASE_URL`, `docs/decisions/ADR-008-mongodb-company-server.md` |

> Also consider (Could, after these 8): ADR-009 "CSV export client-side vs server", ADR-010 "File upload stub vs S3".

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| ADRs | 1 index + 8 ADR files from template | `docs/decisions/DECISIONS.md`, `docs/decisions/ADR-00*.md` | Table above → fill template per ADR | Architect / Tech Lead | 6–7 h (45 min each) |

---

## 6. Quality & Process Docs

### 6.1 Testing strategy → `docs/process/TESTING.md`

**What to test (pyramid for this project)**

| Layer | What | Tool (proposed) | Where tests live | Example | Coverage goal |
|-------|------|-----------------|------------------|---------|---------------|
| **Unit** | Zod schemas, helpers (auth hashing, validation edge cases), utils | **Vitest** + `zod` | `lib/validations/*.test.ts`, `lib/auth.test.ts` | `fullSignupSchema` rejects bad SSS `12-345` (expect 422), `rejectApplicationSchema` requires 10 chars | 80% for `lib/validations` |
| **Integration** | API route handlers (status codes, auth, RBAC, validation) | **Vitest** + `next-test` / `msw` + test DB | `app/api/**/__tests__/route.test.ts` | `POST /api/auth/login` with `PENDING_REVIEW` → 403; `GET /api/employees` as STAFF → 403 | 70% for `app/api` |
| **E2E** | 6-step wizard, login → dashboard → announcement → approve | **Playwright** | `e2e/*.spec.ts` | Signup happy path, reject without reason fails, CSV export downloads | 5–8 critical flows |

**Why these tools**

- **Vitest:** Fast, Jest-compatible, works with `ts` + `zod` without config gymnastics. Students already have `npm` — no Java/JUnit.
- **Playwright:** One browser matrix, great for Next.js. Alternative Cypress is heavier; skip for now.

**What `TESTING.md` must contain**

```markdown
# Testing
## How to run
npm run test        # vitest unit+integration
npm run test:e2e    # playwright
npm run test:coverage
## Where tests live (table above)
## Writing a new test (copy-paste example for Zod + route)
## CI (future: GitHub Actions runs test on PR)
## Coverage goal + badge
```

**Example snippets to include**

```ts
// lib/validations/auth.test.ts
import { fullSignupSchema } from "./auth";
test("rejects SSS without dashes", () => {
  expect(fullSignupSchema.safeParse({...valid, sssNumber:"1234567890"}).success).toBe(false);
});
```

```ts
// e2e/signup.spec.ts
test("6-step wizard creates PENDING_REVIEW", async ({ page }) => {
  await page.goto("/signup"); /* fill steps */ await page.click("text=Submit");
  await expect(page.locator("text=awaiting approval")).toBeVisible();
});
```

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Testing | `TESTING.md` + add Vitest + Playwright deps + 3 sample tests | `docs/process/TESTING.md`, `vitest.config.ts`, `playwright.config.ts`, `e2e/`, `lib/**/*.test.ts` | Snippets above | QA / Backend | 6 h (doc 1h + setup 2h + samples 3h) |

### 6.2 Security checklist → `docs/architecture/SECURITY.md`

**Must contain**

- **Auth model:** JWT payload (`sub, email, role, status`), `httpOnly` + `sameSite=lax` + `secure=prod` (`lib/auth.ts:43-51`), 8h expiry, no PII beyond role/status in token.
- **Guards:** Middleware (`middleware.ts:4-40`) + per-handler `getSessionFromCookies()` — note gap: middleware skips `/api`, handlers must re-check.
- **Password:** `bcrypt` salt 12 (`lib/auth.ts:21`), never log hash.
- **PII / RA 10173:** Fields that are sensitive (SSS, PhilHealth, Pag-IBIG, TIN, DOB, address, contact) — where stored (`schema.prisma:201-206`), `dataPrivacyConsent` + `consentedAt` gate (`schema.prisma:214-216`), audit note for future: encryption at rest for gov IDs.
- **Threats & mitigations table:**

| Threat | Mitigation | File | Gap / TODO |
|--------|------------|------|------------|
| XSS stealing session | httpOnly cookie, no `localStorage` token | `lib/auth.ts:45` | Ensure no XSS via `dangerouslySetInnerHTML` |
| User enumeration | Generic 401 for login | `login/route.ts:45` | ✅ |
| Unauthorized approval | 409 if not `PENDING_REVIEW`, `reviewedById = session.sub` | `approve/route.ts:14-22` | Add role check (only HR/ADMIN) |
| PII leak via API | Employees route 403 for non-ADMIN | `employees/route.ts:25` | Add field-level filtering for gov IDs |
| CSRF | `sameSite=lax` | `auth.ts:47` | Add CSRF token if `sameSite` insufficient for cross-site POST |

- **Pre-deploy checklist (copy-paste):**

```
- [ ] JWT_SECRET set, not default, 32+ hex chars
- [ ] MOCK_API unset/false in prod
- [ ] All /api/* check getSessionFromCookies() (no open route except register/login/branches)
- [ ] Prisma migrations applied, seed not run in prod
- [ ] No console.log of PII or tokens
- [ ] Security headers (next.config.mjs) — HSTS, X-Frame-Options
- [ ] RA 10173: consent logged, data retention policy documented
```

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Security | `SECURITY.md` with model + threats table + checklist | `docs/architecture/SECURITY.md` | Tables above | Backend + Tech Lead | 3–4 h |

### 6.3 Code conventions → `docs/process/CONVENTIONS.md`

**Naming**

- Files: `kebab-case.tsx` for components, `route.ts` for handlers (Next convention)
- DB: `camelCase` in Prisma, snake not needed; enums `UPPER_SNAKE`
- Branches/PRs: see §4 table

**File structure (document the actual layout)**

```
lib/            # auth, prisma, validations — pure logic, testable
app/(auth)/     # login, signup — public group
app/(dashboard)/# dashboard, forms, user-management — protected group
app/api/        # route handlers — thin, call lib/*, validate with Zod
components/ui/  # Radix wrappers
prisma/         # schema, seed, migrations
docs/           # this plan
```

**Commits (Conventional Commits light)**

```
feat(auth): gate login for PENDING_REVIEW
fix(employees): require ADMIN for directory
docs(api): add branches endpoint
```

**PR template (`.github/pull_request_template.md`)**

```markdown
## What
## Why
## How to test
## Checklist
- [ ] `npm run lint` + `npm run build` pass
- [ ] Docs updated (API.md / ARCHITECTURE.md / ADRs if needed)
- [ ] No PII logged
- [ ] MOCK_API behavior noted if route changed
```

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Conventions | `CONVENTIONS.md` + PR template | `docs/process/CONVENTIONS.md`, `.github/pull_request_template.md` | Snippets above | Tech Lead | 2 h |

---

## 7. Roadmap & Backlog

### What the system DOES NOT do yet (from audit + gap analysis)

> Keep this in `docs/backlog/ROADMAP.md` so new ideas don't become stealth scope creep.

| # | Missing feature | Why it matters | Where it would live | Priority |
|---|-----------------|----------------|---------------------|----------|
| 1 | **Account activation UI** (approve `PENDING_REVIEW → ACTIVE`) | Registrations pile up with no way to activate except DB | `app/(dashboard)/user-management/*` + `POST /api/users/[id]/activate` | **Must** |
| 2 | **Role-based route guards** (frontend + middleware) | Any `ACTIVE` STAFF can hit `/user-management` by URL today | `middleware.ts` + layout guards | **Must** |
| 3 | **Forgot / reset password** | Users locked out have no self-service | `app/(auth)/forgot-password` + email token | **Must** |
| 4 | **Real file upload** (announcements) | `attachmentName/SizeLabel` are text only; no storage | S3 / local `public/uploads` + `POST /api/uploads` | **Should** |
| 5 | **Branch/Department admin UI** | No CRUD for org structure | `app/api/branches` (wire to Prisma) + admin page | **Should** |
| 6 | **Audit log / Activity feed** | Who approved what when beyond `reviewedBy/At` | `AuditLog` model | **Should** |
| 7 | **Email notifications** (registration, approval, announcement) | HR doesn't know when to act | Email provider + queue | **Should** |
| 8 | **CSV export server pagination correctness** | Client export may mismatch server filter | Fix `user-directory/page.tsx` export | **Should** |
| 9 | **Payroll / Leave balance / Overtime calc** | Out of scope — explicit non-goal for now | — | **Could** |
| 10 | **Tests + CI** | No automated safety net | Vitest + Playwright + GitHub Actions | **Must** (process) |
| 11 | **Security headers + rate limiting** | Production hardening | `next.config.mjs`, middleware | **Should** |
| 12 | **PII encryption at rest** (gov IDs) | RA 10173 best practice | Prisma middleware / pgcrypto | **Could** |

### Prioritized backlog for next sprints (MoSCoW)

**Sprint 1 (2 weeks) — "Close the gate" — Must**

| Item | Owner | Effort | Done when |
|------|-------|--------|-----------|
| Activation UI + `POST /api/users/[id]/activate` (ADMIN only) | Backend + Frontend | 8 h | PENDING user can be activated via UI, login then succeeds |
| Role guard for `/user-management/*` + `/api/employees` audit (add ADMIN check to approve/reject) | Backend | 4 h | STAFF gets 403 on directory + approve |
| Forgot-password flow (token + email stub) | Backend | 8 h | User can reset via emailed link (or logged token in dev) |
| Wire `GET /api/branches` to Prisma (remove hardcoded) | Backend | 3 h | Branches reflect DB, seed still works |

**Sprint 2 (2 weeks) — "Make it real" — Should**

| Item | Owner | Effort |
|------|-------|--------|
| Real file upload for announcements (S3 or local, 10MB limit) | Backend | 8 h |
| Branch/Department CRUD admin page | Full-stack | 8 h |
| Fix CSV export to match server filter + pagination | Frontend | 3 h |
| Write 3 ADRs (001-003) + ARCHITECTURE.md v1 | Tech Writer | 6 h |

**Sprint 3 — "Harden" — Should/Could**

| Item | Owner | Effort |
|------|-------|--------|
| Vitest + 10 tests (validations + 3 routes) + coverage | QA | 8 h |
| Playwright 3 E2E flows | QA | 8 h |
| SECURITY.md + pre-deploy checklist | Backend | 4 h |
| AuditLog model | Backend | 6 h |

**Backlog template for `ROADMAP.md`**

```markdown
## Backlog
| ID | Title | Priority | Sprint | Owner | Status |
|----|-------|----------|--------|-------|--------|
| R-001 | Activation UI | Must | 1 | @... | Todo |
```

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Roadmap | `ROADMAP.md` with gap table + sprint plan | `docs/backlog/ROADMAP.md` | Tables above | PM + Tech Lead | 2 h |

---

## 8. Maintenance Plan

### Who owns which doc (RACI — Responsible, Accountable, Consulted, Informed)

| Document | Owner (R) | Reviewer (A) | Updated when | Review cadence |
|----------|-----------|--------------|--------------|----------------|
| `README.md` | Tech Writer | Tech Lead | Any quick-start change | Per sprint |
| `ARCHITECTURE.md` + diagrams | Tech Lead / Architect | Backend | Stack or flow change | Per sprint |
| `DATA_MODEL.md` + ER | Backend | Architect | `schema.prisma` change | **On every migration** |
| `API.md` | Backend (route author) | QA | Any `app/api` or `lib/validations` change | **On every route PR** |
| `SETUP.md` | Onboarding buddy | Tech Lead | Env or script change | Per sprint |
| `DEPLOYMENT.md` | DevOps / Backend | Tech Lead | Env/host change | Per release |
| `SECURITY.md` | Backend | Tech Lead + Auditor | Auth or PII change | Per sprint + pre-release |
| `TESTING.md` | QA | Tech Lead | Test tool or coverage change | Per sprint |
| `CONVENTIONS.md` | Tech Lead | All | Process change | Monthly |
| `DECISIONS.md` + `ADR-*` | Author of decision | Tech Lead | New decision | Within 24h of decision |
| `ROADMAP.md` | PM | Tech Lead | Reprioritization | Sprint planning |

> **Student rule:** If you touched code that a doc describes, you update that doc in the **same PR**. No "I'll update docs later."

### How often to update

| Trigger | Docs to touch |
|---------|---------------|
| `app/api/**/route.ts` added/changed | `API.md` |
| `lib/validations/*.ts` changed | `API.md` + `TESTING.md` |
| `prisma/schema.prisma` or `seed.ts` changed | `DATA_MODEL.md` + `SETUP.md` (if seed) + ER diagram |
| `middleware.ts` or `lib/auth.ts` changed | `SECURITY.md` + `ARCHITECTURE.md` + ADR if decision |
| New dependency or Node version | `SETUP.md` + `ARCHITECTURE.md` |
| New ADR | `DECISIONS.md` index |
| Sprint planning | `ROADMAP.md` |

### Where docs live & how to version them

**Chosen: Docs in repo (`/docs`) — not wiki, not Notion (yet).**

| Option | Verdict | Why |
|--------|---------|-----|
| **In repo (`finreal-portal/docs/`)** | **Chosen now** | Versioned with code, PR-reviewed, works offline, GitHub renders. Single source of truth for students. |
| GitHub Wiki | Rejected for now | Detached from code version (wiki is separate git), easy to drift. |
| Notion / Google Docs | Rejected for SE docs | No version tied to commit; use only for meeting notes / brainstorming. Link from `docs/README.md` if needed. |

**Versioning**

- Docs version = **git commit**. No separate doc version number.
- Tag releases: `git tag v0.2.0` — `CHANGELOG.md` (Could) tracks doc changes per release.
- History: `git log -- docs/architecture/DATA_MODEL.md` shows why ER changed.

**Enforcement**

- `.github/pull_request_template.md` checkbox: `- [ ] Docs updated (list which)`
- Optional CI check: `scripts/check-docs.ts` warns if `app/api` changed but `docs/api/API.md` didn't (diff-based, Could).
- Sprint retro: 5 min "docs debt" review — any `TODO` in docs?

| Section | What to create | Where | Template/Example | Owner | Effort |
|---------|----------------|-------|------------------|-------|--------|
| Ownership | RACI table + trigger table in `docs/README.md` | `docs/README.md` § Maintenance | Tables above | Tech Lead | 1 h |
| Enforcement | PR template + (optional) CI script | `.github/pull_request_template.md` | Checkbox + script | Tech Lead | 1 h |

---

## 9. Implementation Checklist & Next Steps

### Do this week (in order)

- [ ] **Day 1 — Scaffold (1h):** Create `docs/{architecture,api,setup,decisions,process,diagrams,backlog}` + `.github/` + stub each file with its header from this plan. Commit: `docs: scaffold documentation structure per plan`.
- [ ] **Day 1 — .env fix (0.5h):** Add `MOCK_API`, `JWT_EXPIRES_IN` with comments to `.env.example`. Reference `lib/auth.ts:6-7`.
- [ ] **Day 2 — SETUP + CONTRIBUTING (4h):** Write `SETUP.md` (copy steps from §4), `CONTRIBUTING.md`, PR template. Test by having a teammate follow SETUP from scratch.
- [ ] **Day 3 — ARCHITECTURE + DATA_MODEL (6h):** Draw C4 + ER in Mermaid, write `ARCHITECTURE.md` and `DATA_MODEL.md`. Source: `prisma/schema.prisma`, `middleware.ts`, `lib/auth.ts`.
- [ ] **Day 4 — API.md (6h):** Document all 14 routes using endpoint template §3. Have backend dev who wrote each handler review their section.
- [ ] **Day 5 — ADRs 001-004 (3h):** Write first 4 ADRs from table §5. Merge after 1 review.
- [ ] **Week 2 — SECURITY + TESTING + ROADMAP + ADRs 005-007 (6h):** Finish remaining docs. Prioritize `SECURITY.md` before any deploy.
- [ ] **Week 2 — Retro (0.5h):** Does `docs/README.md` map still match? Any doc already stale? Fix.

### Effort summary

| Area | Hours |
|------|-------|
| Structure + index + README | 4 |
| Diagrams (6 diagrams) | 5 |
| API.md (14 endpoints) | 7 |
| SETUP + CONTRIBUTING + DEPLOYMENT | 7.5 |
| ADRs (7) | 6 |
| TESTING + SECURITY + CONVENTIONS | 9 |
| ROADMAP | 2 |
| Maintenance glue (RACI, PR template, CI) | 2 |
| **Total** | **~42.5 person-hours** |
| With 3 students at 5h/week each | **~3 weeks** to Must docs, 4 weeks to complete |

> Tip: Split by owner (§8 RACI) and work in parallel — don't do docs sequentially.

### Definition of Done for "documentation complete"

- [ ] `docs/README.md` links to every doc; no dead links
- [ ] `npm run dev` works from SETUP steps on a fresh clone (both modes tested)
- [ ] `API.md` covers all 14 routes; curl examples run; Zod refs are line-accurate
- [ ] ER diagram matches `prisma/schema.prisma` enums + FKs; state diagrams cover 409 cases
- [ ] 8 ADRs merged; `DECISIONS.md` index up to date
- [ ] `SECURITY.md` checklist passes on staging deploy
- [ ] PR template live; at least 1 PR used it to update docs

---

## Appendix — File reference cheat sheet (for writers)

| What you need | Where it lives |
|---------------|----------------|
| Enums + models | `prisma/schema.prisma:10-227` |
| Auth helpers + cookie | `lib/auth.ts:1-63` |
| Middleware guard | `middleware.ts:1-44` |
| Signup Zod (6 steps) | `lib/validations/auth.ts:1-150` |
| Announcement + Employee query Zod | `lib/validations/announcement.ts`, `lib/validations/application.ts` |
| All route handlers | `app/api/**/route.ts` (13 files) |
| Seed data + branches/depts | `prisma/seed.ts:1-210` |
| Env template | `.env.example:1-4` |
| Scripts | `package.json:5-12` |

---

DONE: Documentation plan created at `finreal-portal/docs/DOCUMENTATION_PLAN.md` — covers docs structure (15 docs in 7 folders with Must/Should/Could + RACI), 6 Mermaid diagrams (C4 L1/L2, ER from schema.prisma, sequence signup→approve, 2 state diagrams), 14-route API inventory with table+curl+Zod format and sync process, onboarding guide for MOCK_API vs real DB with env table + troubleshooting, 7 ADRs with context/decision/consequence and file refs, testing strategy (Vitest/Playwright pyramid with coverage goals), security checklist (RA 10173 + pre-deploy), conventions/PR template, MoSCoW roadmap with Sprint 1-3 backlog and gaps (activation UI, role guards, forgot-password, file upload, etc.), and maintenance plan (ownership, triggers, in-repo versioning) — total ~42.5h over 3 weeks, with concrete templates, file locations, and day-by-day checklist.

