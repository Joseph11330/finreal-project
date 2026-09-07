import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionFromCookies();
  if (!session) redirect("/login");

  if (process.env.MOCK_API === "true") {
    const fullName = "Alex Rivera";
    const subtitle = "Finance \u2022 Admin";
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

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { department: true },
  });
  if (!user) redirect("/login");

  const fullName = `${user.firstName} ${user.lastName}`;
  const subtitle = [user.department?.name, user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "Admin" : null]
    .filter(Boolean)
    .join(" \u2022 ");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-secondary/30">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar name={fullName} subtitle={subtitle || "Finreal, Inc."} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
