"use client";

import { useRef, useState, useEffect } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnouncementComposer } from "@/components/dashboard/announcement-composer";
import { AnnouncementsFeed, type AnnouncementsFeedHandle } from "@/components/dashboard/announcements-feed";
import { PinnedImportant, type PinnedImportantHandle } from "@/components/dashboard/pinned-important";
import { EventCalendar } from "@/components/dashboard/event-calendar";
import { MonthSchedule } from "@/components/dashboard/month-schedule";

export function DashboardContent({ authorName }: { authorName: string }) {
  const feedRef = useRef<AnnouncementsFeedHandle>(null);
  const pinnedRef = useRef<PinnedImportantHandle>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const composer = composerRef.current;
    const container = scrollContainerRef.current;
    if (!composer || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowFab(!entry.isIntersecting),
      { root: container, threshold: 0, rootMargin: "-20px 0px 0px 0px" }
    );
    observer.observe(composer);
    return () => observer.disconnect();
  }, []);

  function handleFabClick() {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handlePublished() {
    feedRef.current?.reload();
    pinnedRef.current?.reload();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:h-[calc(100vh-7rem)] lg:overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="space-y-6 lg:col-span-2 lg:h-full lg:overflow-y-auto lg:pr-2 lg:[scrollbar-width:thin]"
      >
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Publish Announcement</h1>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            Create and manage broadcast communications for the Finreal network.
          </p>
        </div>
        <div ref={composerRef}>
          <AnnouncementComposer authorName={authorName} onPublished={handlePublished} />
        </div>
        <AnnouncementsFeed ref={feedRef} />
        <div className={`sticky bottom-6 flex justify-end pr-2 transition-all duration-300 ease-out ${showFab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <Button onClick={handleFabClick} size="lg" className="shadow-lg">
              <PenLine className="h-4 w-4" />
              Publish
            </Button>
          </div>
      </div>

      <div className="space-y-2 lg:h-full lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]">
        <PinnedImportant ref={pinnedRef} />
        <EventCalendar />
        <MonthSchedule />
      </div>
    </div>
  );
}