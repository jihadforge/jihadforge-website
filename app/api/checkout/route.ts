import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { PRODUCTS, type ProductId } from "@/lib/products";

export const runtime = "nodejs";

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
  return Object.prototype.hasOwnProperty.call(PRODUCTS, value);
}

function normalizeColor(value: string) {
  return value.trim().toLowerCase().replace("gray", "grey");
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!stripeSecretKey || !supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Checkout is not configured." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const stripe = new Stripe(stripeSecretKey);

  let reservationId: string | null = null;
  let stripeSessionId: string | null = null;

  try {
    const body = (await request.json()) as CheckoutRequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const requestedQuantities = new Map<string, number>();
    const seenVariants = new Set<string>();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      [];

    for (const item of body.items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !isProductId(item.productId) ||
        typeof item.size !== "string" ||
        !["S", "M", "L", "XL"].includes(item.size) ||
        typeof item.color !== "string" ||
        !["black", "grey", "sand", "olive green"].includes(
          normalizeColor(item.color)
        ) ||
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

      const { data: databaseProduct, error: productError } =
        await supabase
          .from("products")
          .select(
            "id, status, product_variants(id, size, color, inventory_quantity, active)"
          )
          .eq("slug", item.productId)
          .single();

      if (
        productError ||
        !databaseProduct ||
        databaseProduct.status !== "active"
      ) {
        return NextResponse.json(
          { error: `${product.name} is unavailable.` },
          { status: 409 }
        );
      }

      const variant = databaseProduct.product_variants.find(
        (entry) =>
          entry.active &&
          entry.size === item.size &&
          normalizeColor(entry.color) === normalizeColor(item.color)
      );

      if (!variant) {
        return NextResponse.json(
          {
            error: `${product.name} (${item.color}, ${item.size}) is unavailable.`,
          },
          { status: 409 }
        );
      }

      const totalRequested =
        (requestedQuantities.get(variant.id) ?? 0) +
        item.quantity;
      if (seenVariants.has(variant.id)) {
  return NextResponse.json(
    {
      error:
        "Duplicate size and color found in cart. Please refresh your cart.",
    },
    { status: 400 }
  );
}

seenVariants.add(variant.id);

      if (totalRequested > 10) {
        return NextResponse.json(
          { error: "Maximum 10 units per variant." },
          { status: 400 }
        );
      }

      requestedQuantities.set(variant.id, totalRequested);

      
lineItems.push({
  price_data: {
    currency: "usd",
    product_data: {
  name: product.name,
  description: `Size: ${item.size} | Color: ${item.color}`,
  tax_code: "txcd_20030000",
  metadata: {
        productId: product.id,
        size: item.size,
        color: item.color,
      },
    },
    unit_amount: Math.round(product.price * 100),
  },
  quantity: item.quantity,
});
    }

    const reservationItems = Array.from(
      requestedQuantities.entries()
    ).map(([variant_id, quantity]) => ({
      variant_id,
      quantity,
    }));

    // Stripe Checkout expires in 30 minutes.
    // Keep inventory reserved for 60 minutes to provide
    // additional time for payment confirmation.
    const checkoutExpiresAt = Math.floor(Date.now() / 1000) + 35 * 60;

    const reservationExpiresAt = new Date(
      (checkoutExpiresAt + 30 * 60) * 1000
    ).toISOString();

    // The database performs an atomic stock availability check.
    const { data: reservedId, error: reservationError } =
      await supabase.rpc("reserve_checkout_inventory", {
        p_items: reservationItems,
        p_expires_at: reservationExpiresAt,
      });

    if (reservationError || !reservedId) {
      console.error("Inventory reservation failed:", reservationError);

      return NextResponse.json(
        {
          error:
            "One or more items are no longer available in the requested quantity.",
        },
        { status: 409 }
      );
    }

    reservationId = reservedId as string;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
  mode: "payment",
  automatic_tax: { enabled: true },
  payment_method_types: ["card"],
  line_items: lineItems,
      expires_at: checkoutExpiresAt,
      client_reference_id: reservationId,
      metadata: {
        store: "JihadForge",
        reservationId,
      },
      customer_email:
        typeof body.email === "string" && body.email.trim()
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

    stripeSessionId = session.id;

    const { error: attachError } = await supabase.rpc(
      "attach_checkout_session",
      {
        p_reservation_id: reservationId,
        p_stripe_session_id: session.id,
      }
    );

    if (attachError) {
      console.error("Reservation attachment failed:", attachError);

      // Prevent an untracked checkout from accepting payment.
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (expireError) {
        console.error("Unable to expire Stripe session:", expireError);
      }

      throw new Error("Unable to attach inventory reservation.");
    }

    if (!session.url) {
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (expireError) {
        console.error("Unable to expire Stripe session:", expireError);
      }

      throw new Error("Stripe did not return a Checkout URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

if (reservationId) {
  if (stripeSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        stripeSessionId
      );

      if (session.status === "open") {
        const expiredSession =
  await stripe.checkout.sessions.expire(stripeSessionId);

if (expiredSession.status === "expired") {
  const { error: releaseError } = await supabase.rpc(
    "release_checkout_reservation",
    { p_stripe_session_id: stripeSessionId }
  );

  if (releaseError) {
    console.error("Unable to release reservation:", releaseError);
  }
}
      }

      // Never release a completed or potentially paid checkout.
      // The webhook handles completed payments.
      if (session.status === "expired") {
        const { error: releaseError } = await supabase.rpc(
          "release_checkout_reservation",
          { p_stripe_session_id: stripeSessionId }
        );

        if (releaseError) {
          console.error(
            "Unable to release reservation:",
            releaseError
          );
        }
      }
    } catch (cleanupError) {
      console.error("Stripe session cleanup failed:", cleanupError);
    }
  }

  const { error: cancelError } = await supabase.rpc(
    "cancel_unattached_reservation",
    { p_reservation_id: reservationId }
  );

  if (cancelError) {
    console.error(
      "Unable to cancel unattached reservation:",
      cancelError
    );
  }
}


    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}