import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withEpoch } from "@/lib/serialize";
import { MAX_HABITS } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, createdAt: true },
  });
  return NextResponse.json(habits.map(withEpoch));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "name이 필요합니다." }, { status: 400 });

  const count = await prisma.habit.count({ where: { userId: session.user.id } });
  if (count >= MAX_HABITS) {
    return NextResponse.json(
      { error: `습관은 최대 ${MAX_HABITS}개까지 등록할 수 있어요.` },
      { status: 400 }
    );
  }

  const habit = await prisma.habit.create({
    data: { userId: session.user.id, name },
    select: { id: true, name: true, createdAt: true },
  });
  return NextResponse.json(withEpoch(habit));
}
