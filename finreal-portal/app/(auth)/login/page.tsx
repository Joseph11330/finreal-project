import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to access your administrative dashboard.
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        AUTHORIZED ACCESS ONLY
      </span>

      <div className="mt-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Need IT support?{" "}
        <a href="mailto:helpdesk@finreal-olongapo.com" className="font-medium text-primary hover:underline">
          Contact Helpdesk
        </a>
      </p>
    </div>
  );
}
