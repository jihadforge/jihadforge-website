import Link from "next/link";

export const metadata = {
  title: "Contact Us | JihadForge",
  description:
    "Contact JihadForge customer support for questions about orders, sizing, shipping, returns, and products.",
};

export default function ContactPage() {
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
          Contact Us
        </h1>

        <p className="mb-12 text-neutral-400">
          Have a question? We're here to help.
          Whether it's about your order, sizing, shipping,
          or our products, feel free to reach out.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Customer Support
            </h2>
            <p className="leading-8 text-neutral-300">
              For questions about orders, products,
              shipping, returns, or exchanges,
              contact us at:
            </p>

            <a
              href="mailto:support@jihadforge.com"
              className="mt-3 inline-block text-lg font-semibold text-white underline underline-offset-4 transition hover:text-neutral-400"
            >
              support@jihadforge.com
            </a>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Business Hours
            </h2>
            <p className="leading-8 text-neutral-300">
              Monday – Friday
              <br />
              9:00 AM – 5:00 PM (Eastern Time)
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Response Time
            </h2>
            <p className="leading-8 text-neutral-300">
              We aim to respond to customer inquiries
              within 1–2 business days.
              Response times may vary during busy
              periods and product launches.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Returns & Exchanges
            </h2>
            <p className="leading-8 text-neutral-300">
              Need to return an item or exchange it
              for a different size? Please contact
              our support email before mailing
              anything back.
            </p>

            <p className="mt-3 leading-8 text-neutral-300">
              You can also review our{" "}
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
              Shipping Questions
            </h2>
            <p className="leading-8 text-neutral-300">
              For details about shipping costs,
              order processing, and estimated
              delivery times, visit our{" "}
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
              Frequently Asked Questions
            </h2>
            <p className="leading-8 text-neutral-300">
              Looking for a quick answer?
              Visit our{" "}
              <Link
                href="/faq"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                FAQ page
              </Link>{" "}
              for information about JihadForge
              products and policies.
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