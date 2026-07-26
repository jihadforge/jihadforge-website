"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "../CartProvider";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Test checkout only.
    // No information is currently saved or sent anywhere.
    setSubmitted(true);
  }

  if (items.length === 0 && !submitted) {
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

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#080808] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-3xl border border-white/10 bg-[#0d0d0d] p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">
            Test checkout
          </p>

          <h1 className="mt-4 text-4xl font-bold uppercase">
            Checkout form completed
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/50">
            This was only a test. No payment was collected and no customer
            information was saved or sent.
          </p>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-white/50">
            Real payments, order storage, and confirmation emails will be added
            during Phase 2.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:bg-white/80"
          >
            Return home
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
            Test checkout
          </p>

          <h1 className="mt-4 text-5xl font-bold uppercase tracking-[-0.04em] sm:text-7xl">
            Complete your details
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-white/45">
            This checkout page is currently for testing only. Payment and order
            submission will be connected during Phase 2.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_420px]"
        >
          <section className="border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
            <h2 className="text-2xl font-bold uppercase">
              Contact information
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Email address
                </span>

                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                  placeholder="customer@email.com"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  First name
                </span>

                <input
                  type="text"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Last name
                </span>

                <input
                  type="text"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Phone number
                </span>

                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>
            </div>

            <h2 className="mt-12 text-2xl font-bold uppercase">
              Shipping address
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Street address
                </span>

                <input
                  type="text"
                  name="address"
                  required
                  autoComplete="street-address"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  City
                </span>

                <input
                  type="text"
                  name="city"
                  required
                  autoComplete="address-level2"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  State or province
                </span>

                <input
                  type="text"
                  name="state"
                  required
                  autoComplete="address-level1"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  ZIP or postal code
                </span>

                <input
                  type="text"
                  name="postalCode"
                  required
                  autoComplete="postal-code"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Country
                </span>

                <select
                  name="country"
                  required
                  autoComplete="country-name"
                  defaultValue="United States"
                  className="w-full border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-white/60"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
          </section>

          <aside className="h-fit border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
            <h2 className="text-2xl font-bold uppercase">Order summary</h2>

            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-5">
                  {item.image ? (
                    <div className="h-24 w-20 shrink-0 border border-white/10 bg-black p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
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
              Shipping and taxes will be calculated when the real payment
              system is connected.
            </p>

            <button
              type="submit"
              className="mt-7 w-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.17em] text-black transition hover:bg-white/80"
            >
              Test checkout
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