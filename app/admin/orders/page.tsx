import Link from "next/link";
import { Search } from "lucide-react";

import StatusBadge from "@/app/components/admin/StatusBadge";
import { getOrders } from "@/lib/orders-db";

type OrdersPageProps = {
  searchParams?: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;
  const orders = await getOrders();

  const search = params?.search?.trim().toLowerCase() ?? "";
  const status = params?.status ?? "all";

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.customer_name?.toLowerCase() ?? "";

    const customerEmail =
      order.customer_email?.toLowerCase() ?? "";

    const matchesSearch =
      customerName.includes(search) ||
      customerEmail.includes(search);

    const matchesStatus =
      status === "all" ||
      order.fulfillment_status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Orders</h1>

        <p className="mt-1 text-gray-500">
          View and manage JihadForge customer orders.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              name="search"
              defaultValue={params?.search}
              placeholder="Search by customer name or email"
              className="w-full rounded-lg border border-neutral-300 py-3 pl-10 pr-4 outline-none transition focus:border-black"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            Filter
          </button>

          <Link
            href="/admin/orders"
            className="rounded-lg border border-neutral-300 px-6 py-3 text-center font-medium transition hover:bg-gray-50"
          >
            Clear
          </Link>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            All Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredOrders.length} order
            {filteredOrders.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      #{String(order.id).slice(0, 8)}
                    </td>

                    <td className="p-4">
                      {order.customer_name || "Guest"}
                    </td>

                    <td className="p-4 text-gray-600">
                      {order.customer_email || "No email"}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={
                          order.payment_status || "unknown"
                        }
                      />
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={
                          order.fulfillment_status ||
                          "pending"
                        }
                      />
                    </td>

                    <td className="p-4 font-semibold">
                      $
                      {(
                        (order.total_amount ?? 0) / 100
                      ).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-black underline-offset-4 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-500"
                  >
                    No orders match your search.
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