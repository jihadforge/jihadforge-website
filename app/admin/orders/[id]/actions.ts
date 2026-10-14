"use server";

import { revalidatePath } from "next/cache";
import {
  updateOrderStatus,
  updateOrderTracking,
} from "@/lib/orders-db";

export async function changeOrderStatus(
  formData: FormData
) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id) {
    throw new Error("Missing order ID.");
  }

  if (
    status !== "pending" &&
    status !== "shipped" &&
    status !== "delivered"
  ) {
    throw new Error("Invalid fulfillment status.");
  }

  await updateOrderStatus(id, status);

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function saveOrderTracking(
  formData: FormData
) {
  const id = String(formData.get("id") ?? "").trim();

  const shippingCarrier = String(
    formData.get("shippingCarrier") ?? ""
  ).trim();

  const trackingNumber = String(
    formData.get("trackingNumber") ?? ""
  ).trim();

  if (!id) {
    throw new Error("Missing order ID.");
  }

  if (!shippingCarrier) {
    throw new Error(
      "Please select a shipping carrier."
    );
  }

  if (!trackingNumber) {
    throw new Error(
      "Please enter a tracking number."
    );
  }

  await updateOrderTracking(
    id,
    shippingCarrier,
    trackingNumber
  );

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}