"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

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
    <header className="flex h-16 items-center justify-end gap-4 border-b bg-card px-6">
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
