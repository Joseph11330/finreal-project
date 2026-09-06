"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4StatutorySchema, type Step4StatutoryInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { WizardData } from "@/components/auth/signup-wizard";

export function Step4Statutory({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: WizardData;
  onNext: (values: Step4StatutoryInput) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4StatutoryInput>({
    resolver: zodResolver(step4StatutorySchema),
    defaultValues: {
      sssNumber: defaultValues.sssNumber ?? "",
      philHealthNumber: defaultValues.philHealthNumber ?? "",
      pagIbigNumber: defaultValues.pagIbigNumber ?? "",
      tinNumber: defaultValues.tinNumber ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Statutory & Government IDs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 4 of 6: Optional at this stage - required before payroll enrollment.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sssNumber">SSS Number</Label>
        <Input id="sssNumber" placeholder="00-0000000-0" error={!!errors.sssNumber} {...register("sssNumber")} />
        {errors.sssNumber && <p className="text-xs text-destructive">{errors.sssNumber.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="philHealthNumber">PhilHealth Number</Label>
        <Input id="philHealthNumber" placeholder="00-000000000-0" error={!!errors.philHealthNumber} {...register("philHealthNumber")} />
        {errors.philHealthNumber && <p className="text-xs text-destructive">{errors.philHealthNumber.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pagIbigNumber">Pag-IBIG (HDMF) Number</Label>
        <Input id="pagIbigNumber" placeholder="0000-0000-0000" error={!!errors.pagIbigNumber} {...register("pagIbigNumber")} />
        {errors.pagIbigNumber && <p className="text-xs text-destructive">{errors.pagIbigNumber.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tinNumber">TIN</Label>
        <Input id="tinNumber" placeholder="000-000-000" error={!!errors.tinNumber} {...register("tinNumber")} />
        {errors.tinNumber && <p className="text-xs text-destructive">{errors.tinNumber.message}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          &larr; Back to Step 3
        </Button>
        <Button type="submit" className="w-full">
          Continue to Step 5 &rarr;
        </Button>
      </div>
    </form>
  );
}
