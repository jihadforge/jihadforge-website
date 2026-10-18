import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import ProductClient from "./ProductClient";
import { getDatabaseProduct } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export default async function AwrahForgeShortsPage() {
  let databaseProduct;

  try {
    databaseProduct = await getDatabaseProduct(
      "awrah-forge-shorts"
    );
  } catch {
    notFound();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const images = [...databaseProduct.product_images].sort(
    (firstImage, secondImage) => {
      if (
        firstImage.is_featured &&
        !secondImage.is_featured
      ) {
        return -1;
      }

      if (
        !firstImage.is_featured &&
        secondImage.is_featured
      ) {
        return 1;
      }

      return firstImage.position - secondImage.position;
    }
  );

  const variants = await Promise.all(
    databaseProduct.product_variants.map(async (variant) => {
      const { data: reserved, error } = await supabase.rpc(
        "active_reserved_quantity",
        {
          p_variant_id: variant.id,
        }
      );

      if (error) {
        throw new Error(
          "Unable to retrieve available inventory."
        );
      }

      return {
        id: variant.id,
        size: variant.size,
        color: variant.color,
        inventory_quantity: Math.max(
          0,
          variant.inventory_quantity - Number(reserved ?? 0)
        ),
        active: variant.active,
      };
    })
  );

  return (
    <ProductClient
      images={images}
      variants={variants}
    />
  );
}