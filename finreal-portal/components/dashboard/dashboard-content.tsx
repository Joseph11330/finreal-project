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
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <AnnouncementComposer authorName={authorName} onPublished={handlePublished} />
        <AnnouncementsFeed ref={feedRef} />
      </div>

      <div className="space-y-6">
        <PinnedImportant ref={pinnedRef} />
        <EventCalendar />
        <MonthSchedule />
      </div>
    </div>
  );
}
