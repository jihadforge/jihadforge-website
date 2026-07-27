import { NextResponse } from "next/server";
import Stripe from "stripe";

import { PRODUCTS, type ProductId } from "@/lib/products";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

type CheckoutCartItem = {
  productId: ProductId;
  size: string;
  color: string;
  quantity: number;
};

type CheckoutRequestBody = {
  items?: CheckoutCartItem[];
  email?: string;
};

function isProductId(value: string): value is ProductId {
  return value in PRODUCTS;
}

export async function POST(request: Request) {
  try {
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is missing.");

      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const body = (await request.json()) as CheckoutRequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of body.items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !isProductId(item.productId) ||
        typeof item.size !== "string" ||
        item.size.trim().length === 0 ||
        typeof item.color !== "string" ||
        item.color.trim().length === 0 ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        return NextResponse.json(
          { error: "One or more cart items are invalid." },
          { status: 400 }
        );
      }

      const product = PRODUCTS[item.productId];

      lineItems.push({
  price_data: {
    currency: "usd",
    product_data: {
      name: product.name,
      description: `Size: ${item.size} | Color: ${item.color}`,
    },
    unit_amount: Math.round(product.price * 100),
  },

  metadata: {
    productId: product.id,
    size: item.size,
    color: item.color,
  },

  quantity: item.quantity,
});
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      metadata: {
  store: "JihadForge",
},

      customer_email:
        typeof body.email === "string" && body.email.trim().length > 0
          ? body.email.trim()
          : undefined,

      phone_number_collection: {
        enabled: true,
      },

      shipping_address_collection: {
        allowed_countries: ["US", "GB", "CA", "AU"],
      },

      billing_address_collection: "auto",

      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}