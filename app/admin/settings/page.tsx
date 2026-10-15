
import Link from "next/link";
import {
  Store,
  Package,
  ShoppingBag,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-neutral-500">
          Manage your JihadForge store.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Store className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              Store Information
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">
                Store name
              </span>
              <span className="font-medium">JihadForge</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">
                Website
              </span>
              <a
                href="https://www.jihadforge.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium underline"
              >
                jihadforge.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">
                Currency
              </span>
              <span className="font-medium">USD ($)</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Package className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              Product Management
            </h2>
          </div>

          <p className="mb-5 text-sm text-neutral-500">
            Update products, prices, images, and stock quantities.
          </p>

          <Link
            href="/admin/products"
            className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Manage Products
          </Link>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              Order Management
            </h2>
          </div>

          <p className="mb-5 text-sm text-neutral-500">
            Review orders and update fulfillment statuses.
          </p>

          <Link
            href="/admin/orders"
            className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Manage Orders
          </Link>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              Account & Security
            </h2>
          </div>

          <p className="mb-5 text-sm text-neutral-500">
            Your admin dashboard is restricted to your
            authorized account.
          </p>

          <p className="text-sm text-neutral-500">
            Admin access is configured through Supabase
            Authentication and your server environment.
          </p>
        </section>
      </div>
    </div>
  );
}