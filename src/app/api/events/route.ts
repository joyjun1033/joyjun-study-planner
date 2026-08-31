import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  if (!date || !title) {
    return NextResponse.json({ error: "date, title이 필요합니다." }, { status: 400 });
  }

  const event = await prisma.examEvent.create({
    data: { userId: session.user.id, date, title, subject },
  });
  return NextResponse.json(event);
}
