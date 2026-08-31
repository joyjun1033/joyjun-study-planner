import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { date } = await params;
  await prisma.screenTimeEntry.deleteMany({ where: { userId: session.user.id, date } });
  return NextResponse.json({ ok: true });
}
