export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">About Finreal, Inc.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Finreal, Inc. provides centralized control and streamlined operations for
        authorized personnel, ensuring data integrity and operational efficiency
        across every branch and department.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Finreal Corporation. All rights reserved.
      </p>
    </div>
  );
}
