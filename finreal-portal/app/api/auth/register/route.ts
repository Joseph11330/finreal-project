import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { fullSignupSchema } from "@/lib/validations/auth";

/** True for Prisma's "unique constraint violated" error (P2002), without a hard dependency on generated namespace typings. */
function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  );
}

/**
 * POST /api/auth/register
 * Handles the final submit of the 6-step signup wizard.
 * Accounts are created with status = PENDING_REVIEW; they cannot sign in
 * until an existing ADMIN/SUPER_ADMIN activates them, matching the
 * "Authorized Access Only" model of the Admin Portal.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = fullSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (process.env.MOCK_API === "true") {
    return NextResponse.json(
      {
        message: "Registration submitted (mock). Your credentials will be provisioned once an administrator reviews and activates your account.",
        user: { id: "mock-123", email: data.email, status: "PENDING_REVIEW" },
      },
      { status: 201 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(data.password);

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        civilStatus: data.civilStatus,
        nationality: data.nationality,
        contactNumber: data.contactNumber,
        address: data.address,
        employeeId: data.employeeId || null,
        position: data.position,
        employmentType: data.employmentType,
        dateHired: data.dateHired ? new Date(data.dateHired) : null,
        branchId: data.branchId,
        departmentId: data.departmentId,
        sssNumber: data.sssNumber || null,
        philHealthNumber: data.philHealthNumber || null,
        pagIbigNumber: data.pagIbigNumber || null,
        tinNumber: data.tinNumber || null,
        emergencyContactName: data.emergencyContactName,
        emergencyContactRelation: data.emergencyContactRelation,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactAddress: data.emergencyContactAddress || null,
        dataPrivacyConsent: data.dataPrivacyConsent,
        termsConsent: data.termsConsent,
        consentedAt: new Date(),
      },
      select: { id: true, email: true, status: true },
    });

    return NextResponse.json(
      {
        message:
          "Registration submitted. Your credentials will be provisioned once an administrator reviews and activates your account.",
        user,
      },
      { status: 201 }
    );
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json(
        { error: "A unique field (email or employee ID) is already in use." },
        { status: 409 }
      );
    }
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Failed to complete registration." }, { status: 500 });
  }
}
