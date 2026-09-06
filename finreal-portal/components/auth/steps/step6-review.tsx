"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { step6ConsentSchema, type Step6ConsentInput } from "@/lib/validations/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { WizardData } from "@/components/auth/signup-wizard";

export function Step6Review({
  data,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  data: WizardData;
  onSubmit: (values: Step6ConsentInput) => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step6ConsentInput>({
    resolver: zodResolver(step6ConsentSchema),
    defaultValues: {
      dataPrivacyConsent: (data.dataPrivacyConsent as true) ?? undefined,
      termsConsent: (data.termsConsent as true) ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Review & Activate Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 6 of 6: Review mandatory disclosures, agree to terms, and finalize registration.
        </p>
      </div>

      <div className="flex gap-3 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            RA 10173 - Philippine Data Privacy Compliance
          </p>
          <p className="mt-1">
            In compliance with Republic Act No. 10173 (Data Privacy Act of 2012), Finreal, Inc.
            collects and processes personal and employment information exclusively for
            enterprise administration, HR, and payroll records.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Required Legal Consents
        </p>

        <label className="flex cursor-pointer gap-3 rounded-md border border-input p-4 text-sm">
          <Controller
            control={control}
            name="dataPrivacyConsent"
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
            )}
          />
          <span>
            <span className="font-semibold text-destructive">[Mandatory]</span> I attest that
            all information provided across Steps 1 through 5 is accurate and authentic. I
            explicitly consent to the collection, recording, and lawful processing of my
            personal, employment, and statutory information by Finreal, Inc. under RA 10173.
          </span>
        </label>
        {errors.dataPrivacyConsent && (
          <p className="mt-1 text-xs text-destructive">{errors.dataPrivacyConsent.message}</p>
        )}

        <label className="mt-3 flex cursor-pointer gap-3 rounded-md border border-input p-4 text-sm">
          <Controller
            control={control}
            name="termsConsent"
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
            )}
          />
          <span>
            I agree to the{" "}
            <a href="/legal/acceptable-use" className="font-medium text-primary hover:underline">
              Finreal Corporate Systems Acceptable Use Policy
            </a>{" "}
            and{" "}
            <a href="/legal/employee-terms" className="font-medium text-primary hover:underline">
              Employee Portal Terms
            </a>
            .
          </span>
        </label>
        {errors.termsConsent && (
          <p className="mt-1 text-xs text-destructive">{errors.termsConsent.message}</p>
        )}
      </div>

      <div className="flex gap-3 rounded-md bg-secondary p-4 text-sm text-secondary-foreground">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <p>
          Upon account submission, your credentials will be provisioned in the Finreal
          Directory and automatically routed to your assigned department dashboard.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          &larr; Back to Step 5
        </Button>
        <Button type="submit" className="w-full" loading={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          Complete Registration & Submit
        </Button>
      </div>
    </form>
  );
}
