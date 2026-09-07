"use client";

import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar({
  name,
  subtitle,
  avatarUrl,
  hasNotifications = false,
}: {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  hasNotifications?: boolean;
}) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-6">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search anything..."
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-14 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          &#8984;K
        </kbd>
      </div>

      <div className="flex items-center gap-5">
        <button type="button" className="relative rounded-full p-2 hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {hasNotifications && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </button>

        <button type="button" className="flex items-center gap-2 rounded-md p-1 hover:bg-muted">
          <Avatar>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
