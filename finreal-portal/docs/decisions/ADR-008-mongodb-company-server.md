# ADR-008: MongoDB on Company Physical Server (Single-Node Replica Set)

- **Status:** Accepted (2026-09-07)
- **Deciders:** Finreal Portal Team + Finreal IT (company server owner)
- **Context:** Finreal requires on-prem storage on its company physical server. Team chose MongoDB for flexibility with evolving announcement poll/attachments shape. Prisma requires replica set for transactions, even for single node.

- **Decision:** Host MongoDB as a **single-node replica set in Docker** on the company server, not bare mongod. Use `mongo:7 --replSet rs0` with `rs.initiate()`, `DATABASE_URL="mongodb://host:27017/finreal?replicaSet=rs0&directConnection=true"`, and `npx prisma db push` (not `migrate`). Keep Next.js app on Vercel (or same server) with Tailscale/VPN if needed. Nightly `mongodump --gzip` to separate disk, UPS, and auth+firewall (not 0.0.0.0 open).

- **Consequences:**
  - Positive: Meets "company server as storage" requirement; Prisma transactions work; Docker gives restart/upgrade isolation; no Atlas cost; nightly dumps satisfy RA 10173 audit.
  - Negative: Team owns DBA duties (patching, vacuum, WAL not needed for Mongo but journal + backup checks); single node risks data loss without RAID/UPS; no managed point-in-time restore.

- **Alternatives Considered:**
  - Atlas Free + nightly pull to company server (safer, but violates strict on-prem if required)
  - Bare mongod without replica set (fails Prisma transactions)
  - PostgreSQL on company server (more natural for relational Finreal domain, but team chose Mongo for flexibility)

- **Compliance Notes:** PII (User statutory IDs, contact) stays on-prem; ensure Mongo auth, firewall to VPN only, and dumps encrypted. Document in SECURITY.md.

- **Follow-up:** Convert prisma/schema.prisma to MongoDB (`@id @default(auto()) @map("_id") @db.ObjectId`, String enums, Json for poll/attachments), run `prisma generate` + `db push`, and add backup cron to `docs/setup/SELF_HOSTING.md`.

- **References:** Discussion 2026-09-07, finreal-portal/prisma/schema.prisma, lib/prisma.ts, .env DATABASE_URL
