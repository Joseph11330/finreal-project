"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1AccountSchema, type Step1AccountInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { WizardData } from "@/components/auth/signup-wizard";

export function Step1Account({
  defaultValues,
  onNext,
}: {
  defaultValues: WizardData;
  onNext: (values: Step1AccountInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1AccountInput>({
    resolver: zodResolver(step1AccountSchema),
    defaultValues: {
      email: defaultValues.email ?? "",
      password: defaultValues.password ?? "",
      confirmPassword: defaultValues.confirmPassword ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Account Credentials</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 1 of 6: Set the email and password you&apos;ll use to sign in.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="e.g. juan.delacruz@finreal.com" error={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="At least 8 characters" error={!!errors.password} {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" placeholder="Re-enter your password" error={!!errors.confirmPassword} {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full">
        Continue to Step 2 &rarr;
      </Button>
    </form>
  );
}
