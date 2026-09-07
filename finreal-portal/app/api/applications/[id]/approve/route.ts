import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** POST /api/applications/[id]/approve - approve an application. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // ---------- Mock mode (frontend-only development) ----------
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      message: "Application approved (mock).",
      application: { id, status: "APPROVED" },
    });
  }

  // ---------- Real DB path ----------
  const application = await prisma.application.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return NextResponse.json({
    message: "Application approved.",
    application: { id: application.id, status: application.status },
  });
}
