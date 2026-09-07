import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/applications/[id] - fetch a single application by id. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // ---------- Mock mode (frontend-only development) ----------
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      application: {
        id,
        documentId: "DOC-001",
        type: "LEAVE_APPLICATION",
        status: "PENDING",
        submissionDate: new Date().toISOString(),
        employeeName: "Maria Santos",
        department: "Finance",
        details: {},
      },
    });
  }

  // ---------- Real DB path ----------
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      submittedBy: { include: { department: true, branch: true } },
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    application: {
      id: application.id,
      documentId: application.documentId,
      type: application.type,
      status: application.status,
      submissionDate: application.submissionDate,
      employeeName: `${application.submittedBy.firstName} ${application.submittedBy.lastName}`,
      department: application.submittedBy.department?.name ?? null,
      details: {},
    },
  });
}
