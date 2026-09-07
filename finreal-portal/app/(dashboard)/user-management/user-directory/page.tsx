import { prisma } from "@/lib/prisma";
import { UserDirectoryTable } from "@/components/dashboard/user-directory-table";

export default async function UserDirectoryPage() {
  const [branches, departments, total] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.user.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">User Directory</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse, filter, and manage employment records and organizational placement across all{" "}
        {total} employees.
      </p>

      <div className="mt-6">
        <UserDirectoryTable
          branches={branches.map((b: (typeof branches)[number]) => ({ id: b.id, name: b.name }))}
          departments={departments.map((d: (typeof departments)[number]) => ({ id: d.id, name: d.name }))}
        />
      </div>
    </div>
  );
}
