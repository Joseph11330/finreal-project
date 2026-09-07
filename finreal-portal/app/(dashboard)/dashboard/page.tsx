import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = getSessionFromCookies();
  if (!session) redirect("/login");

  if (process.env.MOCK_API === "true") {
    return <DashboardContent authorName="Alex Rivera" />;
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) redirect("/login");

  return <DashboardContent authorName={`${user.firstName} ${user.lastName}`} />;
}