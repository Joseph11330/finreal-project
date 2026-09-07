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
          body: "Company policies & operational updates for the new fiscal year. All employees are required to review the updated handbook by September 15. Key changes include updated leave policies, new remote work guidelines, and revised code of conduct. Please direct questions to HR.",
          pinned: true,
          attachmentName: "Handbook_2024.pdf",
          attachmentSizeLabel: "4.2 MB",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          author: { name: "Sarah Jenkins", title: "Director of Operations" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-2",
          subject: "System Maintenance Protocol Update",
          body: "Team, please be advised that the new protocol for weekend system maintenance will take effect this coming Friday. The downtime window has been reduced to 2 hours (1 AM - 3 AM EST). All critical systems will be backed up prior to maintenance. Contact IT for the full schedule.",
          pinned: false,
          attachmentName: "Maintenance_Guidelines_v3.pdf",
          attachmentSizeLabel: "2.4 MB",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          author: { name: "Sarah Jenkins", title: "Director of Operations" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-3",
          subject: "Q3 Town Hall - Save the Date",
          body: "Join us for the Q3 Town Hall on September 20 at 2:00 PM in the Main Hall and via Teams. We will cover Q3 results, Q4 roadmap, and open Q&A with leadership. Lunch will be provided. Please RSVP by September 18.",
          pinned: true,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          author: { name: "Alex Rivera", title: "Finance Manager" },
          linkedEvent: { id: "evt-1", title: "Q3 Town Hall", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 13).toISOString(), time: "2:00 PM" },
        },
        {
          id: "mock-ann-4",
          subject: "New Benefits Enrollment Period Open",
          body: "The annual benefits enrollment period is now open from September 1-15. This is your opportunity to review and update your health, dental, and retirement selections. Visit the HR portal or contact Maria Santos in HR for assistance. Don''t miss the deadline!",
          pinned: false,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          author: { name: "Maria Santos", title: "HR Officer" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-5",
          subject: "Office Closure - Independence Day",
          body: "In observance of the holiday, all Finreal offices will be closed on June 12. Normal operations resume June 13. Emergency contacts remain available via the usual channels.",
          pinned: false,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          author: { name: "David Chen", title: "Operations Lead" },
          linkedEvent: { id: "evt-2", title: "Independence Day", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), time: null },
        },
        {
          id: "mock-ann-6",
          subject: "IT Security Alert: Phishing Awareness",
          body: "Reminder: Finreal IT has detected an increase in phishing attempts. Please verify sender addresses before clicking links. When in doubt, forward suspicious emails to security@finreal.com. Mandatory 15-min training due by Sept 25.",
          pinned: false,
          attachmentName: "Phishing_Guide.pdf",
          attachmentSizeLabel: "1.1 MB",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
          author: { name: "Carlos Reyes", title: "IT Security Officer" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-7",
          subject: "New Parking Assignments Effective Monday",
          body: "Updated parking assignments for Olongapo Main are now posted in the lobby and on the portal. Please check your new slot number. Questions? Contact Facilities at local 421.",
          pinned: false,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
          author: { name: "Elena Cruz", title: "Facilities Manager" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-8",
          subject: "Wellness Program: Free Health Screening Sept 18",
          body: "Free comprehensive health screening for all employees and one dependent on September 18, 8 AM - 4 PM at the Wellness Center. Includes BP, blood sugar, and eye check. Walk-ins welcome, appointments preferred.",
          pinned: false,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
          author: { name: "Maria Santos", title: "HR Officer" },
          linkedEvent: { id: "evt-3", title: "Health Screening", date: new Date(2026, 8, 18).toISOString(), time: "8:00 AM" },
        },
        {
          id: "mock-ann-9",
          subject: "Finance Deadline: Q3 Expense Reports Due Sept 22",
          body: "Reminder: All Q3 expense reports must be submitted via the portal by September 22, 5 PM. Late submissions will be processed in Q4. Attach all receipts and get manager approval before submitting. Contact Finance for help.",
          pinned: false,
          attachmentName: "Expense_Template_Q3.xlsx",
          attachmentSizeLabel: "860 KB",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
          author: { name: "Alex Rivera", title: "Finance Manager" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-10",
          subject: "Subic Branch Renovation Update",
          body: "The Subic Satellite Office renovation is 80% complete. The new training room and pantry will open September 28. During final works (Sept 25-27), please use the Head Office for meetings. Thank you for your patience!",
          pinned: false,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(),
          author: { name: "David Chen", title: "Operations Lead" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-11",
          subject: "Referral Program: Earn P5,000 per Hire",
          body: "Know someone great? Our employee referral program is now offering P5,000 for every successful hire who stays 3 months. Referrals for Accounting, Operations, and IT are priority. Submit via HR portal.",
          pinned: false,
          attachmentName: null,
          attachmentSizeLabel: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 216).toISOString(),
          author: { name: "Maria Santos", title: "HR Officer" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-12",
          subject: "Mandatory Data Privacy Refresher - Oct 1",
          body: "All staff must complete the RA 10173 Data Privacy refresher by October 1. The 30-min module is available on the portal under Training. Completion is tracked and required for compliance. Don''t wait until the last day!",
          pinned: true,
          attachmentName: "Data_Privacy_Module.pdf",
          attachmentSizeLabel: "3.1 MB",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
          author: { name: "Sarah Jenkins", title: "Director of Operations" },
          linkedEvent: null,
        },
        {
          id: "mock-ann-13",
          subject: "Holiday Schedule 2024-2025 Released",
          body: "The full holiday schedule for the next fiscal year is now available. Highlights: extended break Dec 24-Jan 1, and 3 special non-working days in Q2. Download the calendar PDF or sync to your Outlook.",
          pinned: false,
          attachmentName: "Holiday_Schedule_2024-2025.pdf",
          attachmentSizeLabel: "1.8 MB",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 264).toISOString(),
          author: { name: "Maria Santos", title: "HR Officer" },
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
    const eventDateRaw = data.event.startDate ?? data.event.date;
    const eventTimeRaw = data.event.startTime ?? data.event.time;
    const event = await prisma.calendarEntry.create({
      data: {
        title: data.event.title,
        type: "EVENT",
        date: new Date(eventDateRaw!),
        time: eventTimeRaw,
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