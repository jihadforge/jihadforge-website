export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-8 text-5xl font-bold">
        Shipping Policy
      </h1>

      <div className="space-y-8 text-lg leading-8 text-neutral-700">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Processing Time
          </h2>

          <p>
            Orders are typically processed within 1–3 business
            days after payment is received. During new product
            launches or promotional periods, processing may take
            slightly longer.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Shipping
          </h2>

          <p>
            Delivery times vary depending on your location and
            shipping method selected at checkout. Once your order
            ships, you will receive a confirmation email with
            tracking information.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            International Orders
          </h2>

          <p>
            International shipping availability will expand over
            time. Customers are responsible for any customs duties,
            taxes, or import fees required by their country.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Lost or Delayed Packages
          </h2>

          <p>
            If your package appears lost or significantly delayed,
            please contact us and we'll work with the shipping
            carrier to help resolve the issue.
          </p>
        </section>
      </div>
    </main>
  );
}