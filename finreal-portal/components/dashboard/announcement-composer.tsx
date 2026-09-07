"use client";

import { useRef, useState } from "react";
import { Paperclip, CalendarPlus, SlidersHorizontal, X, PenLine, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Attachment = { name: string; sizeLabel: string };
type EventData = {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
};
type PollData = { question: string; options: string[] };

function formatEventSummary(d: EventData): string {
  const start = d.startDate ? formatShortDate(d.startDate) : "";
  const end = d.endDate ? formatShortDate(d.endDate) : "";
  const timePart =
    d.startTime || d.endTime ? ` (${[d.startTime, d.endTime].filter(Boolean).join(" - ")})` : "";
  if (start && end && end !== start) return `${start} â€“ ${end}${timePart}`;
  return `${start}${timePart}`;
}

function formatShortDate(iso: string): string {
  // iso is yyyy-mm-dd
  const dt = new Date(iso + "T12:00:00");
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Event modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventDraft, setEventDraft] = useState<EventData>({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
  });
  const [eventData, setEventData] = useState<EventData | null>(null);

  // Interactions modal state
  const [interactionsOpen, setInteractionsOpen] = useState(false);
  const [interactionChoice, setInteractionChoice] = useState<'poll' | 'attendance' | null>(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollData, setPollData] = useState<PollData | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventModalError, setEventModalError] = useState<string | null>(null);

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    const next: Attachment[] = [...attachments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 10 MB limit.`);
        continue;
      }
      if (next.length >= 5) {
        setError("You can attach up to 5 files.");
        break;
      }
      if (next.some((a) => a.name === file.name)) continue;
      next.push({ name: file.name, sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
    }
    setAttachments(next);
    // reset input so same file can be picked again after removal
    e.target.value = "";
  }

  function handleEventSave() {
    setEventModalError(null);
    if (!eventDraft.title.trim() || !eventDraft.startDate) {
      setEventModalError("Give the event a title and a start date.");
      return;
    }
    if (eventDraft.endDate && eventDraft.endDate < eventDraft.startDate) {
      setEventModalError("End date must be on or after start date.");
      return;
    }
    setEventData({ ...eventDraft });
    setEventModalOpen(false);
  }

  function handleEventCancel() {
    setEventModalError(null);
    setEventModalOpen(false);
  }

  function openEventModal() {
    // preload draft from saved eventData so editing keeps values
    if (eventData) setEventDraft({ ...eventData });
    setEventModalError(null);
    setEventModalOpen(true);
  }

  function handleInteractionsSave() {
    const trimmedQuestion = pollQuestion.trim();
    const trimmedOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
    if (trimmedQuestion && trimmedOptions.length >= 2) {
      setPollData({ question: trimmedQuestion, options: trimmedOptions });
    } else {
      // poll not created if incomplete â€” clear previous
      setPollData(null);
    }
    setInteractionsOpen(false);
  }

  function handleAddOption() {
    if (pollOptions.length >= 6) return;
    setPollOptions((prev) => [...prev, ""]);
  }

  function handleRemoveOption(idx: number) {
    if (pollOptions.length <= 2) return;
    setPollOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleOptionChange(idx: number, value: string) {
    setPollOptions((prev) => prev.map((v, i) => (i === idx ? value : v)));
  }

  async function handlePublish() {
    setError(null);
    if (!subject.trim() || !body.trim()) {
      setError("Add a subject and a message before publishing.");
      return;
    }
    if (eventData && (!eventData.title.trim() || !eventData.startDate)) {
      setError("Give the event a title and a start date, or remove the event.");
      return;
    }

    setSubmitting(true);
    try {
      const hasEvent = Boolean(eventData);
      const pollToSend =
        pollData && pollData.question && pollData.options.length >= 2 ? pollData : undefined;

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          // backwards compat: first attachment as singular fields
          attachmentName: attachments[0]?.name,
          attachmentSizeLabel: attachments[0]?.sizeLabel,
          attachments,
          // hide reactions/comments checkboxes per spec â€” keep defaults
          event: hasEvent
            ? {
                title: eventData!.title,
                // new range shape
                startDate: eventData!.startDate,
                endDate: eventData!.endDate || undefined,
                startTime: eventData!.startTime || undefined,
                endTime: eventData!.endTime || undefined,
                location: eventData!.location || undefined,
                // backwards compat
                date: eventData!.startDate,
                time: eventData!.startTime || undefined,
              }
            : undefined,
          poll: pollToSend,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to publish.");
        return;
      }
      setSubject("");
      setBody("");
      setAttachments([]);
      setEventData(null);
      setEventDraft({ title: "", startDate: "", startTime: "", endDate: "", endTime: "", location: "" });
      setPollData(null);
      setPollQuestion("");
      setPollOptions(["", ""]);
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

          {(attachments.length > 0 || eventData || pollData) && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((a) => (
                <div
                  key={a.name}
                  className="flex w-fit items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5 text-xs"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  {a.name} <span className="text-muted-foreground">({a.sizeLabel})</span>
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((x) => x.name !== a.name))}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${a.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {eventData && (
                <div className="flex w-fit items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5 text-xs">
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Event: {eventData.title} â€” {formatEventSummary(eventData)}
                  <button
                    type="button"
                    onClick={() => setEventData(null)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove event"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {pollData && (
                <div className="flex w-fit items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5 text-xs">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Poll: {pollData.question} ({pollData.options.length} options)
                  <button
                    type="button"
                    onClick={() => {
                      setPollData(null);
                      setPollQuestion("");
                      setPollOptions(["", ""]);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove poll"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {eventData && (
                <div className="flex w-fit items-center gap-2 rounded-md border bg-secondary/60 px-3 py-1.5 text-xs">
                  Attendance: enabled
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-3.5 w-3.5" /> Attach
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,application/pdf,application/*"
                className="hidden"
                onChange={handleFilePicked}
              />

              <Button type="button" variant="outline" size="sm" onClick={openEventModal}>
                <CalendarPlus className="h-3.5 w-3.5" /> Add Event
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setInteractionsOpen(true)}>
                <SlidersHorizontal className="h-3.5 w-3.5" /> Interactions
              </Button>
            </div>

            <Button onClick={handlePublish} loading={submitting}>
              <PenLine className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Event modal */}
      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 py-5">
            <div className="space-y-1.5">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                placeholder="Event title, e.g. Q3 Financial Review & Townhall"
                value={eventDraft.title}
                onChange={(e) => setEventDraft((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="event-start-date">Start date</Label>
                <Input
                  id="event-start-date"
                  type="date"
                  value={eventDraft.startDate}
                  onChange={(e) => setEventDraft((p) => ({ ...p, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-start-time">Start time</Label>
                <Input
                  id="event-start-time"
                  type="time"
                  value={eventDraft.startTime}
                  onChange={(e) => setEventDraft((p) => ({ ...p, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-end-date">End date</Label>
                <Input
                  id="event-end-date"
                  type="date"
                  value={eventDraft.endDate}
                  onChange={(e) => setEventDraft((p) => ({ ...p, endDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-end-time">End time</Label>
                <Input
                  id="event-end-time"
                  type="time"
                  value={eventDraft.endTime}
                  onChange={(e) => setEventDraft((p) => ({ ...p, endTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="Location"
                value={eventDraft.location}
                onChange={(e) => setEventDraft((p) => ({ ...p, location: e.target.value }))}
              />
            </div>
            {eventModalError && <p className="text-xs text-destructive">{eventModalError}</p>}
            <p className="text-xs text-muted-foreground">Announcement-linked, simple range. Leave end date empty for a single-day event.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleEventCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEventSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interactions modal */}
      <Dialog open={interactionsOpen} onOpenChange={(open) => { setInteractionsOpen(open); if (!open) setInteractionChoice(null); }}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader>
            <DialogTitle>Interactions</DialogTitle>
          </DialogHeader>
          {!interactionChoice ? (
            <div className="grid grid-cols-2 gap-4 px-6 py-5">
              <button type="button" onClick={() => setInteractionChoice("poll")} className="flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-center hover:border-primary hover:bg-primary/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><SlidersHorizontal className="h-6 w-6" /></div>
                <div><p className="font-semibold">Poll</p><p className="mt-1 text-xs text-muted-foreground">Ask a question</p></div>
              </button>
              <button type="button" onClick={() => setInteractionChoice("attendance")} className="flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-center hover:border-primary hover:bg-primary/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><CalendarPlus className="h-6 w-6" /></div>
                <div><p className="font-semibold">Attendance</p><p className="mt-1 text-xs text-muted-foreground">Track who will attend</p></div>
              </button>
            </div>
          ) : interactionChoice === "poll" ? (
            <>
              <div className="space-y-4 px-6 py-5">
                <button type="button" onClick={() => setInteractionChoice(null)} className="text-xs font-medium text-primary hover:underline">&larr; Back</button>
                <div className="space-y-1.5">
                  <Label htmlFor="poll-question">Question</Label>
                  <Input id="poll-question" placeholder="Ask a question..." value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} />
                      <button type="button" onClick={() => handleRemoveOption(idx)} disabled={pollOptions.length <= 2} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-40" aria-label={`Remove option ${idx + 1}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {pollOptions.length < 6 && (
                    <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                      <Plus className="h-3.5 w-3.5" /> Add Option
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Min 2, max 6 options.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => { setInteractionsOpen(false); setInteractionChoice(null); }}>Cancel</Button>
                <Button type="button" onClick={handleInteractionsSave}>Save Poll</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 px-6 py-5">
                <button type="button" onClick={() => setInteractionChoice(null)} className="text-xs font-medium text-primary hover:underline">&larr; Back</button>
                <div className="space-y-3 rounded-md border bg-secondary/40 p-3">
                  <h3 className="text-sm font-semibold">Attendance</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">Attendance tracks who will attend the linked event. Attendees will be shown as Avatar + Name with Total Count on the feed card.</p>
                  <div className="flex items-center gap-3 text-xs"><span className="font-medium">Total: 0</span><span className="text-muted-foreground">No RSVPs yet. Attendees will appear via Going / Not going.</span></div>
                  {!eventData && (<p className="text-xs text-amber-600">Add an event first to enable attendance tracking.</p>)}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => { setInteractionsOpen(false); setInteractionChoice(null); }}>Cancel</Button>
                <Button type="button" onClick={() => { setInteractionsOpen(false); setInteractionChoice(null); }}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
