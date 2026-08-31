import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withEpoch } from "@/lib/serialize";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const date = new URL(request.url).searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date가 필요합니다." }, { status: 400 });

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, date },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(todos.map(withEpoch));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!date || !text) {
    return NextResponse.json({ error: "date, text가 필요합니다." }, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: { userId: session.user.id, date, text },
  });
  return NextResponse.json(withEpoch(todo));
}
