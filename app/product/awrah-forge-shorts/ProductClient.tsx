
"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PRODUCTS } from "@/lib/products";
import { useCart } from "../../CartProvider";

type ProductImage = {
  id: string;
  image_url: string;
  is_featured: boolean;
  is_color_main: boolean;
  color: string | null;
  position: number;
};

type ProductVariant = {
  id: string;
  size: string;
  color: string;
  inventory_quantity: number;
  active: boolean;
};

type ProductClientProps = {
  images: ProductImage[];
  variants: ProductVariant[];
};

const sizes = ["S", "M", "L", "XL"];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "Sand", hex: "#E7CCAA" },
  { name: "Grey", hex: "#B8B8B8" },
  { name: "Olive Green", hex: "#667047" },
];

const product = PRODUCTS["awrah-forge-shorts"];

function normalizeColor(color: string | null) {
  return (color ?? "").trim().toLowerCase().replace("gray", "grey");
}

export default function ProductClient({
  images,
  variants,
}: ProductClientProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const galleryImages = useMemo(() => {
    if (!selectedColor) {
      return images;
    }

    return images.filter(
      (image) =>
        normalizeColor(image.color) ===
        normalizeColor(selectedColor)
    );
  }, [images, selectedColor]);

  const mainImage = useMemo(() => {
    if (!selectedColor) {
      return images.find((image) => image.is_featured) ?? images[0];
    }

    return (
      galleryImages.find((image) => image.is_color_main) ??
      galleryImages[0]
    );
  }, [images, galleryImages, selectedColor]);

  const currentImage = galleryImages[selectedIndex] ?? mainImage;
  const currentImageUrl = currentImage?.image_url ?? null;

  const { addItem, cartCount } = useCart();
  const selectedVariant = variants.find(
  (variant) =>
    variant.active &&
    variant.size === selectedSize &&
    normalizeColor(variant.color) === normalizeColor(selectedColor)
);

const remainingStock = selectedVariant?.inventory_quantity ?? 0;

function isSizeAvailable(size: string) {
  if (!selectedColor) {
    return variants.some(
      (variant) =>
        variant.active &&
        variant.size === size &&
        variant.inventory_quantity > 0
    );
  }

  return variants.some(
    (variant) =>
      variant.active &&
      variant.size === size &&
      normalizeColor(variant.color) === normalizeColor(selectedColor) &&
      variant.inventory_quantity > 0
  );
}

  const changeImage = useCallback(
    (direction: number) => {
      if (galleryImages.length < 2) return;

      setSelectedIndex((current) =>
        (current + direction + galleryImages.length) %
        galleryImages.length
      );
    },
    [galleryImages.length]
  );

  useEffect(() => {
    if (!isFullscreen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }

      if (event.key === "ArrowLeft") {
        changeImage(-1);
      }

      if (event.key === "ArrowRight") {
        changeImage(1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen, changeImage]);

  function selectColor(color: string) {
    const matchingImages = images.filter(
      (image) =>
        normalizeColor(image.color) === normalizeColor(color)
    );

    const frontIndex = matchingImages.findIndex(
      (image) => image.is_color_main
    );

    setSelectedColor(color);
    setSelectedSize((currentSize) => {
  const available = variants.some(
    (variant) =>
      variant.active &&
      variant.size === currentSize &&
      normalizeColor(variant.color) === normalizeColor(color) &&
      variant.inventory_quantity > 0
  );

  return available ? currentSize : "";
});
    setSelectedIndex(frontIndex >= 0 ? frontIndex : 0);
    setAddedToCart(false);
  }

  function handleAddToCart() {
    if (
  !selectedSize ||
  !selectedColor ||
  !selectedVariant ||
  remainingStock <= 0
) {
  return;
}

    const colorMainImage =
      galleryImages.find((image) => image.is_color_main)
        ?.image_url ??
      galleryImages[0]?.image_url ??
      product.image;

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      image: colorMainImage,
    });

    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const distance =
      event.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(distance) > 50) {
      changeImage(distance < 0 ? 1 : -1);
    }

    touchStartX.current = null;
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
          <div>
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_34%,#303030_0%,#151515_42%,#090909_76%)]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {currentImageUrl ? (
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="h-full w-full cursor-zoom-in"
                  aria-label="Open full-screen product image"
                >
                  <img
                    src={currentImageUrl}
                    alt={`${product.name} ${selectedColor}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ) : (
                <ProductPlaceholder />
              )}

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => changeImage(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl hover:bg-black"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={() => changeImage(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl hover:bg-black"
                  >
                    ›
                  </button>
                </>
              )}

              {currentImageUrl && (
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-4 right-4 z-10 bg-black/75 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black"
                >
                  ⛶ Expand
                </button>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedIndex === index}
                    className={`relative aspect-square overflow-hidden border transition ${
                      selectedIndex === index
                        ? "border-white"
                        : "border-white/15 hover:border-white/60"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

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
              Modest-performance shorts engineered for training,
              running, swimming, and everyday movement.
            </p>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                Select size
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {sizes.map((size) => {
  const available = isSizeAvailable(size);

  return (
    <button
      key={size}
      type="button"
      disabled={!available}
      onClick={() => {
        setSelectedSize(size);
        setAddedToCart(false);
      }}
      aria-pressed={selectedSize === size}
      className={`h-12 min-w-14 border px-4 text-sm font-bold transition ${
        !available
          ? "cursor-not-allowed border-white/10 text-white/20 line-through"
          : selectedSize === size
            ? "border-white bg-white text-black"
            : "border-white/20 hover:border-white"
      }`}
    >
      {size}
    </button>
  );
})}
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
                    aria-pressed={selectedColor === color.name}
                    onClick={() => selectColor(color.name)}
                    className={`relative h-11 w-11 rounded-full border-2 transition duration-200 ${
                      selectedColor === color.name
                        ? "scale-110 border-white ring-2 ring-white/30 ring-offset-4 ring-offset-[#080808]"
                        : "border-white/20 hover:scale-105 hover:border-white/60"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm font-medium text-white/60">
                {selectedColor || "Select a color"}
              </p>
            </div>
            
            {selectedSize && selectedColor && (
  <p className="mt-6 text-sm font-medium text-white/60">
    {remainingStock <= 0
      ? "Out of stock"
      : remainingStock <= 5
        ? `Only ${remainingStock} left in stock`
        : "In stock"}
  </p>
)}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
  !selectedSize ||
  !selectedColor ||
  !selectedVariant ||
  remainingStock <= 0
}
              className="mt-10 w-full bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition enabled:hover:bg-[#c8c8c8] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/35 sm:w-auto"
            >
              {!selectedSize
                ? "Select a size"
                : !selectedColor
                  ? "Select a color"
                  : remainingStock <= 0
                ? "Out of stock"
                : addedToCart
                ? "Added to cart"
                : "Add to cart"}
            </button>

            <div className="mt-10 border-t border-white/10 pt-7">
              <h2 className="text-lg font-bold uppercase">
                Product details
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
                Designed to provide modest coverage without
                restricting movement. Built for workouts,
                outdoor activity, swimming, and everyday wear.
              </p>
            </div>
          </div>
        </section>
      </div>

      {isFullscreen && currentImageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen product gallery"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close full-screen gallery"
            className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-3xl hover:bg-white/25"
          >
            ×
          </button>

          <img
            src={currentImageUrl}
            alt={`${product.name} ${selectedColor}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous full-screen image"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl hover:bg-white/25 sm:left-8"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next full-screen image"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl hover:bg-white/25 sm:right-8"
              >
                ›
              </button>
            </>
          )}

          <p className="absolute bottom-6 text-xs font-bold uppercase tracking-widest text-white/60">
            {selectedIndex + 1} / {galleryImages.length}
          </p>
        </div>
      )}
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