import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ImageIcon,
  Package,
} from "lucide-react";

import ProductForm from "./ProductForm";
import {
  deleteProductImage,
  setFeaturedProductImage,
  uploadProductImage,
} from "../actions-images";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { getDatabaseProduct } from "@/lib/products-db";
import { updateVariantStock } from "./inventory-actions";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  let product;

  try {
    product = await getDatabaseProduct(slug);
  } catch {
    notFound();
  }

  const inventory = product.product_variants.reduce(
    (
      total: number,
      variant: {
        inventory_quantity: number | null;
      }
    ) => total + (variant.inventory_quantity ?? 0),
    0
  );

  const sortedImages = [...product.product_images].sort(
    (firstImage, secondImage) =>
      firstImage.position - secondImage.position
  );

  return (
    <div className="w-full px-8 py-8">
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Edit Product
          </h1>

          <p className="mt-1 text-neutral-500">
            Update {product.name} and save the changes to your catalog.
          </p>
        </div>

        <StatusBadge status={product.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Product Information */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Product information
            </h2>

            <ProductForm product={product} />
          </div>

          {/* Product Images */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5" />

                <div>
                  <h2 className="text-xl font-semibold">
                    Product images
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Upload and manage product photos for this item.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form
                action={uploadProductImage.bind(null, product.id)}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <input
                  type="hidden"
                  name="productSlug"
                  value={product.slug}
                />

                <div className="flex-1">
                  <label
                    htmlFor="image"
                    className="mb-2 block font-medium"
                  >
                    Choose image
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
                >
                  Upload Image
                </button>
              </form>

              <p className="mt-3 text-sm text-neutral-500">
                JPG, PNG, or WebP. Maximum file size: 10 MB.
              </p>

              {sortedImages.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
                  No product images uploaded yet.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedImages.map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-lg border border-neutral-200"
                    >
                      <div className="aspect-square bg-neutral-100">
                        <img
                          src={image.image_url}
                          alt={`${product.name} product image`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm text-neutral-500">
                          Position {image.position}
                        </span>

                        {image.is_featured ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      {!image.is_featured ? (
                        <form
                          action={setFeaturedProductImage}
                          className="border-t p-3"
                        >
                          <input
                            type="hidden"
                            name="imageId"
                            value={image.id}
                          />

                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />

                          <input
                            type="hidden"
                            name="productSlug"
                            value={product.slug}
                          />

                          <button
                            type="submit"
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold transition hover:bg-neutral-100"
                          >
                            Set as Featured
                          </button>
                        </form>
                      ) : (
                        <div className="border-t bg-green-50 p-3 text-center text-sm font-semibold text-green-700">
                          Featured Image
                        </div>
                      )}

                      <form
                        action={deleteProductImage}
                        className="border-t p-3"
                      >
                        <input
                          type="hidden"
                          name="imageId"
                          value={image.id}
                        />

                        <input
                          type="hidden"
                          name="imageUrl"
                          value={image.image_url}
                        />

                        <input
                          type="hidden"
                          name="productId"
                          value={product.id}
                        />

                        <input
                          type="hidden"
                          name="productSlug"
                          value={product.slug}
                        />

                        <button
                          type="submit"
                          className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete Image
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Summary */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />

                <h2 className="text-xl font-semibold">
                  Product summary
                </h2>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between border-b pb-5">
                <span className="text-neutral-500">
                  Slug
                </span>

                <span className="max-w-[65%] break-all text-right font-medium">
                  {product.slug}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-5">
                <span className="text-neutral-500">
                  Variants
                </span>

                <span className="font-medium">
                  {product.product_variants.length}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-5">
                <span className="text-neutral-500">
                  Images
                </span>

                <span className="font-medium">
                  {product.product_images.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">
                  Total inventory
                </span>

                <span className="font-medium">
                  {inventory}
                </span>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                Variants
              </h2>
            </div>

            {product.product_variants.length === 0 ? (
              <div className="p-6 text-neutral-500">
                No variants yet.
              </div>
            ) : (
              

product.product_variants.map(
  (variant: {
    id: string;
    color: string;
    size: string;
    inventory_quantity: number | null;
  }) => (
    <form
      key={variant.id}
      action={updateVariantStock}
      className="flex items-center justify-between gap-4 border-b p-5 last:border-b-0"
    >
      <input type="hidden" name="variantId" value={variant.id} />
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="productSlug" value={product.slug} />

      <div>
        <p className="font-semibold">{variant.color}</p>
        <p className="text-sm text-neutral-500">
          Size {variant.size}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          name="quantity"
          min="0"
          step="1"
          required
          defaultValue={variant.inventory_quantity ?? 0}
          className="w-20 rounded-lg border border-neutral-300 px-3 py-2 text-center text-sm"
        />

        <button
          type="submit"
          className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Save Stock
        </button>
      </div>
    </form>
  )
)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}