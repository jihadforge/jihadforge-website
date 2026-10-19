import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const resend = new Resend(process.env.RESEND_API_KEY!);

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

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character] ?? character;
  });
}

export async function processCheckoutSession(
  sessionId: string
): Promise<Response> {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["payment_intent"],
      }
    );

    if (session.status !== "complete") {
      return new Response(
        "Checkout is not complete",
        { status: 409 }
      );
    }

    if (session.payment_status !== "paid") {
      return new Response(
        "Payment has not been confirmed",
        { status: 409 }
      );
    }

    const reservationId =
      session.metadata?.reservationId ??
      session.client_reference_id;

    if (!reservationId) {
      throw new Error("Missing inventory reservation ID");
    }

    const { error: attachError } = await supabaseAdmin.rpc(
      "attach_checkout_session",
      {
        p_reservation_id: reservationId,
        p_stripe_session_id: session.id,
      }
    );

    if (attachError) {
      throw attachError;
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(
      session.id,
      {
        limit: 100,
        expand: ["data.price.product"],
      }
    );

    if (lineItems.has_more) {
      throw new Error("Checkout has too many line items");
    }

    const items = lineItems.data.map((item) => {
      const product =
  item.price?.product &&
  typeof item.price.product !== "string" &&
  !item.price.product.deleted
    ? item.price.product
    : null;

const metadata = product?.metadata ?? {};

      return {
        productId: metadata.productId ?? null,
        name: item.description ?? null,
        size: metadata.size ?? null,
        color: metadata.color ?? null,
        quantity: item.quantity ?? 0,
        unit_amount: item.price?.unit_amount ?? 0,
        total_amount: item.amount_total,
        currency: item.currency,
      };
    });

    if (
      items.length === 0 ||
      items.some(
        (item) =>
          !item.productId ||
          !item.size ||
          !item.color ||
          item.quantity < 1
      )
    ) {
      throw new Error(
        "Checkout line items are missing product information"
      );
    }

    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const customerEmail =
      session.customer_details?.email ??
      session.customer_email ??
      null;

    const customerName =
  session.collected_information?.shipping_details?.name ||
  session.customer_details?.name ||
  "Customer";

    const currency = session.currency ?? "usd";

    const { error: orderError } = await supabaseAdmin
      .from("orders")
      .upsert(
        {
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntent,
          customer_email: customerEmail,
          customer_name:
  session.collected_information?.shipping_details?.name ??
  session.customer_details?.name ??
  null,
          customer_phone:
            session.customer_details?.phone ?? null,
          shipping_address:
            session.collected_information?.shipping_details ??
            null,
          items,
          subtotal_amount: session.amount_subtotal ?? 0,
          shipping_amount:
            session.total_details?.amount_shipping ?? 0,
          tax_amount:
            session.total_details?.amount_tax ?? 0,
          total_amount: session.amount_total ?? 0,
          currency,
          payment_status: session.payment_status,
          fulfillment_status: "pending",
        },
        {
          onConflict: "stripe_session_id",
          ignoreDuplicates: true,
        }
      );

    if (orderError) {
      throw orderError;
    }

    const { error: inventoryError } =
      await supabaseAdmin.rpc(
        "deduct_order_inventory",
        {
          p_stripe_session_id: session.id,
        }
      );

    if (inventoryError) {
      throw inventoryError;
    }

    // Claim the confirmation email atomically so
    // webhook retries do not send duplicate emails.
    if (customerEmail) {
      const { data: claimedRows, error: claimError } =
        await supabaseAdmin
          .from("orders")
          .update({
            confirmation_email_claimed_at:
              new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id)
          .is("confirmation_email_claimed_at", null)
          .is("confirmation_email_sent_at", null)
          .eq("inventory_deducted", true)
          .select("stripe_session_id");

      if (claimError) {
        throw claimError;
      }

      if ((claimedRows?.length ?? 0) > 0) {
        const itemRows = items
          .map((item) => {
            const details = [
              item.size ? `Size: ${item.size}` : null,
              item.color ? `Color: ${item.color}` : null,
              `Qty: ${item.quantity}`,
            ]
              .filter(Boolean)
              .join(" • ");

            return `
              <tr>
                <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;">
                  <div style="font-size:16px;font-weight:600;">
                    ${escapeHtml(item.name ?? "JihadForge Product")}
                  </div>
                  <div style="margin-top:5px;font-size:14px;color:#666;">
                    ${escapeHtml(details)}
                  </div>
                </td>
                <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;text-align:right;white-space:nowrap;">
                  ${formatMoney(item.total_amount, currency)}
                </td>
              </tr>
            `;
          })
          .join("");

        const subtotal = session.amount_subtotal ?? 0;
        const shipping =
          session.total_details?.amount_shipping ?? 0;
        const tax =
          session.total_details?.amount_tax ?? 0;
        const total = session.amount_total ?? 0;

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;padding:40px 15px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background:#000;color:#fff;text-align:center;padding:28px 20px;">
                    <div style="font-size:26px;font-weight:700;letter-spacing:3px;">
                      JIHADFORGE
                    </div>
                    <div style="margin-top:8px;font-size:12px;letter-spacing:2px;color:#ccc;">
                      BUILT WITH PURPOSE
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <h1 style="font-size:24px;margin:0 0 14px;">
                      Order confirmed
                    </h1>
                    <p style="font-size:16px;line-height:1.6;">
                      As-salamu alaykum ${escapeHtml(customerName)},
                    </p>
                    <p style="color:#555;font-size:15px;line-height:1.6;">
                      Thank you for your order. We've received your payment
                      and are preparing your JihadForge order.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemRows}
                    </table>
                    <table width="100%" style="margin-top:24px;font-size:14px;">
                      <tr>
                        <td style="padding:6px 0;color:#666;">Subtotal</td>
                        <td style="text-align:right;">
                          ${formatMoney(subtotal, currency)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#666;">Shipping</td>
                        <td style="text-align:right;">
                          ${formatMoney(shipping, currency)}
                        </td>
                      </tr>
                      ${
                        tax > 0
                          ? `<tr>
                              <td style="padding:6px 0;color:#666;">Tax</td>
                              <td style="text-align:right;">
                                ${formatMoney(tax, currency)}
                              </td>
                            </tr>`
                          : ""
                      }
                      <tr>
                        <td style="padding-top:14px;border-top:1px solid #ddd;font-size:17px;font-weight:700;">
                          Total
                        </td>
                        <td style="padding-top:14px;border-top:1px solid #ddd;text-align:right;font-size:17px;font-weight:700;">
                          ${formatMoney(total, currency)}
                        </td>
                      </tr>
                    </table>
                    <p style="margin-top:30px;color:#666;font-size:14px;line-height:1.6;">
                      We'll send you another update when your order ships.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px;background:#f1f1f1;text-align:center;color:#777;font-size:12px;">
                    JihadForge • Built With Purpose
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `;

        try {
          const { error: emailError } =
            await resend.emails.send({
              from: "JihadForge <orders@jihadforge.com>",
              to: [customerEmail],
              subject: "Your JihadForge order is confirmed",
              html: emailHtml,
            });

          if (emailError) {
            console.error(
              "Confirmation email failed:",
              emailError
            );
          } else {
            const { error: markSentError } =
              await supabaseAdmin
                .from("orders")
                .update({
                  confirmation_email_sent_at:
                    new Date().toISOString(),
                })
                .eq("stripe_session_id", session.id);

            if (markSentError) {
              console.error(
                "Unable to mark confirmation email sent:",
                markSentError
              );
            }
          }
        } catch (emailError) {
          console.error(
            "Confirmation email failed:",
            emailError
          );
        }
      }
    }

    console.log(
      "JihadForge order processed:",
      session.id
    );

    return Response.json({
      received: true,
      processed: true,
    });
  } catch (error) {
    console.error(
      "Stripe order processing failed:",
      sessionId,
      error
    );

    return new Response(
      "Order processing failed",
      { status: 500 }
    );
  }
}