import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-2xl border border-white/10 bg-[#0d0d0d] p-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
          Payment Cancelled
        </p>

        <h1 className="mt-5 text-5xl font-bold uppercase">
          Checkout Cancelled
        </h1>

        <p className="mt-6 text-white/60 leading-7">
          No payment was taken.
        </p>

        <p className="mt-3 text-white/45 leading-7">
          Your cart is still waiting for you if you would like to complete your purchase.
          purchase.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/checkout"
            className="bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white/80"
          >
            Return to Checkout
          </Link>

          <Link
            href="/cart"
            className="border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] transition hover:border-white"
          >
            View Cart
          </Link>
        </div>
      </div>
    </main>
  );
}