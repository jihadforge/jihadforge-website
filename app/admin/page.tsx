import Link from "next/link";
import {
  CircleCheck,
  Clock3,
  DollarSign,
  Package,
} from "lucide-react";

import StatCard from "@/app/components/admin/StatCard";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { getOrders } from "@/lib/orders-db";

export default async function AdminPage() {
  const orders = await getOrders();

  const revenue = orders.reduce(
    (sum, order) => sum + (order.total_amount ?? 0),
    0
  );

  const pending = orders.filter(
    (order) => order.fulfillment_status === "pending"
  ).length;

  const delivered = orders.filter(
    (order) => order.fulfillment_status === "delivered"
  ).length;

  return (
    <div className="w-full px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            + Add Product
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-lg border border-neutral-300 px-5 py-3 font-medium transition hover:bg-gray-50"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={`$${(revenue / 100).toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6" />}
        />

        <StatCard
          title="Orders"
          value={orders.length}
          icon={<Package className="h-6 w-6" />}
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock3 className="h-6 w-6" />}
        />

        <StatCard
          title="Delivered"
          value={delivered}
          icon={<CircleCheck className="h-6 w-6" />}
        />
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-2xl font-semibold">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {order.customer_name || "Guest customer"}
                    </td>

                    <td className="p-4">
                      {order.customer_email || "No email"}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={
                          order.payment_status ?? "unknown"
                        }
                      />
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={
                          order.fulfillment_status ?? "pending"
                        }
                      />
                    </td>

                    <td className="p-4 font-semibold">
                      $
                      {(
                        (order.total_amount ?? 0) / 100
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}