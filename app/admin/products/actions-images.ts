"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

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

function refreshProductPages(productSlug: string) {
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productSlug}`);
  revalidatePath(`/product/${productSlug}`);
}

export async function uploadProductImage(
  productId: string,
  formData: FormData
) {
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    throw new Error("No file uploaded.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG, and WebP images are allowed."
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("The image must be 10 MB or smaller.");
  }

  const productSlug = String(
    formData.get("productSlug") ?? ""
  );

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const storagePath =
    `${productId}/${crypto.randomUUID()}.${extension}`;

  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("products")
    .getPublicUrl(storagePath);

  const { count, error: countError } = await supabase
    .from("product_images")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("product_id", productId);

  if (countError) {
    await supabase.storage
      .from("products")
      .remove([storagePath]);

    throw new Error(countError.message);
  }

  const isFirstImage = (count ?? 0) === 0;

  const { error: databaseError } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url: publicUrl,
      position: count ?? 0,
      is_featured: isFirstImage,
    });

  if (databaseError) {
    await supabase.storage
      .from("products")
      .remove([storagePath]);

    throw new Error(databaseError.message);
  }

  refreshProductPages(productSlug);
}

export async function setFeaturedProductImage(
  formData: FormData
) {
  const imageId = String(formData.get("imageId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(
    formData.get("productSlug") ?? ""
  );

  if (!imageId || !productId || !productSlug) {
    throw new Error("Missing image or product information.");
  }

  const { error: resetError } = await supabase
    .from("product_images")
    .update({
      is_featured: false,
    })
    .eq("product_id", productId);

  if (resetError) {
    throw new Error(resetError.message);
  }

  const { error: featuredError } = await supabase
    .from("product_images")
    .update({
      is_featured: true,
    })
    .eq("id", imageId)
    .eq("product_id", productId);

  if (featuredError) {
    throw new Error(featuredError.message);
  }

  refreshProductPages(productSlug);
}

export async function deleteProductImage(
  formData: FormData
) {
  const imageId = String(formData.get("imageId") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(
    formData.get("productSlug") ?? ""
  );

  if (!imageId || !imageUrl || !productId) {
    throw new Error("Missing image information.");
  }

  const { data: image, error: imageError } = await supabase
    .from("product_images")
    .select("is_featured")
    .eq("id", imageId)
    .single();

  if (imageError) {
    throw new Error(imageError.message);
  }

  const marker = "/storage/v1/object/public/products/";
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error("Unable to determine the storage path.");
  }

  const storagePath = decodeURIComponent(
    imageUrl.slice(markerIndex + marker.length)
  );

  const { error: storageError } = await supabase.storage
    .from("products")
    .remove([storagePath]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: databaseError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (databaseError) {
    throw new Error(databaseError.message);
  }

  // If the featured image was deleted, make the first remaining image featured.
  if (image.is_featured) {
    const { data: nextImage, error: nextImageError } =
      await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", productId)
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (nextImageError) {
      throw new Error(nextImageError.message);
    }

    if (nextImage) {
      const { error: updateError } = await supabase
        .from("product_images")
        .update({
          is_featured: true,
        })
        .eq("id", nextImage.id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }
  }

  refreshProductPages(productSlug);
}