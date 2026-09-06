import { NextResponse } from "next/server";

const MOCK_BRANCHES = [
  { id: "olongapo-main", name: "Olongapo Main Branch", code: "OLG-001" },
  { id: "subic-satellite", name: "Subic Satellite Office", code: "SUB-002" },
  { id: "head-office", name: "Head Office", code: "HO-003" },
];

const MOCK_DEPARTMENTS = [
  { id: "finance", name: "Finance" },
  { id: "hr", name: "Human Resources" },
  { id: "operations", name: "Operations" },
  { id: "it", name: "IT / Systems" },
];

/**
 * GET /api/branches
 * Returns mock branches with their departments for frontend-only development.
 * In production this would query the database via Prisma.
 */
export async function GET() {
  // In mock mode, return hardcoded data matching the step3 component's static arrays.
  const branches = MOCK_BRANCHES.map((branch) => ({
    ...branch,
    departments: MOCK_DEPARTMENTS,
  }));

  return NextResponse.json({ branches });
}
