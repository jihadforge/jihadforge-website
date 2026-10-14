"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useCart } from "../CartProvider";

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [email, setEmail] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0 || isRedirecting) {
      return;
    }

    setIsRedirecting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Checkout error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again."
      );

      setIsRedirecting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#080808] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-3xl border border-white/10 bg-[#0d0d0d] p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">
            Checkout
          </p>

          <h1 className="mt-4 text-4xl font-bold uppercase">
            Your cart is empty
          </h1>

          <p className="mt-4 text-white/45">
            Add a product to your cart before checking out.
          </p>

          <Link
            href="/#shop"
            className="mt-8 inline-flex bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:bg-white/80"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/35">
            Secure checkout
          </p>

          <h1 className="mt-4 text-5xl font-bold uppercase tracking-[-0.04em] sm:text-7xl">
            Complete your order
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-white/45">
            Review your order and continue to Stripe to enter your payment,
            phone number, billing details, and shipping address securely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_420px]"
        >
          <section className="h-fit border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
            <h2 className="text-2xl font-bold uppercase">
              Contact information
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Stripe will use this email for your payment receipt. Your shipping
              and payment details will be collected on Stripe&apos;s secure
              checkout page.
            </p>

            <label className="mt-7 block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Email address
              </span>

              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isRedirecting}
                className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="customer@email.com"
              />
            </label>

            <div className="mt-8 border border-white/10 bg-black/40 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em]">
                What happens next
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                You will be redirected to Stripe to enter your card information,
                phone number, and shipping address. JihadForge never receives
                your full card number.
              </p>
            </div>

            {errorMessage ? (
              <div
                role="alert"
                className="mt-6 border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
              >
                {errorMessage}
              </div>
            ) : null}
          </section>

          <aside className="h-fit border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
            <h2 className="text-2xl font-bold uppercase">Order summary</h2>

            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 py-5"
                >
                  {item.image ? (
                    <div className="relative h-24 w-20 shrink-0 border border-white/10 bg-black p-2">
                     <img
  src={item.image}
  alt={item.name}
  className="h-full w-full object-cover"
/>
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold uppercase">{item.name}</h3>

                    <p className="mt-1 text-sm text-white/40">
                      Size: {item.size}
                    </p>

                    <p className="text-sm text-white/40">
                      Color: {item.color}
                    </p>

                    <p className="text-sm text-white/40">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-lg">
              <span className="font-bold uppercase">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/35">
              Shipping and taxes, when applicable, will be shown on Stripe
              before payment.
            </p>

            <button
              type="submit"
              disabled={isRedirecting}
              className="mt-7 w-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.17em] text-black transition enabled:hover:bg-white/80 disabled:cursor-not-allowed disabled:bg-white/40"
            >
              {isRedirecting ? "Redirecting to Stripe..." : "Continue to payment"}
            </button>

            <Link
              href="/cart"
              className="mt-4 block text-center text-xs font-bold uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
            >
              Return to cart
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}