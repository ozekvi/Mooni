import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard — Mooni Services" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const [user, orders, products] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true, discordId: true, discordUsername: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.product.findMany({ where: { active: true }, take: 6 }),
  ]);

  return (
    <DashboardClient
      user={user}
      orders={JSON.parse(JSON.stringify(orders))}
      products={JSON.parse(JSON.stringify(products))}
      isAdmin={session.user.role === "admin"}
    />
  );
}
