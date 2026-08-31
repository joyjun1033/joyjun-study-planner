import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "현재 비밀번호와 8자 이상의 새 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
