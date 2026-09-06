import { z } from "zod";

/* ---------------------------------- Login --------------------------------- */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
export type LoginInput = z.infer<typeof loginSchema>;

/* ------------------------- Signup: Step 1 - Account ------------------------ */

export const step1AccountBaseSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  confirmPassword: z.string(),
});

export const step1AccountSchema = step1AccountBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords do not match.", path: ["confirmPassword"] }
);
export type Step1AccountInput = z.infer<typeof step1AccountSchema>;

/* --------------------- Signup: Step 2 - Personal Information -------------- */

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);
export const civilStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "WIDOWED",
  "SEPARATED",
  "DIVORCED",
]);

export const step2PersonalSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required."),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => {
      const dob = new Date(val);
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }, "You must be at least 18 years old."),
  gender: genderEnum,
  civilStatus: civilStatusEnum,
  nationality: z.string().min(1, "Nationality is required."),
  contactNumber: z
    .string()
    .regex(/^9\d{9}$/, "Enter a valid PH mobile number, e.g. 917 555 0812."),
  address: z.string().min(5, "Enter your complete residential address."),
});
export type Step2PersonalInput = z.infer<typeof step2PersonalSchema>;

/* --------------------- Signup: Step 3 - Employment Details ---------------- */

export const employmentTypeEnum = z.enum([
  "REGULAR",
  "PROBATIONARY",
  "CONTRACTUAL",
  "PART_TIME",
]);

export const step3EmploymentSchema = z.object({
  employeeId: z.string().optional(),
  position: z.string().min(1, "Position / job title is required."),
  employmentType: employmentTypeEnum,
  dateHired: z.string().optional(),
  branchId: z.string().min(1, "Select your assigned branch."),
  departmentId: z.string().min(1, "Select your assigned department."),
});
export type Step3EmploymentInput = z.infer<typeof step3EmploymentSchema>;

/* --------------------- Signup: Step 4 - Statutory / Gov IDs ---------------- */

export const step4StatutorySchema = z.object({
  sssNumber: z
    .string()
    .regex(/^\d{2}-\d{7}-\d{1}$/, "Format: 00-0000000-0")
    .optional()
    .or(z.literal("")),
  philHealthNumber: z
    .string()
    .regex(/^\d{2}-\d{9}-\d{1}$/, "Format: 00-000000000-0")
    .optional()
    .or(z.literal("")),
  pagIbigNumber: z
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}$/, "Format: 0000-0000-0000")
    .optional()
    .or(z.literal("")),
  tinNumber: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{3}(-\d{3})?$/, "Format: 000-000-000")
    .optional()
    .or(z.literal("")),
});
export type Step4StatutoryInput = z.infer<typeof step4StatutorySchema>;

/* --------------------- Signup: Step 5 - Emergency Contact ------------------ */

export const step5EmergencySchema = z.object({
  emergencyContactName: z.string().min(1, "Emergency contact name is required."),
  emergencyContactRelation: z.string().min(1, "Relationship is required."),
  emergencyContactPhone: z
    .string()
    .regex(/^9\d{9}$/, "Enter a valid PH mobile number."),
  emergencyContactAddress: z.string().optional(),
});
export type Step5EmergencyInput = z.infer<typeof step5EmergencySchema>;

/* --------------------- Signup: Step 6 - Legal Consent ---------------------- */

export const step6ConsentSchema = z.object({
  dataPrivacyConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to data processing under RA 10173." }),
  }),
  termsConsent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Acceptable Use Policy and Terms." }),
  }),
});
export type Step6ConsentInput = z.infer<typeof step6ConsentSchema>;

/* --------------------------- Full signup payload --------------------------- */
/** Server-side composite schema used to re-validate the entire wizard on submit. */
export const fullSignupSchema = step1AccountBaseSchema
  .merge(step2PersonalSchema)
  .merge(step3EmploymentSchema)
  .merge(step4StatutorySchema)
  .merge(step5EmergencySchema)
  .merge(step6ConsentSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type FullSignupInput = z.infer<typeof fullSignupSchema>;
