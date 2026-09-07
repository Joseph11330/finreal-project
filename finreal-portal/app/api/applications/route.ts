import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/applications - list applications for the Forms queue. */
export async function GET() {
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      applications: [
        { id: "app-1", documentId: "DOC-001", type: "LEAVE_APPLICATION", status: "PENDING", submissionDate: new Date().toISOString(), employeeName: "Maria Santos", department: "Finance" },
        { id: "app-2", documentId: "DOC-002", type: "LATE_ARRIVAL_APPEAL", status: "PENDING", submissionDate: new Date().toISOString(), employeeName: "Juan Dela Cruz", department: "Operations" },
      ],
    });
  }

  const applications = await prisma.application.findMany({
    include: {
      submittedBy: { include: { department: true, branch: true } },
    },
    orderBy: { submissionDate: "desc" },
  });

  return NextResponse.json({
    applications: applications.map((a: (typeof applications)[number]) => ({
      id: a.id,
      documentId: a.documentId,
      type: a.type,
      status: a.status,
      submissionDate: a.submissionDate,
      employeeName: `${a.submittedBy.firstName} ${a.submittedBy.lastName}`,
      department: a.submittedBy.department?.name ?? null,
    })),
  });
}
