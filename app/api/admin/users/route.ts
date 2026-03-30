import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

// GET - list users with stats
export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, image: true,
      discordId: true, createdAt: true, emailVerified: true,
      _count: { select: { orders: true } },
    },
  });
  return NextResponse.json(users);
}

// PATCH - ban/unban, change role
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { userId, action } = await req.json();
  if (!userId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Prevent self-modification
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });
  }

  let data: Record<string, any> = {};
  switch (action) {
    case "ban":      data = { role: "banned" }; break;
    case "unban":    data = { role: "user" }; break;
    case "makeAdmin": data = { role: "admin" }; break;
    case "removeAdmin": data = { role: "user" }; break;
    default: return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ success: true, user });
}

// DELETE - permanently delete user
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}
