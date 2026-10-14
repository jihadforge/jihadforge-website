import { createProduct } from "./actions";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Product</h1>

        <p className="mt-2 text-neutral-500">
          Create a new product for your JihadForge store.
        </p>
      </div>

      <form
        action={createProduct}
        className="space-y-6 rounded-xl bg-white p-8 shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border p-3"
            placeholder="Awrah Forge Shorts"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block font-medium"
          >
            Slug
          </label>

          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="w-full rounded-lg border p-3"
            placeholder="awrah-forge-shorts"
          />

          <p className="mt-1 text-sm text-neutral-500">
            Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block font-medium"
            >
              Price ($)
            </label>

            <input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full rounded-lg border p-3"
              placeholder="44.99"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block font-medium"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              className="w-full rounded-lg border p-3"
              defaultValue="draft"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}