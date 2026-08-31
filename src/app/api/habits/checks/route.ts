import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** ?month=YYYY-MM 의 체크 기록을 { habitId: { date: true } } 형태로 반환 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const month = new URL(request.url).searchParams.get("month");
  if (!month) return NextResponse.json({ error: "month가 필요합니다." }, { status: 400 });

  const checks = await prisma.habitCheck.findMany({
    where: {
      date: { startsWith: month },
      habit: { userId: session.user.id },
    },
    select: { habitId: true, date: true, checked: true },
  });

  const result: Record<string, Record<string, boolean>> = {};
  for (const check of checks) {
    if (!check.checked) continue;
    result[check.habitId] ??= {};
    result[check.habitId][check.date] = true;
  }

  return NextResponse.json(result);
}
