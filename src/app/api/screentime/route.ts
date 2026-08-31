import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ScreenTimeByDate } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const entries = await prisma.screenTimeEntry.findMany({
    where: { userId: session.user.id },
    select: { date: true, minutes: true },
  });

  const byDate: ScreenTimeByDate = {};
  for (const entry of entries) byDate[entry.date] = entry.minutes;
  return NextResponse.json(byDate);
}

/** 날짜별 upsert. minutes <= 0이면 기록을 지운다 */
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const minutes = typeof body?.minutes === "number" ? body.minutes : NaN;
  if (!date || Number.isNaN(minutes)) {
    return NextResponse.json({ error: "date, minutes가 필요합니다." }, { status: 400 });
  }

  if (minutes <= 0) {
    await prisma.screenTimeEntry.deleteMany({ where: { userId: session.user.id, date } });
    return NextResponse.json({ ok: true });
  }

  await prisma.screenTimeEntry.upsert({
    where: { userId_date: { userId: session.user.id, date } },
    create: { userId: session.user.id, date, minutes },
    update: { minutes },
  });
  return NextResponse.json({ ok: true });
}
