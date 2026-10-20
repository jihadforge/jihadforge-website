import Link from "next/link";

export const metadata = {
  title: "Terms of Service | JihadForge",
  description:
    "Read the terms and conditions for shopping at JihadForge.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <p className="mb-12 text-neutral-400">
          Please review these terms before using our website
          or purchasing JihadForge products.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Acceptance of Terms
            </h2>
            <p className="leading-8 text-neutral-300">
              By using the JihadForge website or placing
              an order, you agree to these Terms of Service.
              If you do not agree, please do not use
              our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Products and Availability
            </h2>
            <p className="leading-8 text-neutral-300">
              We strive to provide accurate product
              descriptions, images, sizing information,
              prices, and availability.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Product colors may appear slightly different
              depending on your screen settings.
              We may update product information,
              pricing, and availability when necessary.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Orders and Payments
            </h2>
            <p className="leading-8 text-neutral-300">
              All orders are subject to product availability
              and payment authorization.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              We may cancel or decline orders when necessary
              because of suspected fraud, unauthorized
              transactions, unavailable inventory,
              or material pricing errors.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              If we cancel an order after payment has been
              collected, we will issue a refund for the
              canceled items and any associated shipping
              charges paid for those items.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Pricing and Shipping
            </h2>
            <p className="leading-8 text-neutral-300">
              Product prices are displayed in US dollars.
              Applicable taxes and shipping charges are
              shown during checkout.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              JihadForge currently ships within the United
              States only, with a flat shipping rate of
              $5.99 per order.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              For processing times and delivery estimates,
              please review our{" "}
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
              Returns, Exchanges, and Refunds
            </h2>
            <p className="leading-8 text-neutral-300">
              Eligible products may be returned within
              30 days of delivery, subject to our
              return requirements.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              For details about return eligibility,
              shipping costs, size exchanges, and
              refunds, please review our{" "}
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
              Intellectual Property
            </h2>
            <p className="leading-8 text-neutral-300">
              JihadForge branding, original designs,
              logos, product images, written content,
              and other original materials on this
              website are protected by applicable
              intellectual property laws.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              You may not reproduce, distribute, or
              commercially use our protected materials
              without permission, except as permitted
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Website Use
            </h2>
            <p className="leading-8 text-neutral-300">
              You agree not to misuse our website,
              interfere with its operation, attempt
              unauthorized access, or use it for
              fraudulent or unlawful activities.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Third-Party Services
            </h2>
            <p className="leading-8 text-neutral-300">
              Our website uses third-party providers
              for services such as payment processing,
              hosting, and order-related communications.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              These providers may have separate terms
              and privacy practices governing their services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Privacy
            </h2>
            <p className="leading-8 text-neutral-300">
              For information about how we handle
              personal information, please read our{" "}
              <Link
                href="/privacy"
                className="text-white underline underline-offset-4 hover:text-neutral-400"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Changes to These Terms
            </h2>
            <p className="leading-8 text-neutral-300">
              We may update these Terms of Service
              as our business practices or legal
              requirements change.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Updated terms will be posted on this page.
              Changes will apply as permitted by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Contact Us
            </h2>
            <p className="leading-8 text-neutral-300">
              If you have questions about these terms,
              please contact us at{" "}
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