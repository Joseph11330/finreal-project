"use client";

import { useEffect, useState } from "react";
import { Megaphone, CalendarClock, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ScheduleItem = {
  id: string;
  kind: "ANNOUNCEMENT" | "EVENT" | "HOLIDAY";
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  subtitle: string | null;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(iso: string, time: string | null) {
  const d = new Date(iso);
  const base = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  return time ? `${base}, ${time}` : base;
}

function Icon({ kind }: { kind: ScheduleItem["kind"] }) {
  if (kind === "EVENT") return <CalendarClock className="h-4 w-4 text-primary" />;
  if (kind === "HOLIDAY") return <PartyPopper className="h-4 w-4 text-destructive" />;
  return <Megaphone className="h-4 w-4 text-muted-foreground" />;
}

function badgeVariant(kind: ScheduleItem["kind"]) {
  if (kind === "EVENT") return "pending" as const;
  if (kind === "HOLIDAY") return "rejected" as const;
  return "neutral" as const;
}

export function MonthSchedule() {
  const now = new Date();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dashboard/schedule?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .then((r) => r.json())
      .then((json) => setItems(json.items ?? []))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{MONTH_NAMES[now.getMonth()]} Schedule</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {loading && <p className="text-xs text-muted-foreground">Loading schedule...</p>}
        {!loading && items.length === 0 && (
          <p className="text-xs text-muted-foreground">Nothing scheduled this month.</p>
        )}
        {!loading && items.map((item) => (
          <div
            key={`${item.kind}-${item.id}`}
            className={item.kind === "EVENT" ? "rounded-md bg-primary/10 p-3" : "border-b pb-3 last:border-none last:pb-0"}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Icon kind={item.kind} />
                <div>
                  <p className="text-xs text-muted-foreground">{formatDate(item.date, item.time)}</p>
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.location && <p className="text-xs text-muted-foreground">{item.location}</p>}
                  {item.subtitle && !item.location && (
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
              </div>
              <Badge variant={badgeVariant(item.kind)}>{item.kind}</Badge>
            </div>
            {item.kind === "EVENT" && (
              <p className="mt-1 pl-6 text-xs font-semibold text-primary">View full details &rsaquo;</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
