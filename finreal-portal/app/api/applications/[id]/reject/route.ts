import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";
import { rejectApplicationSchema } from "@/lib/validations/application";

/**
 * POST /api/applications/:id/reject
 * Rejection always requires a written reason, stored for the Supervisor
 * audit trail referenced on the review document.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (process.env.MOCK_API === "true") { return NextResponse.json({ message: "Application rejected (mock).", status: "REJECTED" }); }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = rejectApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A rejection reason is required.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const application = await prisma.application.findUnique({ where: { id: params.id } });
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  if (application.status !== "PENDING_REVIEW") {
    return NextResponse.json({ error: "This application has already been reviewed." }, { status: 409 });
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: {
      status: "REJECTED",
      reviewedById: session.sub,
      reviewedAt: new Date(),
      rejectionReason: parsed.data.reason,
    },
  });

  return NextResponse.json({ message: "Application rejected.", status: updated.status });
}
