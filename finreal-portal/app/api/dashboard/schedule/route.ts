import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard/schedule?month=10&year=2024
 * Merges CalendarEntry (events/holidays) and Announcement (posted-on-date)
 * items for the given month into one chronological feed for the
 * "<Month> Schedule" panel.
 */
export async function GET(req: NextRequest) {
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      items: [
        { id: "mock-ev-1", kind: "EVENT", title: "Q3 Financial Review & Townhall", date: new Date().toISOString(), time: "2:00 PM", location: "Main Auditorium / Zoom", subtitle: null },
        { id: "mock-ann-1", kind: "ANNOUNCEMENT", title: "Updated Employee Handbook 2024", date: new Date().toISOString(), time: null, location: null, subtitle: "Company policies & operational updates for the new fiscal year." },
        { id: "mock-ev-2", kind: "HOLIDAY", title: "Halloween / Special Non-Working Holiday", date: new Date().toISOString(), time: null, location: null, subtitle: "Corporate offices closed worldwide." },
      ],
    });
  }

  const month = Number(req.nextUrl.searchParams.get("month"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  if (!month || !year || month < 1 || month > 12) {
    return NextResponse.json({ error: "Provide a valid month (1-12) and year." }, { status: 422 });
  }

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const [entries, announcements] = await Promise.all([
    prisma.calendarEntry.findMany({ where: { date: { gte: start, lt: end } } }),
    prisma.announcement.findMany({ where: { createdAt: { gte: start, lt: end } } }),
  ]);

  const items = [
    ...entries.map((e: (typeof entries)[number]) => ({
      id: e.id,
      kind: e.type, // "EVENT" | "HOLIDAY"
      title: e.title,
      date: e.date,
      time: e.time,
      location: e.location,
      subtitle: e.description,
    })),
    ...announcements.map((a: (typeof announcements)[number]) => ({
      id: a.id,
      kind: "ANNOUNCEMENT" as const,
      title: a.subject,
      date: a.createdAt,
      time: null,
      location: null,
      subtitle: a.body.slice(0, 80),
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({ items });
}
