import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function AdminsPage() {
  if (process.env.MOCK_API === "true") {
    const admins = [
      { id: "1", firstName: "Alex", lastName: "Rivera", email: "alex.rivera@finreal.com", role: "ADMIN", branch: { name: "Olongapo Main Branch" }, status: "ACTIVE" as const },
      { id: "2", firstName: "Maria", lastName: "Santos", email: "maria.santos@finreal.com", role: "SUPER_ADMIN", branch: { name: "Olongapo Main Branch" }, status: "ACTIVE" as const },
    ];
    return (
      <div>
        <h1 className="text-2xl font-bold">Admins</h1>
        <p className="mt-1 text-sm text-muted-foreground">Accounts with administrative access to the Finreal portal.</p>
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
                  <td className="px-4 py-3">{a.branch?.name ?? "\u2014"}</td>
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

  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    include: { department: true, branch: true },
    orderBy: { lastName: "asc" },
  });

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
            {admins.map((a: (typeof admins)[number]) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium">{a.firstName} {a.lastName}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                <td className="px-4 py-3">{a.role.replace("_", " ")}</td>
                <td className="px-4 py-3">{a.branch?.name ?? "\u2014"}</td>
                <td className="px-4 py-3">
                  <Badge variant={a.status === "ACTIVE" ? "active" : "pending"}>{a.status}</Badge>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No admin accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
