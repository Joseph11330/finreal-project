import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/calendar-entries?month=10&year=2024
 * Returns events/holidays for the given month, for the Event Calendar grid
 * and the October Schedule panel.
 */
export async function GET(req: NextRequest) {
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      entries: [
        { id: "mock-ev-1", title: "Q3 Financial Review & Townhall", type: "EVENT", date: new Date().toISOString(), time: "2:00 PM", location: "Main Auditorium / Zoom", description: null, pinned: true },
        { id: "mock-ev-2", title: "Halloween / Special Non-Working Holiday", type: "HOLIDAY", date: new Date().toISOString(), time: null, location: null, description: "Corporate offices closed worldwide.", pinned: false },
      ],
    });
  }

  const month = Number(req.nextUrl.searchParams.get("month"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  const pinnedOnly = req.nextUrl.searchParams.get("pinned") === "1";

  if (pinnedOnly) {
    const entries = await prisma.calendarEntry.findMany({
      where: { pinned: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({
      entries: entries.map((e: (typeof entries)[number]) => ({
        id: e.id, title: e.title, type: e.type, date: e.date, time: e.time, location: e.location,
      })),
    });
  }

  if (!month || !year || month < 1 || month > 12) {
    return NextResponse.json({ error: "Provide a valid month (1-12) and year." }, { status: 422 });
  }

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const entries = await prisma.calendarEntry.findMany({
    where: { date: { gte: start, lt: end } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({
    entries: entries.map((e: (typeof entries)[number]) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      date: e.date,
      time: e.time,
      location: e.location,
      description: e.description,
      pinned: e.pinned,
    })),
  });
}
