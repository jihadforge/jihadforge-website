
import "server-only";
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

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  sku: string | null;
  inventory_quantity: number;
  active: boolean;
};

export type ProductImage = {
  id: string;
  image_url: string;
  is_featured: boolean;
  is_color_main: boolean;
  color: string | null;
  position: number;
};

export type DatabaseProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_amount: number;
  currency: string;
  status: "draft" | "active" | "archived";
  featured: boolean;
  created_at: string;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
};

const productSelection = `
  id,
  slug,
  name,
  description,
  price_amount,
  currency,
  status,
  featured,
  created_at,
  product_variants (
    id,
    size,
    color,
    sku,
    inventory_quantity,
    active
  ),
  product_images (
    id,
    image_url,
    is_featured,
    is_color_main,
    color,
    position
  )
`;

export async function getDatabaseProducts(): Promise<DatabaseProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(productSelection)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to retrieve products:", error);
    throw new Error("Unable to retrieve products.");
  }

  return (data ?? []) as DatabaseProduct[];
}

export async function getDatabaseProduct(
  slug: string
): Promise<DatabaseProduct> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(productSelection)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Unable to retrieve product:", error);
    throw new Error(error.message);
  }

  return data as DatabaseProduct;
}