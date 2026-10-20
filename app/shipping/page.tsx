import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | JihadForge",
  description:
    "Learn about JihadForge shipping rates, processing times, and delivery estimates.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-12 inline-block text-sm text-neutral-400 transition hover:text-white"
        >
          ← Back to JihadForge
        </Link>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          JIHADFORGE
        </p>

        <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Shipping Policy
        </h1>

        <p className="mb-12 text-neutral-400">
          Everything you need to know about shipping your JihadForge order.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Shipping Locations
            </h2>
            <p className="leading-8 text-neutral-300">
              JihadForge currently ships within the United States
              only. International shipping is not available
              at this time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Shipping Rates
            </h2>
            <p className="leading-8 text-neutral-300">
              We offer a flat shipping rate of{" "}
              <strong className="text-white">
                $5.99 per order
              </strong>{" "}
              within the United States.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Processing Time
            </h2>
            <p className="leading-8 text-neutral-300">
              Orders are typically processed within
              1–3 business days after payment is received,
              excluding weekends and holidays.
              Processing may take longer during busy periods.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Estimated Delivery
            </h2>
            <p className="leading-8 text-neutral-300">
              Once your order ships, estimated delivery
              takes 3–7 business days within the United States.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Including processing time, most orders are
              estimated to arrive within 4–10 business days.
              These timeframes are estimates, not guarantees.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Order Tracking
            </h2>
            <p className="leading-8 text-neutral-300">
              When tracking information is available,
              it will be provided to you by email after
              your order ships.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Lost or Delayed Packages
            </h2>
            <p className="leading-8 text-neutral-300">
              If your package appears lost or significantly
              delayed, please contact us. We'll work with
              the shipping carrier to investigate the issue
              and assist with a resolution.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Returns & Exchanges
            </h2>
            <p className="leading-8 text-neutral-300">
              For information about returns, refunds,
              and size exchanges, please review our{" "}
              <Link
                href="/returns"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                Returns & Exchanges Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Contact Us
            </h2>
            <p className="leading-8 text-neutral-300">
              Have questions about shipping or your order?
              Contact us at{" "}
              <a
                href="mailto:support@jihadforge.com"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                support@jihadforge.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-neutral-800 pt-8 text-sm text-neutral-500">
          © {new Date().getFullYear()} JihadForge.
          All rights reserved.
        </div>
      </div>
    </main>
  );
}