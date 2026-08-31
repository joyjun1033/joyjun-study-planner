import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);

  // 다른 사용자의 항목은 매치되지 않도록 userId를 조건에 같이 건다
  const result = await prisma.todo.updateMany({
    where: { id, userId: session.user.id },
    data: typeof body?.done === "boolean" ? { done: body.done } : {},
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { id } = await params;
  await prisma.todo.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
