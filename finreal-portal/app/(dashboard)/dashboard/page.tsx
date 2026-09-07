import Link from "next/link";
import { FileText, UserCircle, Users, UserCog, Building2, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { href: "/forms", label: "Forms Queue", desc: "Review employee submissions (leave, appeals)", icon: FileText, count: "2 pending" },
  { href: "/profile", label: "My Profile", desc: "Your account and employment record", icon: UserCircle },
  { href: "/user-management/user-directory", label: "User Directory", desc: "Browse all employees by branch & department", icon: Building2, count: "12 employees" },
  { href: "/user-management/admins", label: "Admins", desc: "Accounts with administrative access", icon: UserCog },
  { href: "/about", label: "About", desc: "Finreal, Inc. overview", icon: Info },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Portal</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose a section to begin — each page is one click away.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ href, label, desc, icon: Icon, count }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{label}</CardTitle>
                </div>
                <CardDescription className="mt-2">{desc}</CardDescription>
              </CardHeader>
              {count && <CardContent><span className="text-xs font-medium text-primary">{count}</span></CardContent>}
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Tip: Use the sidebar for quick navigation. Each card goes to one page — work through them one by one.</p>
    </div>
  );
}
