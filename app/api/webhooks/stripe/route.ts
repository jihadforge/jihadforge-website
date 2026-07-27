import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook secret is not configured", {
      status: 500,
    });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", {
      status: 400,
    });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    console.error("Webhook verification failed:", message);

    return new Response(`Webhook Error: ${message}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const eventSession = event.data.object as Stripe.Checkout.Session;

    try {
      const session = await stripe.checkout.sessions.retrieve(
        eventSession.id,
        {
          expand: ["line_items", "payment_intent"],
        }
      );

      const items =
  session.line_items?.data.map((item) => ({
    productId: item.metadata?.productId ?? null,
    name: item.description,
    size: item.metadata?.size ?? null,
    color: item.metadata?.color ?? null,
    quantity: item.quantity,
    unit_amount: item.price?.unit_amount ?? 0,
    total_amount: item.amount_total,
    currency: item.currency,
  })) ?? [];

      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      const shippingDetails =
        session.collected_information?.shipping_details ?? null;

      const { error } = await supabase.from("orders").upsert(
        {
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntent,
          customer_email:
            session.customer_details?.email ??
            session.customer_email ??
            null,
          customer_name: session.customer_details?.name ?? null,
          customer_phone: session.customer_details?.phone ?? null,
          shipping_address: shippingDetails,
          items,
          subtotal_amount: session.amount_subtotal ?? 0,
          shipping_amount:
            session.total_details?.amount_shipping ?? 0,
          tax_amount: session.total_details?.amount_tax ?? 0,
          total_amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          payment_status: session.payment_status,
          fulfillment_status: "pending",
        },
        {
          onConflict: "stripe_session_id",
        }
      );

      if (error) {
        console.error("Supabase order error:", error);
        return new Response("Failed to save order", {
          status: 500,
        });
      }

      console.log("Order successfully saved:", session.id);
    } catch (error) {
      console.error("Order processing failed:", error);

      return new Response("Order processing failed", {
        status: 500,
      });
    }
  }

  return Response.json({ received: true });
}