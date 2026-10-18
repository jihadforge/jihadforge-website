import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
      .select(`
        id,
        size,
        color,
        inventory_quantity,
        active,
        products!inner (
          slug,
          status
        )
      `)
      .eq("active", true)
      .eq("products.status", "active");

    if (error) {
      console.error("Inventory API error:", error);

      return NextResponse.json(
        { error: "Unable to retrieve inventory." },
        { status: 500 }
      );
    }

    const variants = await Promise.all(
      (data ?? []).map(async (variant) => {
        const { data: reserved, error: reservedError } =
          await supabase.rpc("active_reserved_quantity", {
            p_variant_id: variant.id,
          });

        if (reservedError) {
          throw reservedError;
        }

        return {
          size: variant.size,
          color: variant.color,
          active: variant.active,
          products: variant.products,
          inventory_quantity: Math.max(
            0,
            variant.inventory_quantity - Number(reserved ?? 0)
          ),
        };
      })
    );

    const response = NextResponse.json({ variants });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Inventory API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve inventory." },
      { status: 500 }
    );
  }
}