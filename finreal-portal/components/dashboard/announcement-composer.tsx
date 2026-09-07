"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Video, Paperclip, CalendarPlus, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function AnnouncementComposer({
  authorName,
  onPublished,
}: {
  authorName: string;
  onPublished: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<{ name: string; sizeLabel: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const [showInteractions, setShowInteractions] = useState(false);
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // NOTE: this only captures the file's name/size for display - actual
    // upload storage (e.g. S3) isn't wired up yet. See README.
    setAttachment({ name: file.name, sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
  }

  async function handlePublish() {
    setError(null);
    if (!subject.trim() || !body.trim()) {
      setError("Add a subject and a message before publishing.");
      return;
    }
    if (showEventForm && (!eventTitle.trim() || !eventDate)) {
      setError("Give the event a title and a date, or turn off Add Event.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          attachmentName: attachment?.name,
          attachmentSizeLabel: attachment?.sizeLabel,
          allowReactions,
          allowComments,
          event: showEventForm
            ? { title: eventTitle, date: eventDate, time: eventTime || undefined, location: eventLocation || undefined }
            : undefined,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to publish.");
        return;
      }
      setSubject("");
      setBody("");
      setAttachment(null);
      setShowEventForm(false);
      setEventTitle(""); setEventDate(""); setEventTime(""); setEventLocation("");
      onPublished();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border-t-4 border-t-primary bg-card p-5 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="mt-1">
          <AvatarFallback>{initials(authorName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Input
            placeholder="Subject: e.g. Quarterly Townhall / System Maintenance Notice"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="What important update do you need to share today?"
            className="min-h-[110px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          {attachment && (
            <div className="flex w-fit items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5 text-xs">
              <Paperclip className="h-3.5 w-3.5" />
              {attachment.name} <span className="text-muted-foreground">({attachment.sizeLabel})</span>
              <button type="button" onClick={() => setAttachment(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {showEventForm && (
            <div className="space-y-3 rounded-md border bg-secondary/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Event Details</p>
                <button type="button" onClick={() => setShowEventForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Input placeholder="Event title, e.g. Q3 Financial Review & Townhall" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                <Input placeholder="Time, e.g. 2:00 PM" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                <Input placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
              </div>
            </div>
          )}

          {showInteractions && (
            <div className="flex items-center gap-6 rounded-md border bg-secondary/40 p-3 text-sm">
              <label className="flex items-center gap-2">
                <Checkbox checked={allowReactions} onCheckedChange={(v) => setAllowReactions(v === true)} />
                Allow reactions
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={allowComments} onCheckedChange={(v) => setAllowComments(v === true)} />
                Allow comments
              </label>
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <button type="button" className="rounded p-2 hover:bg-muted" title="Add image" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4" />
              </button>
              <button type="button" className="rounded p-2 hover:bg-muted" title="Add video" onClick={() => fileInputRef.current?.click()}>
                <Video className="h-4 w-4" />
              </button>
              <button type="button" className="rounded p-2 hover:bg-muted" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-4 w-4" />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFilePicked} />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setShowEventForm((v) => !v)}
              >
                <CalendarPlus className="h-3.5 w-3.5" /> Add Event
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowInteractions((v) => !v)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Interactions
              </Button>
            </div>

            <Button onClick={handlePublish} loading={submitting}>
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
