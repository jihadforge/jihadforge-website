import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { processCheckoutSession } from "@/lib/stripe-order-handler";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response(
      "Webhook secret is not configured",
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response(
      "Missing Stripe signature",
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Webhook signature verification failed:",
      error
    );

    return new Response(
      "Invalid Stripe signature",
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session =
      event.data.object as Stripe.Checkout.Session;

    return processCheckoutSession(session.id);
  }

  if (event.type === "checkout.session.expired") {
    const eventSession =
      event.data.object as Stripe.Checkout.Session;

    try {
      const session =
        await stripe.checkout.sessions.retrieve(
          eventSession.id
        );

      if (session.status !== "expired") {
        return Response.json({
          received: true,
          skipped: "session not expired",
        });
      }

      const { error } = await supabaseAdmin.rpc(
        "release_checkout_reservation",
        {
          p_stripe_session_id: session.id,
        }
      );

      if (error) {
        throw error;
      }

      return Response.json({ received: true });
    } catch (error) {
      console.error(
        "Reservation release failed:",
        error
      );

      return new Response(
        "Failed to release inventory reservation",
        { status: 500 }
      );
    }
  }

  return Response.json({ received: true });
}