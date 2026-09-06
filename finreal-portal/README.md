# Finreal Admin Portal - Auth Module

Login + 6-step signup wizard for the Finreal Olongapo admin portal, matching the
provided UI (split-screen branded layout, "Authorized Access Only" badge,
RA 10173 consent screen).

## Stack
Next.js 14 (App Router) - TypeScript - Tailwind CSS - Shadcn/Radix-style UI -
PostgreSQL + Prisma - React Hook Form + Zod.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` + `JWT_SECRET`.
3. `npx prisma migrate dev --name init`
4. `npm run dev` -> http://localhost:3000 (redirects to `/login`).

## What's included
- `prisma/schema.prisma` - User/Branch/Department models covering every field
  across the 6 signup steps, plus Role/AccountStatus enums.
- `lib/validations/auth.ts` - Zod schema per wizard step + a merged
  `fullSignupSchema` re-validated server-side on submit.
- `lib/auth.ts` - bcrypt hashing, JWT session signing, httpOnly cookie helpers.
- `app/api/auth/{login,register,logout}/route.ts` - route handlers.
- `middleware.ts` - protects every route except `/login`, `/signup`, `/api/*`.
- `app/(auth)/*` - the split-screen shell, login page, and signup wizard.
- `components/auth/steps/*` - one component per wizard step (Account,
  Personal Info, Employment, Statutory IDs, Emergency Contact, Review/Consent).
- `components/ui/*` - minimal Button/Input/Select/Checkbox/Progress/Card
  primitives in the Shadcn convention (`cn()`, `cva`, Radix primitives).

## Design notes
- New accounts are created with `status = PENDING_REVIEW` and cannot sign in
  until an admin activates them - matching the "Authorized Access Only" /
  "routed to your assigned department dashboard" language on screen 3.
- Login returns a generic "Invalid email or password" for both unknown emails
  and wrong passwords, to avoid account enumeration.
- Steps 3-5 (Employment, Statutory IDs, Emergency Contact) were inferred from
  the Step 6 consent text ("personal, employment, and statutory information")
  since only steps 2 and 6 were shown in the screenshots - adjust the fields
  in `lib/validations/auth.ts` and `prisma/schema.prisma` if your actual
  Steps 3-5 differ.
- Branch/Department options in Step 3 are hardcoded placeholders; wire them to
  `GET /api/branches` once that endpoint exists.

## Verified
`npx tsc --noEmit` passes cleanly. `npx prisma generate` could not be verified
in this sandbox (no network access to Prisma's binary CDN) - run it yourself
after `npm install`.
