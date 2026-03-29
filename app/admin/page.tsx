import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export const metadata = { title: "Admin — Mooni Services" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const [products, orders, users] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } },
      orderBy: { createdAt: "desc" }, take: 50,
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, discordId: true },
      orderBy: { createdAt: "desc" }, take: 50,
    }),
  ]);

  return (
    <AdminClient
      products={JSON.parse(JSON.stringify(products))}
      orders={JSON.parse(JSON.stringify(orders))}
      users={JSON.parse(JSON.stringify(users))}
    />
  );
}
