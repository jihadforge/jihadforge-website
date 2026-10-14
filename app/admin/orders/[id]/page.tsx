import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  User,
} from "lucide-react";

import StatusBadge from "@/app/components/admin/StatusBadge";
import {
  getOrders,
  type OrderItem,
} from "@/lib/orders-db";
import {
  changeOrderStatus,
  saveOrderTracking,
} from "./actions";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatMoney(
  amount: number | null | undefined,
  currency = "USD"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount ?? 0) / 100);
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const orders = await getOrders();

  const order = orders.find(
    (currentOrder) =>
      String(currentOrder.id) === id
  );

  if (!order) {
    notFound();
  }

  const items: OrderItem[] = Array.isArray(
    order.items
  )
    ? order.items
    : [];

  const shippingDetails =
    order.shipping_address;

  const address =
    shippingDetails?.address ?? null;

  const currency =
    order.currency ?? "usd";

  const createdAt = order.created_at
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(order.created_at))
    : "Unknown date";

  return (
    <div className="w-full px-8 py-8">
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Order #{String(order.id)}
          </h1>

          <p className="mt-1 text-gray-500">
            Placed {createdAt}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatusBadge
            status={
              order.payment_status ?? "unknown"
            }
          />

          <StatusBadge
            status={
              order.fulfillment_status ??
              "pending"
            }
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Ordered items */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />

                <div>
                  <h2 className="text-xl font-semibold">
                    Items ordered
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Products, sizes, colors, and
                    quantities in this order.
                  </p>
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="p-6 text-gray-500">
                No item information was saved for
                this order.
              </div>
            ) : (
              <div>
                {items.map((item, index) => {
                  const quantity =
                    item.quantity ?? 0;

                  const lineTotal =
                    item.total_amount ??
                    (item.unit_amount ?? 0) *
                      quantity;

                  return (
                    <div
                      key={`${item.productId ?? "item"}-${item.size ?? ""}-${item.color ?? ""}-${index}`}
                      className="flex flex-col gap-5 border-b p-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold">
                          {item.name ??
                            "Unknown product"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                          <p>
                            Size:{" "}
                            <span className="font-medium text-gray-900">
                              {item.size ??
                                "Not provided"}
                            </span>
                          </p>

                          <p>
                            Color:{" "}
                            <span className="font-medium text-gray-900">
                              {item.color ??
                                "Not provided"}
                            </span>
                          </p>

                          <p>
                            Quantity:{" "}
                            <span className="font-medium text-gray-900">
                              {quantity}
                            </span>
                          </p>
                        </div>

                        {item.productId ? (
                          <p className="mt-2 text-xs text-gray-400">
                            Product:{" "}
                            {item.productId}
                          </p>
                        ) : null}
                      </div>

                      <div className="sm:text-right">
                        <p className="font-semibold">
                          {formatMoney(
                            lineTotal,
                            item.currency ??
                              currency
                          )}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatMoney(
                            item.unit_amount,
                            item.currency ??
                              currency
                          )}{" "}
                          each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment totals */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <ReceiptText className="h-5 w-5" />

                <h2 className="text-xl font-semibold">
                  Payment summary
                </h2>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  {formatMoney(
                    order.subtotal_amount,
                    currency
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="font-medium">
                  {formatMoney(
                    order.shipping_amount,
                    currency
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Tax
                </span>

                <span className="font-medium">
                  {formatMoney(
                    order.tax_amount,
                    currency
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-5">
                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold">
                  {formatMoney(
                    order.total_amount,
                    currency
                  )}
                </span>
              </div>
            </div>
          </div>
<div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
  <div className="border-b p-6">
    <h2 className="text-xl font-semibold">
      Shipping & Tracking
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Save the shipping carrier and tracking number.
    </p>
  </div>

  <div className="p-6">
    <form
      action={saveOrderTracking}
      className="grid gap-5 md:grid-cols-2"
    >
      <input
        type="hidden"
        name="id"
        value={String(order.id)}
      />

      <div>
        <label className="mb-2 block font-medium">
          Carrier
        </label>

        <select
          name="shippingCarrier"
          defaultValue={order.shipping_carrier ?? ""}
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-3"
        >
          <option value="">Select Carrier</option>
          <option value="USPS">USPS</option>
          <option value="UPS">UPS</option>
          <option value="FedEx">FedEx</option>
          <option value="DHL">DHL</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Tracking Number
        </label>

        <input
          type="text"
          name="trackingNumber"
          defaultValue={order.tracking_number ?? ""}
          placeholder="9400..."
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-3"
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
        >
          Save Tracking
        </button>
      </div>
    </form>

    {order.shipping_carrier && order.tracking_number && (
      <div className="mt-6 rounded-lg bg-neutral-50 p-4">
        <p>
          <span className="font-semibold">
            Carrier:
          </span>{" "}
          {order.shipping_carrier}
        </p>

        <p className="mt-2 break-all">
          <span className="font-semibold">
            Tracking:
          </span>{" "}
          {order.tracking_number}
        </p>
      </div>
    )}
  </div>
</div>
          {/* Fulfillment controls */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                Fulfillment
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update this order as it moves
                through shipping.
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                <form action={changeOrderStatus}>
                  <input
                    type="hidden"
                    name="id"
                    value={String(order.id)}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value="pending"
                  />

                  <button
                    type="submit"
                    disabled={
                      order.fulfillment_status ===
                      "pending"
                    }
                    className="rounded-lg border border-neutral-300 px-5 py-3 font-medium transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark Pending
                  </button>
                </form>

                <form action={changeOrderStatus}>
                  <input
                    type="hidden"
                    name="id"
                    value={String(order.id)}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value="shipped"
                  />

                  <button
                    type="submit"
                    disabled={
                      order.fulfillment_status ===
                      "shipped"
                    }
                    className="rounded-lg border border-neutral-300 px-5 py-3 font-medium transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark Shipped
                  </button>
                </form>

                <form action={changeOrderStatus}>
                  <input
                    type="hidden"
                    name="id"
                    value={String(order.id)}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value="delivered"
                  />

                  <button
                    type="submit"
                    disabled={
                      order.fulfillment_status ===
                      "delivered"
                    }
                    className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark Delivered
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer information */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                Customer
              </h2>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="font-medium">
                    {order.customer_name ||
                      shippingDetails?.name ||
                      "Guest customer"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="break-all font-medium">
                    {order.customer_email ||
                      "No email provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {order.customer_phone ||
                      "No phone provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      status={
                        order.payment_status ??
                        "unknown"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />

                <h2 className="text-xl font-semibold">
                  Ship to
                </h2>
              </div>
            </div>

            <div className="p-6">
              {address ? (
                <address className="space-y-1 not-italic leading-7 text-gray-700">
                  <p className="font-semibold text-gray-950">
                    {shippingDetails?.name ||
                      order.customer_name ||
                      "Customer"}
                  </p>

                  {address.line1 ? (
                    <p>{address.line1}</p>
                  ) : null}

                  {address.line2 ? (
                    <p>{address.line2}</p>
                  ) : null}

                  <p>
                    {[
                      address.city,
                      address.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    {address.postal_code
                      ? ` ${address.postal_code}`
                      : ""}
                  </p>

                  {address.country ? (
                    <p>{address.country}</p>
                  ) : null}
                </address>
              ) : (
                <p className="text-gray-500">
                  No shipping address was saved
                  for this order.
                </p>
              )}
            </div>
          </div>

          {/* Stripe references */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                Order references
              </h2>
            </div>

            <div className="space-y-5 p-6 text-sm">
              <div>
                <p className="text-gray-500">
                  Order ID
                </p>

                <p className="mt-1 break-all font-medium">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Stripe session
                </p>

                <p className="mt-1 break-all font-medium">
                  {order.stripe_session_id ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Payment intent
                </p>

                <p className="mt-1 break-all font-medium">
                  {order.stripe_payment_intent_id ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Inventory deducted
                </p>

                <p className="mt-1 font-medium">
                  {order.inventory_deducted
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="block rounded-lg border border-neutral-300 px-5 py-3 text-center font-medium transition hover:bg-gray-50"
          >
            Return to all orders
          </Link>
        </div>
      </div>
    </div>
  );
}