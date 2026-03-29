import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export async function createCheckoutSession(
  productId: string,
  priceId: string,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      userId,
      productId,
    },
  });

  return session;
}

export async function createStripeProduct(
  name: string,
  description: string,
  price: number,
  currency: string = "usd",
  imageUrl?: string
) {
  const product = await stripe.products.create({
    name,
    description,
    images: imageUrl ? [imageUrl] : [],
  });

  const stripePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(price * 100),
    currency,
  });

  return { product, price: stripePrice };
}
