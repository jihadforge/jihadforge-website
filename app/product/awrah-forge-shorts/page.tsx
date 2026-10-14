import { notFound } from "next/navigation";

import ProductClient from "./ProductClient";
import { getDatabaseProduct } from "@/lib/products-db";

export default async function AwrahForgeShortsPage() {
  let databaseProduct;

  try {
    databaseProduct = await getDatabaseProduct(
      "awrah-forge-shorts"
    );
  } catch {
    notFound();
  }

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

  return (
    <ProductClient
      images={images}
    />
  );
}