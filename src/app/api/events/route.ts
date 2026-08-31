import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildWeeklyOccurrences } from "@/lib/date";
import { EVENT_DEFAULT_COLOR } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const events = await prisma.examEvent.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const color =
    typeof body?.color === "string" && /^#[0-9a-fA-F]{6}$/.test(body.color)
      ? body.color
      : EVENT_DEFAULT_COLOR;
  const repeatUntil = typeof body?.repeatUntil === "string" ? body.repeatUntil : "";
  if (!date || !title) {
    return NextResponse.json({ error: "date, title이 필요합니다." }, { status: 400 });
  }

  const dates = repeatUntil && repeatUntil >= date ? buildWeeklyOccurrences(date, repeatUntil) : [date];

  if (dates.length === 1) {
    const event = await prisma.examEvent.create({
      data: { userId: session.user.id, date, title, subject, category, color },
    });
    return NextResponse.json(event);
  }

  await prisma.examEvent.createMany({
    data: dates.map((d) => ({ userId: session.user.id, date: d, title, subject, category, color })),
  });
  return NextResponse.json({ ok: true, count: dates.length });
}
