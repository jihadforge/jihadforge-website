import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-2xl border border-white/10 bg-[#0d0d0d] p-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-400">
          Payment Successful
        </p>

        <h1 className="mt-5 text-5xl font-bold uppercase">
          Thank you!
        </h1>

        <p className="mt-6 text-white/60 leading-7">
          Your payment has been received successfully.
        </p>

        <p className="mt-3 text-white/45 leading-7">
          You will receive an email confirmation shortly after your order is
          processed.
        </p>

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