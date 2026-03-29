import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationCode } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name: name || email.split("@")[0] },
    });

    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { token: code, userId: user.id, expires },
    });

    await sendVerificationEmail(email, code, user.name || undefined);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
