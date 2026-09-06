"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2PersonalSchema, type Step2PersonalInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WizardData } from "@/components/auth/signup-wizard";

export function Step2Personal({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: WizardData;
  onNext: (values: Step2PersonalInput) => void;
  onBack: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2PersonalInput>({
    resolver: zodResolver(step2PersonalSchema),
    defaultValues: {
      firstName: defaultValues.firstName ?? "",
      middleName: defaultValues.middleName ?? "",
      lastName: defaultValues.lastName ?? "",
      dateOfBirth: defaultValues.dateOfBirth ?? "",
      gender: defaultValues.gender,
      civilStatus: defaultValues.civilStatus,
      nationality: defaultValues.nationality ?? "Filipino",
      contactNumber: defaultValues.contactNumber ?? "",
      address: defaultValues.address ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Personal Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 2 of 6: Provide your legal name, date of birth, and residential contact details.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="e.g. Maria" error={!!errors.firstName} {...register("firstName")} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="middleName">Middle Name (Optional)</Label>
          <Input id="middleName" placeholder="e.g. Santos" {...register("middleName")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="e.g. Dela Cruz" error={!!errors.lastName} {...register("lastName")} />
        {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" error={!!errors.dateOfBirth} {...register("dateOfBirth")} />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                  <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <p className="text-xs text-destructive">Select a gender.</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Civil Status</Label>
          <Controller
            control={control}
            name="civilStatus"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select Civil Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="WIDOWED">Widowed</SelectItem>
                  <SelectItem value="SEPARATED">Separated</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.civilStatus && <p className="text-xs text-destructive">Select a civil status.</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nationality">Nationality</Label>
          <Input id="nationality" placeholder="Filipino" error={!!errors.nationality} {...register("nationality")} />
          {errors.nationality && <p className="text-xs text-destructive">{errors.nationality.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <div className="flex">
          <span className="flex shrink-0 items-center whitespace-nowrap rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm font-medium">
            PH +63
          </span>
          <Input
            id="contactNumber"
            placeholder="917 555 0812"
            className="rounded-l-none"
            error={!!errors.contactNumber}
            {...register("contactNumber")}
          />
        </div>
        {errors.contactNumber && <p className="text-xs text-destructive">{errors.contactNumber.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Current Residential Address</Label>
        <Input
          id="address"
          placeholder="Unit / Floor, Building Name, Street Address, Barangay, City, Province"
          error={!!errors.address}
          {...register("address")}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          &larr; Back to Step 1
        </Button>
        <Button type="submit" className="w-full">
          Continue to Step 3 &rarr;
        </Button>
      </div>
    </form>
  );
}
