import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";
import { employeeQuerySchema } from "@/lib/validations/application";

/**
 * GET /api/employees?search=&branchId=&departmentId=&status=&page=&pageSize=
 * Powers the User Directory table: server-side search, filter, and pagination
 * over the employee roster.
 */
export async function GET(req: NextRequest) {
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      total: 1,
      page: 1,
      pageSize: 10,
      employees: [
        { id: "mock-1", name: "Maria Santos", email: "maria@finreal.com", employeeId: "EMP-001", branch: "Olongapo Main", department: "Finance", position: "Accountant", status: "ACTIVE" },
      ],
    });
  }

  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const parsed = employeeQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const { search, branchId, departmentId, status, page, pageSize } = parsed.data;

  const where: Record<string, unknown> = {
    ...(status ? { status } : {}),
    ...(branchId ? { branchId } : {}),
    ...(departmentId ? { departmentId } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { employeeId: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, employees] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: { branch: true, department: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    pageSize,
    employees: employees.map((e: (typeof employees)[number]) => ({
      id: e.id,
      name: `${e.firstName} ${e.lastName}`,
      email: e.email,
      employeeId: e.employeeId,
      branch: e.branch?.name ?? null,
      department: e.department?.name ?? null,
      position: e.position,
      status: e.status,
    })),
  });
}
