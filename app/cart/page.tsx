
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "../CartProvider";

type InventoryVariant = {
  size: string;
  color: string;
  inventory_quantity: number;
  active: boolean;
  products: {
    slug: string;
    status: string;
  };
};

function normalizeColor(value: string) {
  return value.trim().toLowerCase().replace("gray", "grey");
}

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [variants, setVariants] = useState<InventoryVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");

  const refreshInventory = useCallback(async () => {
    setLoading(true);
    setInventoryError("");

    try {
      const response = await fetch("/api/inventory", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to check inventory.");
      }

      const data = await response.json();

      if (!Array.isArray(data.variants)) {
        throw new Error("Invalid inventory response.");
      }

      setVariants(data.variants);
    } catch {
      setInventoryError(
        "Unable to check current stock. Please try again."
      );
      setVariants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshInventory();
  }, [refreshInventory]);

  function getAvailableStock(
    productId: string,
    size: string,
    color: string
  ) {
    const variant = variants.find(
      (entry) =>
        entry.active &&
        entry.products?.slug === productId &&
        entry.size === size &&
        normalizeColor(entry.color) === normalizeColor(color)
    );

    return Math.max(0, variant?.inventory_quantity ?? 0);
  }

  const hasUnavailableItems = items.some((item) => {
    const stock = getAvailableStock(
      item.productId,
      item.size,
      item.color
    );

    return item.quantity > stock;
  });

  const canCheckout =
    !loading &&
    !inventoryError &&
    items.length > 0 &&
    !hasUnavailableItems;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/#shop"
            className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
          >
            ← Continue Shopping
          </Link>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 transition hover:text-red-300"
            >
              Clear Cart
            </button>
          )}
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
              className="mt-8 inline-block border border-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] transition hover:bg-white hover:text-black"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {items.map((item) => {
                const stock = getAvailableStock(
                  item.productId,
                  item.size,
                  item.color
                );

                const unavailable =
                  !loading &&
                  !inventoryError &&
                  item.quantity > stock;

                const maxReached =
                  loading ||
                  !!inventoryError ||
                  item.quantity >= stock ||
                  item.quantity >= 10;

                return (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex flex-col gap-6 rounded-xl border border-white/10 p-6 sm:flex-row"
                  >
                    <div className="h-40 w-full shrink-0 overflow-hidden bg-[#151515] sm:h-36 sm:w-32">
                      <img
                        src={
                          item.image ||
                          "/brand/jf-logo-white.png"
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-bold">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-white/60">
                        Size:{" "}
                        <span className="text-white">
                          {item.size}
                        </span>
                      </p>

                      <p className="text-white/60">
                        Color:{" "}
                        <span className="text-white">
                          {item.color}
                        </span>
                      </p>

                      <p className="mt-3 text-lg font-semibold">
                        ${item.price.toFixed(2)}
                      </p>

                      {!loading && !inventoryError && (
                        <p
                          className={`mt-3 text-sm ${
                            unavailable
                              ? "text-red-400"
                              : "text-white/50"
                          }`}
                        >
                          {stock === 0
                            ? "Out of stock"
                            : unavailable
                              ? `Only ${stock} available. Reduce quantity.`
                              : stock <= 5
                                ? `Only ${stock} left in stock`
                                : "In stock"}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="h-10 w-10 border border-white/20 transition hover:border-white"
                        >
                          −
                        </button>

                        <span className="w-8 text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={maxReached}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="h-10 w-10 border border-white/20 transition enabled:hover:border-white disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.size,
                              item.color
                            )
                          }
                          className="ml-0 text-sm uppercase tracking-wider text-red-400 transition hover:text-red-300 sm:ml-6"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold uppercase">
                Order Summary
              </h2>

              <div className="mt-8 flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-3 flex justify-between gap-6 text-white/70">
                <span>Shipping</span>
                <span className="text-right">
                  Calculated at checkout
                </span>
              </div>

              <div className="mt-8 flex justify-between border-t border-white/10 pt-6 text-xl font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {inventoryError && (
                <p className="mt-5 text-sm text-red-400">
                  {inventoryError}
                </p>
              )}

              {!loading &&
                !inventoryError &&
                hasUnavailableItems && (
                  <p className="mt-5 text-sm text-red-400">
                    Please remove or reduce unavailable items
                    before checking out.
                  </p>
                )}

              {canCheckout ? (
                <Link
                  href="/checkout"
                  className="mt-6 block w-full bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.17em] text-black transition hover:bg-white/80"
                >
                  Proceed to checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 block w-full cursor-not-allowed bg-white/20 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.17em] text-white/40"
                >
                  {loading
                    ? "Checking stock..."
                    : "Checkout unavailable"}
                </button>
              )}

              <button
                type="button"
                onClick={() => void refreshInventory()}
                disabled={loading}
                className="mt-4 w-full text-center text-xs uppercase tracking-widest text-white/50 transition hover:text-white disabled:opacity-40"
              >
                Refresh availability
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}