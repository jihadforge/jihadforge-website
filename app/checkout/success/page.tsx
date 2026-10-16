
"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart, type CartItem } from "@/app/CartProvider";

type PurchasedItem = Pick<
  CartItem,
  "productId" | "size" | "color" | "quantity"
>;

  function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { removePurchasedItems, cartLoaded } = useCart();

  const [status, setStatus] = useState<
    "checking" | "paid" | "error"
  >("checking");

  const processedSession = useRef<string | null>(null);

  useEffect(() => {
  if (!sessionId) {
    setStatus("error");
    return;
  }

  if (!cartLoaded) {
    return;
  }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(
            sessionId!
          )}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Payment verification failed.");
        }

        const result = await response.json();

        if (cancelled) return;

        if (result.paid !== true) {
          setStatus("error");
          return;
        }

        if (processedSession.current !== sessionId) {
          const storageKey = `jihadforge-checkout-${sessionId}`;
          const savedItems = sessionStorage.getItem(storageKey);

          if (savedItems) {
            const purchasedItems = JSON.parse(
              savedItems
            ) as PurchasedItem[];

            removePurchasedItems(
              purchasedItems as CartItem[]
            );

            sessionStorage.removeItem(storageKey);
          }

          processedSession.current = sessionId;
        }

        setStatus("paid");
      } catch (error) {
        console.error("Payment verification error:", error);

        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [sessionId, removePurchasedItems, cartLoaded]);

  const paid = status === "paid";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
      <div className="w-full max-w-2xl border border-white/10 bg-[#0d0d0d] p-10 text-center">
        <p
          className={`text-xs font-bold uppercase tracking-[0.3em] ${
            paid ? "text-green-400" : "text-white/60"
          }`}
        >
          {status === "checking"
            ? "Verifying Payment"
            : paid
              ? "Payment Successful"
              : "Verification Unavailable"}
        </p>

        <h1 className="mt-5 text-5xl font-bold uppercase">
          {paid
            ? "Thank you!"
            : status === "checking"
              ? "Please wait"
              : "Check your order"}
        </h1>

        <p className="mt-6 leading-7 text-white/60">
          {paid
            ? "Your payment has been received successfully."
            : status === "checking"
              ? "We're securely verifying your payment."
              : "We couldn't verify your payment. Please check your order before attempting another checkout."}
        </p>

        {paid && (
          <p className="mt-3 leading-7 text-white/45">
            You will receive an email confirmation shortly
            after your order is processed.
          </p>
        )}

        <Link
          href="/"
          className="mt-10 inline-flex bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white/80"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
          <p className="text-sm uppercase tracking-widest text-white/60">
            Loading checkout...
          </p>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}