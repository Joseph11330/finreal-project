import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = getSessionFromCookies();
  if (!session) redirect("/login");

  if (process.env.MOCK_API === "true") {
    const rows: [string, string][] = [
      ["Full Name", "Alex Rivera"],
      ["Corporate Email", "alex.rivera@finreal.com"],
      ["Employee ID", "EMP-001"],
      ["Position", "Finance Officer"],
      ["Branch", "Olongapo Main Branch"],
      ["Department", "Finance"],
      ["Contact Number", "+63 9123456789"],
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

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { branch: true, department: true },
  });
  if (!user) redirect("/login");

  const rows: [string, string][] = [
    ["Full Name", `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`],
    ["Corporate Email", user.email],
    ["Employee ID", user.employeeId ?? "\u2014"],
    ["Position", user.position],
    ["Branch", user.branch?.name ?? "\u2014"],
    ["Department", user.department?.name ?? "\u2014"],
    ["Contact Number", `+63 ${user.contactNumber}`],
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
