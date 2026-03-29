import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, code } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
    }

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Код обязателен" }, { status: 400 });
    }

    const cleanCode = code.trim();
    if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) {
      return NextResponse.json({ error: "Код должен содержать 6 цифр" }, { status: 400 });
    }

    const token = await prisma.verificationToken.findFirst({
      where: { userId, token: cleanCode },
    });

    if (!token) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    if (token.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { id: token.id } });
      return NextResponse.json({ error: "Срок действия кода истёк" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({ where: { id: token.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}