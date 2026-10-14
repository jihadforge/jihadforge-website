"use client";

import Link from "next/link";
import { useState } from "react";

import { PRODUCTS } from "@/lib/products";
import { useCart } from "../../CartProvider";

type ProductImage = {
  id: string;
  image_url: string;
  is_featured: boolean;
  position: number;
};

type ProductClientProps = {
  images: ProductImage[];
};

const sizes = ["S", "M", "L", "XL", "2XL"];

const colors = [
  {
    name: "Black",
    hex: "#000000",
  },
  {
    name: "Sand",
    hex: "#E7CCAA",
  },
  {
    name: "Grey",
    hex: "#B8B8B8",
  },
  {
    name: "Baby Blue",
    hex: "#CBE9F8",
  },
];

const product = PRODUCTS["awrah-forge-shorts"];

export default function ProductClient({
  images,
}: ProductClientProps) {
  const firstImage = images[0]?.image_url ?? null;

  const [selectedImage, setSelectedImage] =
    useState<string | null>(firstImage);

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [addedToCart, setAddedToCart] =
    useState(false);

  const { addItem, cartCount } = useCart();

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      return;
    }

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      image: selectedImage ?? product.image,
    });

    setAddedToCart(true);

    window.setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/#shop"
            className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
          >
            ← Back to shop
          </Link>

          <Link
            href="/cart"
            className="border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] transition hover:border-white hover:bg-white hover:text-black"
          >
            Cart ({cartCount})
          </Link>
        </div>

        <section className="grid gap-12 py-14 lg:grid-cols-2 lg:items-start">
          {/* Product images */}
          <div>
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_34%,#303030_0%,#151515_42%,#090909_76%)]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductPlaceholder />
              )}
            </div>

            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => {
                  const selected =
                    selectedImage === image.image_url;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image.image_url
                        )
                      }
                      aria-label={`View ${
                        product.name
                      } image ${index + 1}`}
                      aria-pressed={selected}
                      className={`relative aspect-square overflow-hidden border transition ${
                        selected
                          ? "border-white"
                          : "border-white/15 hover:border-white/60"
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      {image.is_featured ? (
                        <span className="absolute bottom-1 left-1 bg-black/75 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white">
                          Featured
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Product information */}
          <div className="lg:sticky lg:top-10">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/35">
              Flagship Product
            </p>

            <h1 className="mt-5 text-5xl font-bold uppercase leading-[0.9] tracking-[-0.04em] sm:text-7xl">
              {product.name}
            </h1>

            <p className="mt-6 text-2xl font-semibold">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/50">
              Modest-performance shorts engineered for
              training, running, swimming, and everyday
              movement.
            </p>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                Select size
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setAddedToCart(false);
                    }}
                    aria-pressed={
                      selectedSize === size
                    }
                    className={`h-12 min-w-14 border px-4 text-sm font-bold transition ${
                      selectedSize === size
                        ? "border-white bg-white text-black"
                        : "border-white/20 hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                Select color
              </p>

              <div className="mt-4 flex items-center gap-5">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                    aria-pressed={
                      selectedColor === color.name
                    }
                    onClick={() => {
                      setSelectedColor(color.name);
                      setAddedToCart(false);
                    }}
                    className={`relative h-11 w-11 rounded-full border-2 transition duration-200 ${
                      selectedColor === color.name
                        ? "scale-110 border-white ring-2 ring-white/30 ring-offset-4 ring-offset-[#080808]"
                        : "border-white/20 hover:scale-105 hover:border-white/60"
                    }`}
                    style={{
                      backgroundColor: color.hex,
                    }}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm font-medium text-white/60">
                {selectedColor || "Select a color"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                !selectedSize || !selectedColor
              }
              className="mt-10 w-full bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition enabled:hover:bg-[#c8c8c8] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/35 sm:w-auto"
            >
              {!selectedSize
                ? "Select a size"
                : !selectedColor
                  ? "Select a color"
                  : addedToCart
                    ? "Added to cart"
                    : "Add to cart"}
            </button>

            <div className="mt-10 border-t border-white/10 pt-7">
              <h2 className="text-lg font-bold uppercase">
                Product details
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
                Designed to provide modest coverage
                without restricting movement. Built for
                workouts, outdoor activity, swimming, and
                everyday wear.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProductPlaceholder() {
  return (
    <div className="relative h-[62%] w-[54%]">
      <div className="absolute inset-x-[8%] top-0 h-[16%] border border-white/15 bg-[#252525]" />

      <div className="absolute bottom-0 left-0 h-[86%] w-[47%] skew-x-[-4deg] border border-white/10 bg-gradient-to-b from-[#242424] to-[#0d0d0d]" />

      <div className="absolute bottom-0 right-0 h-[86%] w-[47%] skew-x-[4deg] border border-white/10 bg-gradient-to-b from-[#242424] to-[#0d0d0d]" />

      <img
        src={product.image}
        alt="JihadForge logo on Awrah Forge Shorts"
        className="absolute bottom-[14%] left-[10%] z-10 w-16 opacity-75"
      />
    </div>
  );
}