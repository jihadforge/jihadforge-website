
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get(
    "session_id"
  );

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { paid: false },
      { status: 400 }
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    const paid =
      session.status === "complete" &&
      session.payment_status === "paid";

    return NextResponse.json(
      { paid },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Checkout verification failed:", error);

    return NextResponse.json(
      { paid: false },
      { status: 400 }
    );
  }
}