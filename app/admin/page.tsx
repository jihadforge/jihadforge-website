import Link from "next/link";
import { getOrders } from "@/lib/orders";

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 24px",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "12px" }}>
        JihadForge Admin
      </h1>

      <p style={{ color: "#777", marginBottom: "40px" }}>
        Manage customer orders.
      </p>

      <div style={{ display: "grid", gap: "24px" }}>
        {orders.map((order: any) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h2>Order #{order.id}</h2>

            <p>
              <strong>Name:</strong> {order.customer_name}
            </p>

            <p>
              <strong>Email:</strong> {order.customer_email}
            </p>

            <p>
              <strong>Phone:</strong> {order.customer_phone}
            </p>

            <p>
              <strong>Total:</strong> $
              {(order.total_amount / 100).toFixed(2)}
            </p>

            <p>
              <strong>Payment:</strong> {order.payment_status}
            </p>

            <p>
              <strong>Fulfillment:</strong> {order.fulfillment_status}
            </p>

            <pre
              style={{
                marginTop: "16px",
                background: "#111",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px",
                overflow: "auto",
              }}
            >
              {JSON.stringify(order.items, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link href="/">← Back to Store</Link>
      </div>
    </main>
  );
}