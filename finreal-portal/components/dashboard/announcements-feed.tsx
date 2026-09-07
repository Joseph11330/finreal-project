"use client";

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Pin, Pencil, Trash2, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Announcement = {
  id: string;
  subject: string;
  body: string;
  pinned: boolean;
  attachmentName: string | null;
  attachmentSizeLabel: string | null;
  createdAt: string;
  author: { name: string; title: string };
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export type AnnouncementsFeedHandle = { reload: () => void };

export const AnnouncementsFeed = forwardRef<AnnouncementsFeedHandle>(
  function AnnouncementsFeed(_props, ref) {
    const [sort, setSort] = useState<"newest" | "oldest">("newest");
    const [items, setItems] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
      setLoading(true);
      fetch("/api/announcements")
        .then((res) => res.json())
        .then((json) => setItems(json.announcements ?? []))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);
    useImperativeHandle(ref, () => ({ reload: load }), [load]);

    const sorted = [...items].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "newest" ? -diff : diff;
    });

    async function togglePin(id: string, pinned: boolean) {
      await fetch(`/api/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !pinned }),
      });
      load();
    }

    async function remove(id: string) {
      if (!confirm("Delete this announcement?")) return;
      await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      load();
    }

    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Published Announcements</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest")}>
              <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 space-y-4">
          {loading && <p className="py-8 text-center text-sm text-muted-foreground">Loading announcements...</p>}
          {!loading && sorted.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No announcements published yet.</p>
          )}
          {!loading && sorted.map((a) => (
            <div key={a.id} className={cn("rounded-lg border bg-card p-5 shadow-sm", a.pinned && "border-primary/40")}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback>{initials(a.author.name)}</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">{a.author.name}</p>
                    <p className="text-xs text-muted-foreground">{a.author.title} &bull; {timeAgo(a.createdAt)}</p>
                  </div>
                </div>
                {(
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button
                      type="button"
                      title={a.pinned ? "Unpin" : "Pin"}
                      onClick={() => togglePin(a.id, a.pinned)}
                      className={cn("rounded p-1.5 hover:bg-muted", a.pinned && "text-primary")}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button type="button" title="Edit" className="rounded p-1.5 hover:bg-muted">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => remove(a.id)}
                      className="rounded p-1.5 hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="mt-3 text-base font-bold">{a.subject}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>

              {a.attachmentName && (
                <div className="mt-3 flex w-fit items-center gap-2 rounded-md border bg-secondary/60 px-3 py-2 text-xs">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{a.attachmentName}</span>
                  {a.attachmentSizeLabel && <span className="text-muted-foreground">{a.attachmentSizeLabel}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
