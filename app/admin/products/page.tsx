import Link from "next/link";
import { Pencil } from "lucide-react";

import StatusBadge from "@/app/components/admin/StatusBadge";
import { getDatabaseProducts } from "@/lib/products-db";

export default async function AdminProductsPage() {
  const products = await getDatabaseProducts();

  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="mt-1 text-neutral-500">
            Manage your JihadForge product catalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-neutral-800"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr className="text-left text-sm font-semibold text-neutral-600">
              <th className="p-5">Product</th>
              <th className="p-5">Status</th>
              <th className="p-5">Price</th>
              <th className="p-5">Variants</th>
              <th className="p-5">Inventory</th>
              <th className="p-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-neutral-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const inventory =
                  product.product_variants.reduce(
                    (total, variant) =>
                      total +
                      (variant.inventory_quantity ?? 0),
                    0
                  );

                return (
                  <tr
                    key={product.id}
                    className="border-t transition hover:bg-neutral-50"
                  >
                    <td className="p-5">
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="block"
                      >
                        <p className="font-semibold">
                          {product.name}
                        </p>

                        <p className="text-sm text-neutral-500">
                          /products/{product.slug}
                        </p>
                      </Link>
                    </td>

                    <td className="p-5">
                      <StatusBadge
                        status={product.status}
                      />
                    </td>

                    <td className="p-5 font-medium">
                      $
                      {(
                        product.price_amount / 100
                      ).toFixed(2)}
                    </td>

                    <td className="p-5">
                      {product.product_variants.length}
                    </td>

                    <td className="p-5">
                      {inventory}
                    </td>

                    <td className="p-5">
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}