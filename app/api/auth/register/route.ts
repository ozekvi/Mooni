import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationCode } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Пароль обязателен" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 8 символов" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Некорректный формат email" }, { status: 400 });
    }

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Этот email уже зарегистрирован" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: (name && typeof name === "string" && name.trim())
          ? name.trim()
          : email.split("@")[0],
      },
    });

    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationToken.create({
      data: { token: code, userId: user.id, expires },
    });

    // Send email - don't block registration if email fails
    try {
      await sendVerificationEmail(user.email!, code, user.name ?? undefined);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Still return success - user can request resend
    }

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Register error:", error);

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Этот email уже зарегистрирован" }, { status: 400 });
    }

    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}