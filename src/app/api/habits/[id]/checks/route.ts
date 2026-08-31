import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** 체크 토글: 기록이 있으면 지우고(미체크), 없으면 만든다(체크) */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { id: habitId } = await params;
  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  if (!date) return NextResponse.json({ error: "date가 필요합니다." }, { status: 400 });

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: session.user.id },
    select: { id: true },
  });
  if (!habit) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });

  const existing = await prisma.habitCheck.findUnique({
    where: { habitId_date: { habitId, date } },
  });

  if (existing) {
    await prisma.habitCheck.delete({ where: { id: existing.id } });
    return NextResponse.json({ checked: false });
  }

  await prisma.habitCheck.create({ data: { habitId, date, checked: true } });
  return NextResponse.json({ checked: true });
}
