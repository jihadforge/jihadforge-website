import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const resend = new Resend(
  process.env.RESEND_API_KEY!
);

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

function formatMoney(
  amount: number,
  currency = "usd"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

export async function POST(request: Request) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "Missing STRIPE_WEBHOOK_SECRET"
    );

    return new Response(
      "Webhook secret is not configured",
      {
        status: 500,
      }
    );
  }

  const signature = request.headers.get(
    "stripe-signature"
  );

  if (!signature) {
    return new Response(
      "Missing Stripe signature",
      {
        status: 400,
      }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown webhook error";

    console.error(
      "Webhook verification failed:",
      message
    );

    return new Response(
      `Webhook Error: ${message}`,
      {
        status: 400,
      }
    );
  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const eventSession =
      event.data.object as Stripe.Checkout.Session;

    try {
      const session =
        await stripe.checkout.sessions.retrieve(
          eventSession.id,
          {
            expand: [
              "line_items",
              "payment_intent",
            ],
          }
        );

      if (session.payment_status !== "paid") {
        console.log(
          "Checkout completed but payment is not paid:",
          session.id
        );

        return Response.json({
          received: true,
        });
      }

      const items =
        session.line_items?.data.map(
          (item) => ({
            productId:
              item.metadata?.productId ??
              null,

            name:
              item.description ?? null,

            size:
              item.metadata?.size ?? null,

            color:
              item.metadata?.color ?? null,

            quantity:
              item.quantity ?? 0,

            unit_amount:
              item.price?.unit_amount ?? 0,

            total_amount:
              item.amount_total,

            currency:
              item.currency,
          })
        ) ?? [];

      const paymentIntent =
        typeof session.payment_intent ===
        "string"
          ? session.payment_intent
          : session.payment_intent?.id ??
            null;

      const shippingDetails =
        session.collected_information
          ?.shipping_details ?? null;

      const customerEmail =
        session.customer_details?.email ??
        session.customer_email ??
        null;

      const customerName =
        session.customer_details?.name ??
        "Customer";

      const currency =
        session.currency ?? "usd";

      const { error: orderError } =
        await supabaseAdmin
          .from("orders")
          .upsert(
            {
              stripe_session_id:
                session.id,

              stripe_payment_intent_id:
                paymentIntent,

              customer_email:
                customerEmail,

              customer_name:
                session.customer_details
                  ?.name ?? null,

              customer_phone:
                session.customer_details
                  ?.phone ?? null,

              shipping_address:
                shippingDetails,

              items,

              subtotal_amount:
                session.amount_subtotal ??
                0,

              shipping_amount:
                session.total_details
                  ?.amount_shipping ?? 0,

              tax_amount:
                session.total_details
                  ?.amount_tax ?? 0,

              total_amount:
                session.amount_total ?? 0,

              currency,

              payment_status:
                session.payment_status,

              fulfillment_status:
                "pending",
            },
            {
              onConflict:
                "stripe_session_id",
              ignoreDuplicates: true,
            }
          );

      if (orderError) {
        console.error(
          "Supabase order error:",
          orderError
        );

        return new Response(
          "Failed to save order",
          {
            status: 500,
          }
        );
      }

      const { error: inventoryError } =
        await supabaseAdmin.rpc(
          "deduct_order_inventory",
          {
            p_stripe_session_id:
              session.id,
          }
        );

      if (inventoryError) {
        console.error(
          "Inventory deduction failed:",
          inventoryError
        );

        return new Response(
          "Failed to update inventory",
          {
            status: 500,
          }
        );
      }

      /*
       * Send order confirmation email.
       *
       * Email failure does NOT fail the Stripe
       * webhook because the payment, order,
       * and inventory update have already
       * succeeded.
       */
      // Atomically reserve the confirmation email. A conditional UPDATE
      // prevents two concurrent webhook deliveries from both sending it.
      // Claims are intentionally not released automatically after failures:
      // the provider might have accepted the email before a network error.
      let emailClaimed = false;
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
          // A retry can safely attempt the claim again.
          console.error("Email claim failed:", claimError);
          return new Response("Failed to claim email", { status: 500 });
        }
        emailClaimed = (claimedRows?.length ?? 0) > 0;
      }

      if (customerEmail && emailClaimed) {
        try {
          const itemRows = items
            .map((item) => {
              const details = [
                item.size
                  ? `Size: ${item.size}`
                  : null,
                item.color
                  ? `Color: ${item.color}`
                  : null,
                `Qty: ${item.quantity}`,
              ]
                .filter(Boolean)
                .join(" • ");

              return `
                <tr>
                  <td style="
                    padding:16px 0;
                    border-bottom:1px solid #e5e5e5;
                  ">
                    <div style="
                      font-size:16px;
                      font-weight:600;
                      color:#111111;
                    ">
                      ${escapeHtml(item.name ?? "JihadForge Product")}
                    </div>

                    <div style="
                      margin-top:5px;
                      font-size:14px;
                      color:#666666;
                    ">
                      ${escapeHtml(details)}
                    </div>
                  </td>

                  <td style="
                    padding:16px 0;
                    border-bottom:1px solid #e5e5e5;
                    text-align:right;
                    font-size:15px;
                    color:#111111;
                    white-space:nowrap;
                  ">
                    ${formatMoney(
                      item.total_amount ?? 0,
                      currency
                    )}
                  </td>
                </tr>
              `;
            })
            .join("");

          const subtotal =
            session.amount_subtotal ?? 0;

          const shipping =
            session.total_details
              ?.amount_shipping ?? 0;

          const tax =
            session.total_details
              ?.amount_tax ?? 0;

          const total =
            session.amount_total ?? 0;

          const { error: emailError } =
            await resend.emails.send({
              from:
                "JihadForge <orders@jihadforge.com>",

              to: [customerEmail],

              subject:
                "Your JihadForge order is confirmed",

              html: `
                <!DOCTYPE html>
                <html>
                  <body style="
                    margin:0;
                    padding:0;
                    background:#f5f5f5;
                    font-family:Arial, Helvetica, sans-serif;
                    color:#111111;
                  ">
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        padding:40px 15px;
                        background:#f5f5f5;
                      "
                    >
                      <tr>
                        <td align="center">

                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              max-width:600px;
                              background:#ffffff;
                              border-radius:12px;
                              overflow:hidden;
                            "
                          >

                            <tr>
                              <td style="
                                background:#000000;
                                color:#ffffff;
                                text-align:center;
                                padding:28px 20px;
                              ">
                                <div style="
                                  font-size:26px;
                                  font-weight:700;
                                  letter-spacing:3px;
                                ">
                                  JIHADFORGE
                                </div>

                                <div style="
                                  margin-top:8px;
                                  font-size:12px;
                                  letter-spacing:2px;
                                  color:#cccccc;
                                ">
                                  BUILT WITH PURPOSE
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style="
                                padding:32px;
                              ">

                                <h1 style="
                                  margin:0 0 14px;
                                  font-size:24px;
                                ">
                                  Order confirmed
                                </h1>

                                <p style="
                                  margin:0 0 10px;
                                  font-size:16px;
                                  line-height:1.6;
                                ">
                                  Assalamu Alaikum ${escapeHtml(customerName)},
                                </p>

                                <p style="
                                  margin:0 0 25px;
                                  color:#555555;
                                  font-size:15px;
                                  line-height:1.6;
                                ">
                                  Thank you for your order.
                                  We've received your payment
                                  and are preparing your
                                  JihadForge order.
                                </p>

                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                >
                                  ${itemRows}
                                </table>

                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  style="
                                    margin-top:24px;
                                    font-size:14px;
                                  "
                                >
                                  <tr>
                                    <td style="
                                      padding:6px 0;
                                      color:#666666;
                                    ">
                                      Subtotal
                                    </td>
                                    <td style="
                                      padding:6px 0;
                                      text-align:right;
                                    ">
                                      ${formatMoney(
                                        subtotal,
                                        currency
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td style="
                                      padding:6px 0;
                                      color:#666666;
                                    ">
                                      Shipping
                                    </td>
                                    <td style="
                                      padding:6px 0;
                                      text-align:right;
                                    ">
                                      ${formatMoney(
                                        shipping,
                                        currency
                                      )}
                                    </td>
                                  </tr>

                                  ${
                                    tax > 0
                                      ? `
                                        <tr>
                                          <td style="
                                            padding:6px 0;
                                            color:#666666;
                                          ">
                                            Tax
                                          </td>
                                          <td style="
                                            padding:6px 0;
                                            text-align:right;
                                          ">
                                            ${formatMoney(
                                              tax,
                                              currency
                                            )}
                                          </td>
                                        </tr>
                                      `
                                      : ""
                                  }

                                  <tr>
                                    <td style="
                                      padding-top:14px;
                                      border-top:1px solid #dddddd;
                                      font-size:17px;
                                      font-weight:700;
                                    ">
                                      Total
                                    </td>

                                    <td style="
                                      padding-top:14px;
                                      border-top:1px solid #dddddd;
                                      text-align:right;
                                      font-size:17px;
                                      font-weight:700;
                                    ">
                                      ${formatMoney(
                                        total,
                                        currency
                                      )}
                                    </td>
                                  </tr>
                                </table>

                                <p style="
                                  margin:30px 0 0;
                                  font-size:14px;
                                  color:#666666;
                                  line-height:1.6;
                                ">
                                  We'll send you another
                                  update when your order
                                  ships.
                                </p>

                              </td>
                            </tr>

                            <tr>
                              <td style="
                                padding:22px;
                                background:#f1f1f1;
                                text-align:center;
                                color:#777777;
                                font-size:12px;
                              ">
                                JihadForge • Built With Purpose
                              </td>
                            </tr>

                          </table>

                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
              `,
            });

          if (emailError) {
            console.error(
              "Order confirmation email failed:",
              emailError
            );
          } else {
            const { error: markSentError } = await supabaseAdmin
              .from("orders")
              .update({
                confirmation_email_sent_at: new Date().toISOString(),
              })
              .eq("stripe_session_id", session.id);

            if (markSentError) {
              console.error("Email sent, but status update failed:", markSentError);
            }
            console.log("Order confirmation email sent:", customerEmail);
          }
        } catch (emailError) {
          console.error(
            "Order confirmation email failed:",
            emailError
          );
        }
      } else if (!customerEmail) {
        console.warn("No customer email found for order:", session.id);
      } else {
        console.log("Confirmation email already claimed or sent:", session.id);
      }

      console.log(
        "Order saved and inventory updated:",
        session.id
      );
    } catch (error) {
      console.error(
        "Order processing failed:",
        error
      );

      return new Response(
        "Order processing failed",
        {
          status: 500,
        }
      );
    }
  }

  return Response.json({
    received: true,
  });
}