"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const price = Number(formData.get("price"));
  const status = String(formData.get("status") ?? "draft").toLowerCase();

  if (!name || !slug || !Number.isFinite(price) || price < 0) {
    throw new Error("Please enter a valid name, slug, and price.");
  }

  if (!["draft", "active"].includes(status)) {
    throw new Error("Invalid product status.");
  }

  const priceAmount = Math.round(price * 100);

  const { error } = await supabaseAdmin.from("products").insert({
    name,
    slug,
    description: description || null,
    price_amount: priceAmount,
    currency: "usd",
    status,
    featured: false,
  });

  if (error) {
    console.error("Unable to create product:", error);
    throw new Error(error.message);
  }

  redirect("/admin/products");
}