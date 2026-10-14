"use client";

import { useTransition } from "react";
import { updateProduct } from "./actions";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_amount: number;
  status: "draft" | "active" | "archived";
};

export default function ProductForm({
  product,
}: {
  product: Product;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await updateProduct(formData);
          alert("Product updated successfully!");
        })
      }
      className="space-y-6"
    >
      <input
        type="hidden"
        name="id"
        value={product.id}
      />

      <div>
        <label className="mb-2 block font-medium">
          Product Name
        </label>

        <input
          name="name"
          defaultValue={product.name}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          name="description"
          rows={6}
          defaultValue={product.description ?? ""}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Price ($)
        </label>

        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={(product.price_amount / 100).toFixed(2)}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Status
        </label>

        <select
          name="status"
          defaultValue={product.status}
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}