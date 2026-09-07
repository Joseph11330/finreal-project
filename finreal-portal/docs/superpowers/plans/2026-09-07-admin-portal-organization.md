# Admin Portal Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix MOCK_API crashes in dashboard pages and organize the dashboard as a navigation hub for sequential one-by-one access.

**Architecture:** Add MOCK_API guards to 4 server components to prevent database crashes in frontend-only mode. Replace placeholder dashboard with a card-based navigation hub that provides clear entry points to each admin section.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, lucide-react icons, shadcn/ui Card components.

**Spec:** C:\Users\LENOVO\Desktop\finreal-project\finreal-portal\docs\superpowers\plans\2026-09-07-admin-portal-organization.md (this plan)

## Global Constraints
- All files are in `C:\Users\LENOVO\Desktop\finreal-project\finreal-portal\`
- Use existing shadcn/ui Card components from `@/components/ui/card`
- Use lucide-react icons for consistency with existing codebase
- Maintain existing design system (colors, spacing, typography)
- All changes must pass TypeScript type checking

---

### Task 1: Fix MOCK_API crash in dashboard layout

**Files:**
- Modify: `app/(dashboard)/layout.tsx:7-31`

**Interfaces:**
- Consumes: None
- Produces: Layout component that returns mock UI when MOCK_API="true"

- [ ] **Step 1: Add MOCK_API guard at the top of the async function**

```typescript
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (process.env.MOCK_API === "true") {
    const mockUser = { firstName: "Alex", lastName: "Rivera", department: { name: "Finance" }, role: "ADMIN" as const };
    const fullName = `${mockUser.firstName} ${mockUser.lastName}`;
    const subtitle = "Finance • Admin";
    return (
      <div className="flex h-screen w-full overflow-hidden bg-secondary/30">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar name={fullName} subtitle={subtitle} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    );
  }
  // existing code below...
```

- [ ] **Step 2: Run TypeScript check to verify no errors**

Run: `npx tsc --noEmit`
Expected: No new errors introduced

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/layout.tsx
git commit -m "fix: add MOCK_API guard to dashboard layout to prevent crash"
```

---

### Task 2: Fix MOCK_API crash in profile page

**Files:**
- Modify: `app/(dashboard)/profile/page.tsx:5-40`

**Interfaces:**
- Consumes: None
- Produces: Profile page that returns mock UI when MOCK_API="true"

- [ ] **Step 1: Add MOCK_API guard at the top of the async function**

```typescript
export default async function ProfilePage() {
  if (process.env.MOCK_API === "true") {
    const mockUser = { firstName: "Alex", lastName: "Rivera", middleName: "", email: "alex.rivera@finreal.com", employeeId: "EMP-001", position: "Finance Manager", branch: { name: "Olongapo Main" }, department: { name: "Finance" }, contactNumber: "917 555 0812" };
    const rows: [string, string][] = [
      ["Full Name", `${mockUser.firstName} ${mockUser.middleName ? mockUser.middleName + " " : ""}${mockUser.lastName}`],
      ["Corporate Email", mockUser.email],
      ["Employee ID", mockUser.employeeId],
      ["Position", mockUser.position],
      ["Branch", mockUser.branch.name],
      ["Department", mockUser.department.name],
      ["Contact Number", `+63 ${mockUser.contactNumber}`],
    ];
    return (
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account and employment record.</p>
        <div className="mt-6 max-w-xl divide-y rounded-lg border bg-card">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // existing code below...
```

- [ ] **Step 2: Run TypeScript check to verify no errors**

