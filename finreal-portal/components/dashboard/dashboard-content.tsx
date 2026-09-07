"use client";

import { useRef } from "react";
import { AnnouncementComposer } from "@/components/dashboard/announcement-composer";
import { AnnouncementsFeed, type AnnouncementsFeedHandle } from "@/components/dashboard/announcements-feed";
import { PinnedImportant, type PinnedImportantHandle } from "@/components/dashboard/pinned-important";
import { EventCalendar } from "@/components/dashboard/event-calendar";
import { MonthSchedule } from "@/components/dashboard/month-schedule";

export function DashboardContent({ authorName }: { authorName: string }) {
  const feedRef = useRef<AnnouncementsFeedHandle>(null);
  const pinnedRef = useRef<PinnedImportantHandle>(null);

  function handlePublished() {
    feedRef.current?.reload();
    pinnedRef.current?.reload();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold">Publish Announcement</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage broadcast communications for the Finreal network.
          </p>
        </div>
        <AnnouncementComposer authorName={authorName} onPublished={handlePublished} />
        <AnnouncementsFeed ref={feedRef} />
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-7rem)] lg:overflow-hidden">
        <div className="flex h-full flex-col gap-2 [&_.rounded-lg]:!p-3 [&_.text-sm]:!text-[13px] [&_.space-y-3]:!space-y-2">
          <div className="shrink-0">
            <PinnedImportant ref={pinnedRef} />
          </div>
          <div className="shrink-0">
            <EventCalendar />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <MonthSchedule />
          </div>
        </div>
      </div>
    </div>
  );
}