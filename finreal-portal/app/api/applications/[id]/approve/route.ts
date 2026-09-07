import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";

/** POST /api/applications/:id/approve - approve a pending application. */
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (process.env.MOCK_API === "true") { return NextResponse.json({ message: "Application approved (mock).", status: "APPROVED" }); }

  const application = await prisma.application.findUnique({ where: { id: params.id } });
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  if (application.status !== "PENDING_REVIEW") {
    return NextResponse.json({ error: "This application has already been reviewed." }, { status: 409 });
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: {
      status: "APPROVED",
      reviewedById: session.sub,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Application approved.", status: updated.status });
}