Run: `npx tsc --noEmit`
Expected: No new errors introduced

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/profile/page.tsx
git commit -m "fix: add MOCK_API guard to profile page to prevent crash"
```

---

### Task 3: Fix MOCK_API crash in admins page

**Files:**
- Modify: `app/(dashboard)/user-management/admins/page.tsx:4-53`

**Interfaces:**
- Consumes: None
- Produces: Admins page that returns mock UI when MOCK_API="true"

- [ ] **Step 1: Add MOCK_API guard at the top of the async function**

```typescript
export default async function AdminsPage() {
  if (process.env.MOCK_API === "true") {
    const admins = [
      { id: "1", firstName: "Alex", lastName: "Rivera", email: "alex.rivera@finreal.com", role: "ADMIN", branch: { name: "Olongapo Main" }, status: "ACTIVE" },
      { id: "2", firstName: "Maria", lastName: "Santos", email: "maria.santos@finreal.com", role: "SUPER_ADMIN", branch: { name: "Manila HQ" }, status: "ACTIVE" },
    ];
    return (
      <div>
        <h1 className="text-2xl font-bold">Admins</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accounts with administrative access to the Finreal portal.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium">{a.firstName} {a.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3">{a.role.replace("_", " ")}</td>
                  <td className="px-4 py-3">{a.branch?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.status === "ACTIVE" ? "active" : "pending"}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  // existing code below...
```

- [ ] **Step 2: Run TypeScript check to verify no errors**

Run: `npx tsc --noEmit`
Expected: No new errors introduced

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/user-management/admins/page.tsx
git commit -m "fix: add MOCK_API guard to admins page to prevent crash"
```

---

### Task 4: Fix MOCK_API crash in user directory page

**Files:**
- Modify: `app/(dashboard)/user-management/user-directory/page.tsx:4-27`

**Interfaces:**
- Consumes: UserDirectoryTable component from `@/components/dashboard/user-directory-table`
- Produces: User directory page that returns mock UI when MOCK_API="true"

- [ ] **Step 1: Add MOCK_API guard at the top of the async function**

```typescript
export default async function UserDirectoryPage() {
  if (process.env.MOCK_API === "true") {
    const branches = [{ id: "olongapo-main", name: "Olongapo Main Branch" }];
    const departments = [{ id: "finance", name: "Finance" }, { id: "hr", name: "HR" }];
    return (
      <div>
        <h1 className="text-2xl font-bold">User Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse, filter, and manage employment records and organizational placement across all 12 employees.
        </p>
        <div className="mt-6">
          <UserDirectoryTable branches={branches} departments={departments} />
        </div>
      </div>
    );
  }
  // existing code below...
```

- [ ] **Step 2: Run TypeScript check to verify no errors**

Run: `npx tsc --noEmit`
Expected: No new errors introduced

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/user-management/user-directory/page.tsx
git commit -m "fix: add MOCK_API guard to user directory page to prevent crash"
```

---

### Task 5: Replace dashboard placeholder with navigation hub

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx:1-11`

**Interfaces:**
- Consumes: Card components from `@/components/ui/card`, lucide-react icons
- Produces: Dashboard page with card grid for navigation

- [ ] **Step 1: Replace entire file content with navigation hub**

```typescript
import Link from "next/link";
import { FileText, UserCircle, Users, UserCog, Building2, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { href: "/forms", label: "Forms Queue", desc: "Review and act on employee submissions (leave, appeals)", icon: FileText, count: "2 pending" },
  { href: "/profile", label: "My Profile", desc: "Your account and employment record", icon: UserCircle },
  { href: "/user-management/user-directory", label: "User Directory", desc: "Browse all employees by branch & department", icon: Building2, count: "12 employees" },
  { href: "/user-management/admins", label: "Admins", desc: "Accounts with administrative access", icon: UserCog },
  { href: "/about", label: "About", desc: "Finreal, Inc. overview", icon: Info },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Portal</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose a section to begin — each page is one click away.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ href, label, desc, icon: Icon, count }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{label}</CardTitle>
                </div>
                <CardDescription className="mt-2">{desc}</CardDescription>
              </CardHeader>
              {count && <CardContent><span className="text-xs font-medium text-primary">{count}</span></CardContent>}
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Tip: Use the sidebar for quick navigation between sections. Each card above goes to one page — work through them one by one.</p>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check to verify no errors**

Run: `npx tsc --noEmit`
Expected: No new errors introduced

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/dashboard/page.tsx
git commit -m "feat: replace dashboard placeholder with card-based navigation hub"
```

---

### Task 6: Final verification

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: All modified files
- Produces: Confirmation that all changes work correctly

- [ ] **Step 1: Run comprehensive TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors across entire project

- [ ] **Step 2: Verify no leftover prisma calls without mock guards**

Manually check these files for direct prisma calls without MOCK_API guards:
1. `app/(dashboard)/layout.tsx` - should have guard before prisma call
2. `app/(dashboard)/profile/page.tsx` - should have guard before prisma call
3. `app/(dashboard)/user-management/admins/page.tsx` - should have guard before prisma call
4. `app/(dashboard)/user-management/user-directory/page.tsx` - should have guard before prisma calls

- [ ] **Step 3: Final commit with all changes**

```bash
git add .
git commit -m "chore: complete admin portal organization for sequential access"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-07-admin-portal-organization.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?