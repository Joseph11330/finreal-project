import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const centralBranch = await prisma.branch.upsert({
    where: { code: "CENTRAL" },
    update: {},
    create: { name: "Central Branch", code: "CENTRAL", address: "Makati City, NCR" },
  });
  const ncrBranch = await prisma.branch.upsert({
    where: { code: "NCR" },
    update: {},
    create: { name: "NCR Branch", code: "NCR", address: "Quezon City, NCR" },
  });

  const accounting = await prisma.department.upsert({
    where: { branchId_name: { branchId: centralBranch.id, name: "Accounting & Finance" } },
    update: {},
    create: { name: "Accounting & Finance", branchId: centralBranch.id },
  });
  const operations = await prisma.department.upsert({
    where: { branchId_name: { branchId: centralBranch.id, name: "Operations & HR" } },
    update: {},
    create: { name: "Operations & HR", branchId: centralBranch.id },
  });
  await prisma.department.upsert({
    where: { branchId_name: { branchId: ncrBranch.id, name: "Real Estate Mortgage" } },
    update: {},
    create: { name: "Real Estate Mortgage", branchId: ncrBranch.id },
  });

  const passwordHash = await bcrypt.hash("Password123", 12);

  const maria = await prisma.user.upsert({
    where: { email: "maria.santos@finreal.com" },
    update: {},
    create: {
      email: "maria.santos@finreal.com",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      firstName: "Maria",
      lastName: "Santos",
      dateOfBirth: new Date("1992-03-14"),
      gender: "FEMALE",
      civilStatus: "SINGLE",
      contactNumber: "9175550812",
      address: "Unit 4B, Corporate Plaza, Makati City",
      employeeId: "FS-2024-0812",
      position: "Senior Accountant & Admin",
      employmentType: "REGULAR",
      branchId: centralBranch.id,
      departmentId: accounting.id,
      emergencyContactName: "Ana Santos",
      emergencyContactRelation: "Sister",
      emergencyContactPhone: "9175550999",
      dataPrivacyConsent: true,
      termsConsent: true,
      consentedAt: new Date(),
    },
  });

  const david = await prisma.user.upsert({
    where: { email: "david.chen@finreal.com" },
    update: {},
    create: {
      email: "david.chen@finreal.com",
      passwordHash,
      role: "DEPARTMENT_HEAD",
      status: "ACTIVE",
      firstName: "David",
      lastName: "Chen",
      dateOfBirth: new Date("1988-07-02"),
      gender: "MALE",
      civilStatus: "MARRIED",
      contactNumber: "9175551234",
      address: "Central Branch Staff Housing, Makati City",
      employeeId: "FS-2023-0104",
      position: "HR Operations Lead",
      employmentType: "REGULAR",
      branchId: centralBranch.id,
      departmentId: operations.id,
      emergencyContactName: "Grace Chen",
      emergencyContactRelation: "Spouse",
      emergencyContactPhone: "9175552222",
      dataPrivacyConsent: true,
      termsConsent: true,
      consentedAt: new Date(),
    },
  });

  await prisma.application.upsert({
    where: { documentId: "LAA-2024-0524-001" },
    update: {},
    create: {
      documentId: "LAA-2024-0524-001",
      type: "LATE_ARRIVAL_APPEAL",
      status: "PENDING_REVIEW",
      submittedById: maria.id,
      submissionDate: new Date("2024-05-24"),
      appealType: "Retroactive Appeal",
      dateOfIncident: new Date("2024-05-24"),
      expectedArrivalTime: "09:00 AM",
      actualArrivalTime: "09:42 AM",
      totalDelayMinutes: 42,
      incidentNotes: "Traffic incident along EDSA delayed arrival.",
    },
  });

  console.log("Seed complete:", { maria: maria.email, david: david.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
