import Link from "next/link";

export const metadata = {
  title: "Returns & Exchanges | JihadForge",
  description:
    "Learn about JihadForge's 30-day return policy, size exchanges, and refunds.",
};

export default function ReturnsPage() {
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
          Returns & Exchanges
        </h1>

        <p className="mb-12 text-neutral-400">
          Everything you need to know about returns,
          exchanges, and refunds.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Our Commitment
            </h2>
            <p className="leading-8 text-neutral-300">
              We want you to be confident in every JihadForge
              purchase. If your item arrives damaged, defective,
              or incorrect, we'll work with you to make it right.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              30-Day Return Policy
            </h2>
            <p className="leading-8 text-neutral-300">
              We accept eligible returns within 30 days of
              delivery. Items must be unworn, unwashed, unused,
              and in their original condition, with original
              packaging and tags attached.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              How to Request a Return
            </h2>
            <p className="leading-8 text-neutral-300">
              Before mailing anything back, contact{" "}
              <a
                href="mailto:support@jihadforge.com"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                support@jihadforge.com
              </a>{" "}
              with your order number and reason for the return.
              We'll provide instructions and the appropriate
              return address.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Return Shipping
            </h2>
            <p className="leading-8 text-neutral-300">
              Customers are responsible for return shipping
              costs on regular returns, including changes
              of mind or incorrect size selections.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              The original $5.99 shipping fee is non-refundable
              for regular returns.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Size Exchanges
            </h2>
            <p className="leading-8 text-neutral-300">
              Size exchanges are available within 30 days
              of delivery, subject to product availability
              and our item-condition requirements.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Customers pay to return the original item.
              JihadForge covers shipping for the replacement size.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Refund Processing
            </h2>
            <p className="leading-8 text-neutral-300">
              After receiving and inspecting your returned item,
              we'll confirm whether your refund is approved.
              Approved refunds are issued to the original
              payment method within 5 business days after
              receiving and inspecting the item.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Your bank or payment provider may require
              additional time to process the refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Damaged, Defective, or Incorrect Items
            </h2>
            <p className="leading-8 text-neutral-300">
              If you receive a damaged, defective, or incorrect
              item, please contact us with your order information
              and details of the issue.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              JihadForge covers applicable return and replacement
              shipping costs for verified issues.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Non-Returnable Items
            </h2>
            <p className="leading-8 text-neutral-300">
              Items showing signs of wear, washing, alteration,
              or misuse may not qualify for regular returns
              or exchanges. This does not limit your rights
              under applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Contact Us
            </h2>
            <p className="leading-8 text-neutral-300">
              For questions about returns, refunds, or exchanges,
              email{" "}
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