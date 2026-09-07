import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** POST /api/applications/[id]/reject - reject an application. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // ---------- Mock mode (frontend-only development) ----------
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      message: "Application rejected (mock).",
      application: { id, status: "REJECTED" },
    });
  }

  // ---------- Real DB path ----------
  const application = await prisma.application.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({
    message: "Application rejected.",
    application: { id: application.id, status: application.status },
  });
}
