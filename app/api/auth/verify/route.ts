import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const token = await prisma.verificationToken.findFirst({
      where: { userId, token: code },
    });

    if (!token) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    if (token.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { id: token.id } });
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({ where: { id: token.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
