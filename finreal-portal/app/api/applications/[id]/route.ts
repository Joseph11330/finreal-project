import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/applications/:id - full document detail for the review modal. */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      id: params.id,
      documentId: "DOC-001",
      type: "LATE_ARRIVAL_APPEAL",
      status: "PENDING_REVIEW",
      submissionDate: new Date().toISOString(),
      appealType: "Retroactive Appeal",
      dateOfIncident: null,
      expectedArrivalTime: "09:00 AM",
      actualArrivalTime: "09:42 AM",
      totalDelayMinutes: 42,
      incidentNotes: "Traffic incident along EDSA.",
      rejectionReason: null,
      reviewedAt: null,
      reviewedByName: null,
      employee: { name: "Maria Santos", employeeId: "EMP-001", department: "Finance", branch: "Olongapo Main Branch" },
    });
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      submittedBy: {
        include: { department: true, branch: true },
      },
      reviewedBy: true,
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  // NOTE: the "Supervisor" shown on the printed document is the employee's
  // department head; wire this to an actual reporting-line lookup once
  // that relationship exists on Department/User.
  return NextResponse.json({
    id: application.id,
    documentId: application.documentId,
    type: application.type,
    status: application.status,
    submissionDate: application.submissionDate,
    appealType: application.appealType,
    dateOfIncident: application.dateOfIncident,
    expectedArrivalTime: application.expectedArrivalTime,
    actualArrivalTime: application.actualArrivalTime,
    totalDelayMinutes: application.totalDelayMinutes,
    incidentNotes: application.incidentNotes,
    rejectionReason: application.rejectionReason,
    reviewedAt: application.reviewedAt,
    reviewedByName: application.reviewedBy
      ? `${application.reviewedBy.firstName} ${application.reviewedBy.lastName}`
      : null,
    employee: {
      name: `${application.submittedBy.firstName} ${application.submittedBy.lastName}`,
      employeeId: application.submittedBy.employeeId,
      department: application.submittedBy.department?.name ?? null,
      branch: application.submittedBy.branch?.name ?? null,
    },
  });
}
