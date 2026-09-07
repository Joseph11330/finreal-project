import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = getSessionFromCookies();
  if (!session) redirect("/login");

  if (process.env.MOCK_API === "true") {
    return (
      <div>
        <h1 className="text-2xl font-bold">Publish Announcement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage broadcast communications for the Finreal network.
        </p>
        <DashboardContent authorName="Alex Rivera" />
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-bold">Publish Announcement</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create and manage broadcast communications for the Finreal network.
      </p>

      <DashboardContent authorName={`${user.firstName} ${user.lastName}`} />
    </div>
  );
}
