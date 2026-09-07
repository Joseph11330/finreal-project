import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";
import { updateAnnouncementSchema } from "@/lib/validations/announcement";

/** PATCH /api/announcements/:id - edit content or toggle pinned. Author-only. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (process.env.MOCK_API === "true") { return NextResponse.json({ message: "Announcement updated (mock).", pinned: false }); }

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!announcement) return NextResponse.json({ error: "Announcement not found." }, { status: 404 });

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  if (announcement.authorId !== session.sub && !isAdmin) {
    return NextResponse.json({ error: "You can only edit your own announcements." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = updateAnnouncementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ message: "Announcement updated.", pinned: updated.pinned });
}

/** DELETE /api/announcements/:id - remove an announcement. Author or admin only. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (process.env.MOCK_API === "true") { return NextResponse.json({ message: "Announcement deleted (mock)." }); }

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!announcement) return NextResponse.json({ error: "Announcement not found." }, { status: 404 });

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  if (announcement.authorId !== session.sub && !isAdmin) {
    return NextResponse.json({ error: "You can only delete your own announcements." }, { status: 403 });
  }

  await prisma.announcement.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Announcement deleted." });
}
