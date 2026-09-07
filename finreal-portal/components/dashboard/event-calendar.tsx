"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Entry = { id: string; type: "EVENT" | "HOLIDAY"; date: string };

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const days: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push({ date: d, inMonth: d.getMonth() === month });
  }
  return days;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function EventCalendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<Entry[]>([]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  useEffect(() => {
    fetch(`/api/calendar-entries?month=${month + 1}&year=${year}`)
      .then((r) => r.json())
      .then((json) => setEvents(json.entries ?? []));
  }, [month, year]);

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  function entriesOn(date: Date) {
    return events.filter((e) => sameDay(new Date(e.date), date));
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold">
          <CalendarDays className="h-4 w-4 text-primary" /> Event Calendar
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          >
            Today
          </Button>
          <button
            type="button"
            className="rounded p-1 hover:bg-muted"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-muted"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold">{MONTH_NAMES[month]} {year}</p>

      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-xs">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 font-medium text-muted-foreground">{d}</span>
        ))}
        {grid.map(({ date, inMonth }) => {
          const dayEvents = entriesOn(date);
          const hasEvent = dayEvents.some((e) => e.type === "EVENT");
          const hasHoliday = dayEvents.some((e) => e.type === "HOLIDAY");
          const isToday = sameDay(date, today);

          return (
            <div key={date.toISOString()} className="flex flex-col items-center py-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  !inMonth && "text-muted-foreground/40",
                  inMonth && !hasEvent && !hasHoliday && !isToday && "text-foreground",
                  hasEvent && "bg-primary font-semibold text-primary-foreground",
                  !hasEvent && hasHoliday && "bg-destructive/15 font-semibold text-destructive",
                  !hasEvent && !hasHoliday && isToday && "border border-primary font-semibold text-primary"
                )}
              >
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Event</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Holiday</span>
      </div>
    </div>
  );
}