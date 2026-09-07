import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";
import { createAnnouncementSchema } from "@/lib/validations/announcement";

/** GET /api/announcements - published announcements, newest first (or pinned first if ?pinned=1). */
export async function GET(req: NextRequest) {
  if (process.env.MOCK_API === "true") {
    return NextResponse.json({
      announcements: [
        {
          id: "mock-ann-1",
          subject: "Updated Employee Handbook 2024",
          body: "Company policies & operational updates for the new fiscal year.",
          pinned: true,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date().toISOString(),
          author: { name: "Sarah Jenkins", title: "Director of Operations" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-2",
          subject: "System Maintenance Protocol Update",
          body: "Team, please be advised that the new protocol for weekend system maintenance will take effect this coming Friday.",
          pinned: false,
          attachmentName: "Maintenance_Guidelines_v3.pdf",
          attachmentSizeLabel: "2.4 MB",
          createdAt: new Date().toISOString(),
          author: { name: "Sarah Jenkins", title: "Director of Operations" },
          linkedEvent: null,
        },
      ],
    });
  }

  const pinnedOnly = req.nextUrl.searchParams.get("pinned") === "1";

  const announcements = await prisma.announcement.findMany({
    where: pinnedOnly ? { pinned: true } : undefined,
    include: { author: { include: { department: true } }, linkedEvent: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    announcements: announcements.map((a: (typeof announcements)[number]) => ({
      id: a.id,
      subject: a.subject,
      body: a.body,
      pinned: a.pinned,
      attachmentName: a.attachmentName,
      attachmentSizeLabel: a.attachmentSizeLabel,
      createdAt: a.createdAt,
      author: {
        name: `${a.author.firstName} ${a.author.lastName}`,
        title: a.author.position,
      },
      linkedEvent: a.linkedEvent
        ? { id: a.linkedEvent.id, title: a.linkedEvent.title, date: a.linkedEvent.date, time: a.linkedEvent.time }
        : null,
    })),
  });
}

/** POST /api/announcements - publish a new announcement, optionally with a linked event. */
export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (process.env.MOCK_API === "true") {
    return NextResponse.json({ message: "Announcement published (mock).", id: "mock-ann-new" }, { status: 201 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createAnnouncementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const data = parsed.data;

  let linkedEventId: string | undefined;
  if (data.event) {
    const event = await prisma.calendarEntry.create({
      data: {
        title: data.event.title,
        type: "EVENT",
        date: new Date(data.event.date),
        time: data.event.time,
        location: data.event.location,
        pinned: true,
        createdById: session.sub,
      },
    });
    linkedEventId = event.id;
  }

  const announcement = await prisma.announcement.create({
    data: {
      subject: data.subject,
      body: data.body,
      authorId: session.sub,
      attachmentName: data.attachmentName,
      attachmentSizeLabel: data.attachmentSizeLabel,
      allowReactions: data.allowReactions,
      allowComments: data.allowComments,
      linkedEventId,
    },
  });

  return NextResponse.json({ message: "Announcement published.", id: announcement.id }, { status: 201 });
}
