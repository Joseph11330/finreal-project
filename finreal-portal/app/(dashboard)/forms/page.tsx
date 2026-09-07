import { FormsQueue } from "@/components/dashboard/forms-queue";

export default function FormsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Forms</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Employee-submitted requests awaiting supervisor or HR action.
      </p>
      <div className="mt-6">
        <FormsQueue />
      </div>
    </div>
  );
}
