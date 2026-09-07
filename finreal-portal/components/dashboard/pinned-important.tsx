"use client";

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const filteredItems = items.filter(
    (i) =>
      search === "" ||
      (i.kind === "ANNOUNCEMENT"
        ? i.subject.toLowerCase().includes(search.toLowerCase())
        : i.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pinned Important</h2>

      <div className="mt-3 space-y-3">
        {loading && <p className="text-xs text-muted-foreground">Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="text-xs text-muted-foreground">Nothing pinned yet.</p>
        )}
        {!loading &&
          items.slice(0, 3).map((item) => (
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
                    <Badge variant={item.kind === "EVENT" ? "event" : "holiday"}>{item.kind === "EVENT" ? "EVENT" : "HOLIDAY"}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.date)}
                      {item.time ? `, ${item.time}` : ""}
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
          onClick={() => setDialogOpen(true)}
          className="mt-3 block w-full text-center text-xs font-semibold text-primary hover:underline"
        >
          View All ({items.length})
        </button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Pinned Important — All ({items.length})</DialogTitle>
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="mt-3" />
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-4 space-y-3" style={{ maxHeight: "60vh" }}>
            {filteredItems.map((item) => (
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
                      <Badge variant={item.kind === "EVENT" ? "event" : "holiday"}>{item.kind === "EVENT" ? "EVENT" : "HOLIDAY"}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.date)}
                        {item.time ? `, ${item.time}` : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
