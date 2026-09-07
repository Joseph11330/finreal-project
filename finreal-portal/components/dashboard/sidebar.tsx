"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  UserCircle,
  Users,
  UserCog,
  Building2,
  LogOut,
  Info,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms", label: "Forms", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

const USER_MANAGEMENT_ITEMS = [
  { href: "/user-management/admins", label: "Admins", icon: UserCog },
  { href: "/user-management/user-directory", label: "User Directory", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [umOpen, setUmOpen] = useState(pathname.startsWith("/user-management"));

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r bg-card px-3 py-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
          F
        </div>
        <span className="text-sm font-bold tracking-wide">FINREAL, INC.</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}

        <div>
          <button
            type="button"
            onClick={() => setUmOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            <span className="flex-1 text-left">User Management</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", umOpen && "rotate-180")} />
          </button>
          {umOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l pl-3">
              {USER_MANAGEMENT_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        <Link
          href="/about"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/about" ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"
          )}
        >
          <Info className="h-4 w-4" />
          About
        </Link>
      </nav>

      <div className="mt-4 flex items-start gap-2 rounded-md border p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-xs">
          <p className="font-semibold">Secure &bull; Reliable &bull; Innovative</p>
          <p className="text-muted-foreground">Your growth, our commitment.</p>
        </div>
      </div>
    </aside>
  );
}
