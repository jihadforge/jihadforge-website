
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { getOrders } from "@/lib/orders-db";

export default async function AnalyticsPage() {
  const orders = await getOrders();

 const revenue = orders.reduce(
  (total, order) => total + (order.total_amount ?? 0),
  0
) / 100;

  const pending = orders.filter(
    (order) => order.fulfillment_status === "pending"
  ).length;

  const delivered = orders.filter(
    (order) => order.fulfillment_status === "delivered"
  ).length;

  const averageOrder =
    orders.length > 0 ? revenue / orders.length : 0;

  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const stats = [
    {
      label: "Total Revenue",
      value: money(revenue),
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingBag,
    },
    {
      label: "Average Order Value",
      value: money(averageOrder),
      icon: DollarSign,
    },
    {
      label: "Pending Orders",
      value: pending.toString(),
      icon: Clock3,
    },
    {
      label: "Delivered Orders",
      value: delivered.toString(),
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="mt-2 text-neutral-500">
          Track your JihadForge store performance.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  {stat.label}
                </p>

                <Icon className="h-5 w-5 text-neutral-500" />
              </div>

              <p className="text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Sales Overview
        </h2>

        <p className="mt-2 text-neutral-500">
          Revenue and order statistics based on your
          store's recorded orders.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/admin/orders"
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            View All Orders
          </Link>

          <Link
            href="/admin/products"
            className="rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}