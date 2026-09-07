import { z } from "zod";

/** Rejecting an application always requires a written reason for the audit trail. */
export const rejectApplicationSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide at least 10 characters explaining the rejection.")
    .max(1000, "Reason is too long."),
});
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>;

export const employeeQuerySchema = z.object({
  search: z.string().optional(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  status: z.enum(["PENDING_REVIEW", "ACTIVE", "SUSPENDED", "REJECTED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(7),
});
export type EmployeeQueryInput = z.infer<typeof employeeQuerySchema>;
