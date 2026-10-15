
"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function updateVariantStock(formData: FormData) {
  const supabaseAuth = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user?.email) {
    throw new Error("You must be signed in.");
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    user.email.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    throw new Error("Unauthorized.");
  }

  const variantId = String(formData.get("variantId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");
  const rawQuantity = String(formData.get("quantity") ?? "");

  if (
    !variantId ||
    !productId ||
    !productSlug ||
    !/^\d+$/.test(rawQuantity)
  ) {
    throw new Error("Invalid inventory information.");
  }

  const quantity = Number(rawQuantity);

  if (!Number.isSafeInteger(quantity)) {
    throw new Error("Invalid stock quantity.");
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

  const { data, error } = await supabase
    .from("product_variants")
    .update({ inventory_quantity: quantity })
    .eq("id", variantId)
    .eq("product_id", productId)
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.length) {
    throw new Error("Variant not found.");
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productSlug}`);
  revalidatePath(`/product/${productSlug}`);
}