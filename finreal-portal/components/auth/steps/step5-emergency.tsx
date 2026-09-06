"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step5EmergencySchema, type Step5EmergencyInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { WizardData } from "@/components/auth/signup-wizard";

export function Step5Emergency({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: WizardData;
  onNext: (values: Step5EmergencyInput) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step5EmergencyInput>({
    resolver: zodResolver(step5EmergencySchema),
    defaultValues: {
      emergencyContactName: defaultValues.emergencyContactName ?? "",
      emergencyContactRelation: defaultValues.emergencyContactRelation ?? "",
      emergencyContactPhone: defaultValues.emergencyContactPhone ?? "",
      emergencyContactAddress: defaultValues.emergencyContactAddress ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Emergency Contact</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 5 of 6: Who should we reach in case of an emergency?
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergencyContactName">Full Name</Label>
        <Input id="emergencyContactName" placeholder="e.g. Ana Dela Cruz" error={!!errors.emergencyContactName} {...register("emergencyContactName")} />
        {errors.emergencyContactName && <p className="text-xs text-destructive">{errors.emergencyContactName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergencyContactRelation">Relationship</Label>
        <Input id="emergencyContactRelation" placeholder="e.g. Spouse, Parent, Sibling" error={!!errors.emergencyContactRelation} {...register("emergencyContactRelation")} />
        {errors.emergencyContactRelation && <p className="text-xs text-destructive">{errors.emergencyContactRelation.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergencyContactPhone">Contact Number</Label>
        <div className="flex">
          <span className="flex shrink-0 items-center whitespace-nowrap rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm font-medium">
            PH +63
          </span>
          <Input
            id="emergencyContactPhone"
            placeholder="917 555 0812"
            className="rounded-l-none"
            error={!!errors.emergencyContactPhone}
            {...register("emergencyContactPhone")}
          />
        </div>
        {errors.emergencyContactPhone && <p className="text-xs text-destructive">{errors.emergencyContactPhone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergencyContactAddress">Address (Optional)</Label>
        <Input id="emergencyContactAddress" placeholder="Complete address" {...register("emergencyContactAddress")} />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          &larr; Back to Step 4
        </Button>
        <Button type="submit" className="w-full">
          Continue to Step 6 &rarr;
        </Button>
      </div>
    </form>
  );
}
