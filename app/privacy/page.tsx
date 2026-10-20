import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | JihadForge",
  description:
    "Learn how JihadForge collects, uses, and protects customer information.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <p className="mb-12 text-neutral-400">
          Your privacy matters to us. Learn how we collect,
          use, and protect your personal information.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Information We Collect
            </h2>
            <p className="leading-8 text-neutral-300">
              When you place an order, contact us, or subscribe
              to our email list, we may collect information
              including your name, email address, shipping
              address, order details, and information you
              choose to provide.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Payment card information is handled by our
              payment providers. JihadForge does not directly
              store your full payment card number or security
              code.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              How We Use Your Information
            </h2>
            <p className="leading-8 text-neutral-300">
              We use your information to process and fulfill
              orders, arrange shipping, provide customer
              support, handle returns and exchanges, maintain
              our website, and communicate important
              information about your purchases.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Payment Processing
            </h2>
            <p className="leading-8 text-neutral-300">
              Payments are processed through trusted
              third-party payment providers, including
              Stripe. These providers process payment
              information according to their own privacy
              and security practices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Marketing Emails
            </h2>
            <p className="leading-8 text-neutral-300">
              If you subscribe to JihadForge marketing
              emails, you may receive announcements about
              new products, launches, promotions, and
              other brand updates.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              You can unsubscribe from marketing emails
              at any time using the unsubscribe link
              included in those messages.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Sharing Your Information
            </h2>
            <p className="leading-8 text-neutral-300">
              We may share information with service providers
              that help us operate JihadForge, including
              payment processors, website hosting providers,
              email service providers, and shipping carriers.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              We may also disclose information when required
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Data Security
            </h2>
            <p className="leading-8 text-neutral-300">
              We take reasonable steps to protect customer
              information and use established service
              providers to support secure payment processing
              and data storage.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              However, no method of transmitting or storing
              information online can be guaranteed to be
              completely secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Your Privacy Choices
            </h2>
            <p className="leading-8 text-neutral-300">
              You may contact us to ask questions about
              your personal information, request corrections,
              or request deletion where applicable.
            </p>
            <p className="mt-3 leading-8 text-neutral-300">
              Some information may need to be retained
              for legitimate business, recordkeeping,
              or legal obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Changes to This Policy
            </h2>
            <p className="leading-8 text-neutral-300">
              We may update this Privacy Policy as our
              business practices or legal requirements
              change. Any updates will be posted on
              this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Contact Us
            </h2>
            <p className="leading-8 text-neutral-300">
              For privacy-related questions or requests,
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