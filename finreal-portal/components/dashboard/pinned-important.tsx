"use client";

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Badge } from "@/components/ui/badge";

type PinnedAnnouncement = {
  id: string;
  subject: string;
  createdAt: string;
  kind: "ANNOUNCEMENT";
};
type PinnedEvent = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  kind: "EVENT" | "HOLIDAY";
};
type PinnedItem = PinnedAnnouncement | PinnedEvent;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type PinnedImportantHandle = { reload: () => void };

export const PinnedImportant = forwardRef<PinnedImportantHandle>(function PinnedImportant(_, ref) {
  const [items, setItems] = useState<PinnedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/announcements?pinned=1").then((r) => r.json()),
      fetch("/api/calendar-entries?pinned=1").then((r) => r.json()),
    ])
      .then(([announcementsJson, entriesJson]) => {
        const announcements: PinnedItem[] = (announcementsJson.announcements ?? []).map(
          (a: { id: string; subject: string; createdAt: string }) => ({
            id: a.id,
            subject: a.subject,
            createdAt: a.createdAt,
            kind: "ANNOUNCEMENT" as const,
          })
        );
        const entries: PinnedItem[] = (entriesJson.entries ?? []).map(
          (e: { id: string; title: string; date: string; time: string | null; type: "EVENT" | "HOLIDAY" }) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            time: e.time,
            kind: e.type,
          })
        );
        setItems(
          [...entries, ...announcements].sort((a, b) => {
            const dateA = "date" in a ? a.date : a.createdAt;
            const dateB = "date" in b ? b.date : b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useImperativeHandle(ref, () => ({ reload: load }), [load]);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="font-bold">Pinned Important</h2>

      <div className="mt-3 space-y-3">
        {loading && <p className="text-xs text-muted-foreground">Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="text-xs text-muted-foreground">Nothing pinned yet.</p>
        )}
        {!loading && (showAll ? items : items.slice(0, 3)).map((item) => (
          <div key={item.id} className="border-b pb-3 last:border-none last:pb-0">
            {item.kind === "ANNOUNCEMENT" ? (
              <>
                <p className="text-sm font-semibold">{item.subject}</p>
                <p className="mt-1 text-xs text-muted-foreground">Posted {formatDate(item.createdAt)}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold">{item.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={item.kind === "EVENT" ? "pending" : "rejected"}>{item.kind === "EVENT" ? "EVENT" : "HOLIDAY"}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}{item.time ? `, ${item.time}` : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {items.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 block w-full text-center text-xs font-semibold text-primary hover:underline"
        >
          {showAll ? "Show Less" : "View All Pinned"}
        </button>
      )}
    </div>
  );
});
