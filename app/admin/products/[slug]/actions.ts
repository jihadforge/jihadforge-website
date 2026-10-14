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

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;

  const name = formData.get("name") as string;

  const description = formData.get("description") as string;

  const price = Number(formData.get("price"));

  const status = formData.get("status") as
    | "draft"
    | "active"
    | "archived";

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price_amount: Math.round(price * 100),
      status,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products`);
}