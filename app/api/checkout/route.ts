import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.stripePriceId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const checkoutSession = await createCheckoutSession(
      productId,
      product.stripePriceId,
      session.user.id,
      session.user.email!,
      `${appUrl}/dashboard?success=true`,
      `${appUrl}/services?cancelled=true`
    );

    // Create pending order
    await prisma.order.create({
      data: {
        userId: session.user.id,
        productId,
        status: "pending",
        stripeSessionId: checkoutSession.id,
        amount: product.price,
        currency: product.currency,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
