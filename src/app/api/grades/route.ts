import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withEpoch } from "@/lib/serialize";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const grades = await prisma.grade.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(grades.map(withEpoch));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const examName = typeof body?.examName === "string" ? body.examName.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const date = typeof body?.date === "string" ? body.date : "";
  const scoreType = body?.scoreType === "grade" ? "grade" : "score";
  const value = typeof body?.value === "number" ? body.value : NaN;

  if (!examName || !subject || !date || Number.isNaN(value)) {
    return NextResponse.json({ error: "필수 항목이 비어있습니다." }, { status: 400 });
  }

  const grade = await prisma.grade.create({
    data: { userId: session.user.id, examName, subject, date, scoreType, value },
  });
  return NextResponse.json(withEpoch(grade));
}
