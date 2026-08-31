import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });

  await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  return NextResponse.json({ name });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  // 연결된 할 일/목표/일정/성적/습관/스크린타임 기록은 스키마의 onDelete: Cascade로 함께 삭제된다
  await prisma.user.delete({ where: { id: session.user.id } });
  return NextResponse.json({ ok: true });
}
