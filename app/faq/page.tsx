import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions | JihadForge",
  description:
    "Find answers to common questions about JihadForge, modest clothing, shipping, returns, and exchanges.",
};

export default function FAQPage() {
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
          Frequently Asked Questions
        </h1>

        <p className="mb-12 text-neutral-400">
          Everything you need to know about JihadForge,
          our products, and your orders.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              What does &quot;Jihad&quot; mean?
            </h2>
            <p className="leading-8 text-neutral-300">
              In Islam, &quot;Jihad&quot; refers to striving or
              struggling toward what is good. Our brand
              reflects the personal struggle for discipline,
              self-improvement, and excellence.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Are your products designed for modesty?
            </h2>
            <p className="leading-8 text-neutral-300">
              Yes. Our products are intentionally designed
              to provide modest coverage while maintaining
              comfort and athletic performance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Where does JihadForge ship?
            </h2>
            <p className="leading-8 text-neutral-300">
              We currently ship within the United States
              only. We plan to expand internationally
              in the future.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              How much does shipping cost?
            </h2>
            <p className="leading-8 text-neutral-300">
              We offer $5.99 flat-rate shipping on all
              orders within the United States.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              How long does shipping take?
            </h2>
            <p className="leading-8 text-neutral-300">
              Orders are typically processed within
              1–3 business days. After shipping,
              delivery is estimated to take
              3–7 business days.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              For more details, please review our{" "}
              <Link
                href="/shipping"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                Shipping Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Do you accept returns?
            </h2>
            <p className="leading-8 text-neutral-300">
              Yes. We accept eligible returns within
              30 days of delivery. Items must be unworn,
              unwashed, and in their original condition.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Customers are responsible for regular
              return shipping costs. The original
              $5.99 shipping fee is non-refundable
              for regular returns.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Can I exchange an item for a different size?
            </h2>
            <p className="leading-8 text-neutral-300">
              Yes. Size exchanges are available within
              30 days of delivery, subject to product
              availability and item condition.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              You pay to send the original item back,
              and JihadForge pays to ship the replacement.
              Please review our{" "}
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
              How do I request a return or exchange?
            </h2>
            <p className="leading-8 text-neutral-300">
              Email{" "}
              <a
                href="mailto:support@jihadforge.com"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                support@jihadforge.com
              </a>{" "}
              with your order number and request.
              Please contact us before mailing
              anything back.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              How do I contact customer support?
            </h2>
            <p className="leading-8 text-neutral-300">
              You can reach us at{" "}
              <a
                href="mailto:support@jihadforge.com"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                support@jihadforge.com
              </a>{" "}
              or visit our{" "}
              <Link
                href="/contact"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                Contact page
              </Link>
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