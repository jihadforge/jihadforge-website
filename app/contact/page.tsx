export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-8 text-5xl font-bold">
        Contact Us
      </h1>

      <div className="space-y-8 text-lg leading-8 text-neutral-700">
        <p>
          We'd love to hear from you. Whether you have a question
          about an order, sizing, or our products, we're here to
          help.
        </p>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Email
          </h2>

          <p>
            jihadforge@gmail.com
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Business Hours
          </h2>

          <p>
            Monday – Friday
            <br />
            9:00 AM – 5:00 PM (Eastern Time)
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Response Time
          </h2>

          <p>
            We aim to respond to all inquiries within 1–2 business
            days.
          </p>
        </section>
      </div>
    </main>
  );
}