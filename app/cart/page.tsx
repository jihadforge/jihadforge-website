"use client";

import Link from "next/link";
import { useCart } from "../CartProvider";

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/#shop"
            className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 hover:text-white transition"
          >
            ← Continue Shopping
          </Link>

          <button
            onClick={clearCart}
            className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 hover:text-red-300 transition"
          >
            Clear Cart
          </button>
        </div>

        <h1 className="mt-10 text-5xl font-bold uppercase tracking-tight">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-20 rounded-xl border border-white/10 p-12 text-center">
            <p className="text-xl text-white/60">
              Your cart is currently empty.
            </p>

            <Link
              href="/#shop"
              className="mt-8 inline-block border border-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] hover:bg-white hover:text-black transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Cart Items */}
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-6 rounded-xl border border-white/10 p-6"
                >
                  <div className="flex h-28 w-28 items-center justify-center bg-[#151515]">
                    <img
                      src={item.image || "/jihadforge-logo.png"}
                      alt={item.name}
                      className="h-16 w-16 object-contain opacity-80"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{item.name}</h2>

                    <p className="mt-2 text-white/60">
                      Size: <span className="text-white">{item.size}</span>
                    </p>

                    <p className="text-white/60">
                      Color: <span className="text-white">{item.color}</span>
                    </p>

                    <p className="mt-3 text-lg font-semibold">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="h-10 w-10 border border-white/20 hover:border-white"
                      >
                        −
                      </button>

                      <span className="w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="h-10 w-10 border border-white/20 hover:border-white"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.size,
                            item.color
                          )
                        }
                        className="ml-6 text-sm uppercase tracking-wider text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold uppercase">
                Order Summary
              </h2>

              <div className="mt-8 flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-3 flex justify-between text-white/70">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Link
  href="/checkout"
  className="block w-full bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.17em] text-black transition hover:bg-white/80"
>
  Proceed to checkout
</Link>

              <p className="mt-6 text-center text-sm text-white/40">
                Secure checkout coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}