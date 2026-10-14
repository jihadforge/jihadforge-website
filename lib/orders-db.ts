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

export type OrderItem = {
  productId: string | null;
  name: string | null;
  size: string | null;
  color: string | null;
  quantity: number | null;
  unit_amount: number | null;
  total_amount: number | null;
  currency: string | null;
};

export type ShippingAddress = {
  name?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
};

export type FulfillmentStatus =
  | "pending"
  | "shipped"
  | "delivered";

export type Order = {
  id: string | number;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;

  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;

  shipping_address: ShippingAddress | null;
  shipping_carrier: string | null;
  tracking_number: string | null;

  items: OrderItem[] | null;

  subtotal_amount: number | null;
  shipping_amount: number | null;
  tax_amount: number | null;
  total_amount: number | null;
  currency: string | null;

  payment_status: string | null;
  fulfillment_status: FulfillmentStatus;

  inventory_deducted: boolean | null;
  created_at: string;
};

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Unable to retrieve orders:", error);
    throw new Error("Unable to retrieve orders.");
  }

  return (data ?? []) as Order[];
}

export async function updateOrderStatus(
  id: string,
  status: FulfillmentStatus
) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      fulfillment_status: status,
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Unable to update order status:",
      error
    );

    throw new Error(
      "Unable to update order status."
    );
  }
}

export async function updateOrderTracking(
  id: string,
  shippingCarrier: string,
  trackingNumber: string
) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      shipping_carrier: shippingCarrier,
      tracking_number: trackingNumber,
      fulfillment_status: "shipped",
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Unable to update order tracking:",
      error
    );

    throw new Error(
      "Unable to update order tracking."
    );
  }
}