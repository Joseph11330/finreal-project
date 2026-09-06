"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Step1Account } from "@/components/auth/steps/step1-account";
import { Step2Personal } from "@/components/auth/steps/step2-personal";
import { Step3Employment } from "@/components/auth/steps/step3-employment";
import { Step4Statutory } from "@/components/auth/steps/step4-statutory";
import { Step5Emergency } from "@/components/auth/steps/step5-emergency";
import { Step6Review } from "@/components/auth/steps/step6-review";
import type {
  Step1AccountInput,
  Step2PersonalInput,
  Step3EmploymentInput,
  Step4StatutoryInput,
  Step5EmergencyInput,
  Step6ConsentInput,
} from "@/lib/validations/auth";

const STEP_LABELS = [
  "Account Credentials",
  "Personal Information",
  "Employment Details",
  "Statutory IDs",
  "Emergency Contact",
  "Legal Consent & Account Activation",
];

/** All wizard data collected so far, merged as the user advances through steps. */
export type WizardData = Partial<
  Step1AccountInput &
    Step2PersonalInput &
    Step3EmploymentInput &
    Step4StatutoryInput &
    Step5EmergencyInput &
    Step6ConsentInput
>;

export function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round((step / 6) * 100), [step]);

  function next<T extends WizardData>(values: T) {
    setData((prev) => ({ ...prev, ...values }));
    setStep((s) => Math.min(s + 1, 6));
  }
  function back() {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function submit(values: Step6ConsentInput) {
    const finalData = { ...data, ...values };
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const result = await res.json();
      if (!res.ok) {
        setSubmitError(result.error ?? "Registration failed. Please review your details.");
        setSubmitting(false);
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-primary">STEP {step} OF 6</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="mt-2" />
        <p className="mt-1 text-xs text-muted-foreground">{STEP_LABELS[step - 1]}</p>
      </div>

      {step === 1 && <Step1Account defaultValues={data} onNext={next} />}
      {step === 2 && <Step2Personal defaultValues={data} onNext={next} onBack={back} />}
      {step === 3 && <Step3Employment defaultValues={data} onNext={next} onBack={back} />}
      {step === 4 && <Step4Statutory defaultValues={data} onNext={next} onBack={back} />}
      {step === 5 && <Step5Emergency defaultValues={data} onNext={next} onBack={back} />}
      {step === 6 && (
        <Step6Review
          data={data}
          onSubmit={submit}
          onBack={back}
          submitting={submitting}
          error={submitError}
        />
      )}
    </div>
  );
}
