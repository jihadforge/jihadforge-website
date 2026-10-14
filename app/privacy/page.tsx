export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-8 text-5xl font-bold">
        Privacy Policy
      </h1>

      <div className="space-y-8 text-lg leading-8 text-neutral-700">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Information We Collect
          </h2>

          <p>
            When you place an order or subscribe to our email
            list, we may collect information such as your name,
            email address, shipping address, and payment details.
            Payment information is processed securely through our
            payment providers and is not stored by JihadForge.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            How We Use Your Information
          </h2>

          <p>
            We use your information to process orders, provide
            customer support, improve our website, and send
            updates if you choose to receive marketing emails.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Marketing Emails
          </h2>

          <p>
            If you subscribe to our newsletter, you may receive
            updates about new products, launches, and promotions.
            You can unsubscribe at any time using the link in any
            marketing email.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Data Security
          </h2>

          <p>
            We take reasonable measures to protect your
            information and use trusted providers to securely
            process payments and store customer data.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Contact
          </h2>

          <p>
            If you have any questions about this Privacy Policy,
            please contact us through our Contact page.
          </p>
        </section>
      </div>
    </main>
  );
}