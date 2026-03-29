import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStripeProduct } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, description, price, currency, category, image } = await req.json();

    if (!name || !description || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create product in Stripe
    const { product: stripeProduct, price: stripePrice } = await createStripeProduct(
      name, description, parseFloat(price), currency || "usd", image
    );

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        currency: currency || "usd",
        category,
        image,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    await prisma.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
