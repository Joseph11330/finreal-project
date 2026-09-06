"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3EmploymentSchema, type Step3EmploymentInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WizardData } from "@/components/auth/signup-wizard";

// In production these would come from GET /api/branches and /api/branches/:id/departments.
const BRANCHES = [
  { id: "olongapo-main", name: "Olongapo Main Branch" },
  { id: "subic-satellite", name: "Subic Satellite Office" },
  { id: "head-office", name: "Head Office" },
];
const DEPARTMENTS = [
  { id: "finance", name: "Finance" },
  { id: "hr", name: "Human Resources" },
  { id: "operations", name: "Operations" },
  { id: "it", name: "IT / Systems" },
];

export function Step3Employment({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: WizardData;
  onNext: (values: Step3EmploymentInput) => void;
  onBack: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3EmploymentInput>({
    resolver: zodResolver(step3EmploymentSchema),
    defaultValues: {
      employeeId: defaultValues.employeeId ?? "",
      position: defaultValues.position ?? "",
      employmentType: defaultValues.employmentType,
      dateHired: defaultValues.dateHired ?? "",
      branchId: defaultValues.branchId ?? "",
      departmentId: defaultValues.departmentId ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Employment Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 3 of 6: Tell us where you&apos;ll be working and in what role.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="employeeId">Employee ID (if issued)</Label>
          <Input id="employeeId" placeholder="e.g. FR-2026-0142" {...register("employeeId")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Position / Job Title</Label>
          <Input id="position" placeholder="e.g. Payroll Analyst" error={!!errors.position} {...register("position")} />
          {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Employment Type</Label>
          <Controller
            control={control}
            name="employmentType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="PROBATIONARY">Probationary</SelectItem>
                  <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.employmentType && <p className="text-xs text-destructive">Select an employment type.</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dateHired">Date Hired (Optional)</Label>
          <Input id="dateHired" type="date" {...register("dateHired")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Assigned Branch</Label>
        <Controller
          control={control}
          name="branchId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.branchId && <p className="text-xs text-destructive">{errors.branchId.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Assigned Department</Label>
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          &larr; Back to Step 2
        </Button>
        <Button type="submit" className="w-full">
          Continue to Step 4 &rarr;
        </Button>
      </div>
    </form>
  );
}
