import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { processCheckoutSession } from "@/lib/stripe-order-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Recovery is not configured." },
      { status: 503 }
    );
  }

  if (
    request.headers.get("authorization") !==
    `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY!
    );

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { data: reservations, error } =
      await supabase.rpc(
        "get_pending_checkout_recovery",
        { p_limit: 25 }
      );

    if (error) {
      throw error;
    }

    let released = 0;
    let recovered = 0;
    let awaitingPayment = 0;
    let failures = 0;

    for (const reservation of reservations ?? []) {
      try {
        const session =
          await stripe.checkout.sessions.retrieve(
            reservation.stripe_session_id
          );

        if (session.status === "expired") {
          const { error: releaseError } =
            await supabase.rpc(
              "release_checkout_reservation",
              {
                p_stripe_session_id:
                  reservation.stripe_session_id,
              }
            );

          if (releaseError) {
            throw releaseError;
          }

          released++;
          continue;
        }

        if (
          session.status === "complete" &&
          session.payment_status === "paid"
        ) {
          const result = await processCheckoutSession(
            session.id
          );

          if (!result.ok) {
            throw new Error(
              `Order recovery returned HTTP ${result.status}`
            );
          }

          recovered++;
          continue;
        }

        awaitingPayment++;
      } catch (itemError) {
        failures++;

        console.error(
          "Reservation recovery failed:",
          reservation.stripe_session_id,
          itemError
        );
      }
    }

    return NextResponse.json(
      {
        checked: reservations?.length ?? 0,
        released,
        recovered,
        awaitingPayment,
        failures,
      },
      { status: failures > 0 ? 500 : 200 }
    );
  } catch (error) {
    console.error(
      "Inventory recovery failed:",
      error
    );

    return NextResponse.json(
      { error: "Inventory recovery failed." },
      { status: 500 }
    );
  }
}