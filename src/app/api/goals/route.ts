import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMPTY_GOALS } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const goal = await prisma.goal.findUnique({ where: { userId: session.user.id } });
  if (!goal) return NextResponse.json(EMPTY_GOALS);

  return NextResponse.json({
    university: goal.university,
    weekTasks: goal.weekTasks,
    monthScoreTargets: goal.monthScoreTargets,
    monthTasks: goal.monthTasks,
    year: goal.year,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const data: {
    university?: string;
    year?: string;
    weekTasks?: Prisma.InputJsonValue;
    monthTasks?: Prisma.InputJsonValue;
    monthScoreTargets?: Prisma.InputJsonValue;
  } = {};
  if (typeof body.university === "string") data.university = body.university;
  if (typeof body.year === "string") data.year = body.year;
  if (Array.isArray(body.weekTasks)) data.weekTasks = body.weekTasks as Prisma.InputJsonValue;
  if (Array.isArray(body.monthTasks)) data.monthTasks = body.monthTasks as Prisma.InputJsonValue;
  if (Array.isArray(body.monthScoreTargets)) {
    data.monthScoreTargets = body.monthScoreTargets as Prisma.InputJsonValue;
  }

  const goal = await prisma.goal.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      university: EMPTY_GOALS.university,
      year: EMPTY_GOALS.year,
      weekTasks: EMPTY_GOALS.weekTasks as unknown as Prisma.InputJsonValue,
      monthTasks: EMPTY_GOALS.monthTasks as unknown as Prisma.InputJsonValue,
      monthScoreTargets: EMPTY_GOALS.monthScoreTargets as unknown as Prisma.InputJsonValue,
      ...data,
    },
    update: data,
  });

  return NextResponse.json({
    university: goal.university,
    weekTasks: goal.weekTasks,
    monthScoreTargets: goal.monthScoreTargets,
    monthTasks: goal.monthTasks,
    year: goal.year,
  });
}
