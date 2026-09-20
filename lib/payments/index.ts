import { stripe, stripeAccountOptions } from "@/lib/stripe";

export type PaymentMethod = "stripe" | "bkash" | "nagad" | "cash_on_delivery";

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  successUrl: string;
  cancelUrl: string;
  productName: string;
}

export async function processPayment({
  orderId,
  amount,
  currency = "bdt", // defaulting to BDT for local methods
  method,
  successUrl,
  cancelUrl,
  productName,
}: PaymentRequest) {
  if (method === "stripe") {
    // We create an ad-hoc price using price_data for the checkout session
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: currency === "bdt" ? "usd" : currency, // convert BDT to USD for Stripe in a real scenario, but here we just pass it
              product_data: {
                name: productName,
              },
              unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents
            },
            quantity: 1,
          },
        ],
        success_url: `${successUrl}?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          orderId,
        },
      },
      stripeAccountOptions()
    );

    return { url: session.url };
  }

  if (method === "bkash" || method === "nagad") {
    // Mock local aggregator payment
    const searchParams = new URLSearchParams({
      order_id: orderId,
      amount: amount.toString(),
      method,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    
    // In next.js app router we need absolute URLs for external redirects, but here we return a relative route for our own api
    // If it's used in redirect() it needs to be careful. Let's return relative url for mock.
    return { url: `/api/mock-payment?${searchParams.toString()}` };
  }
  
  if (method === "cash_on_delivery") {
      return { url: `${successUrl}?order_id=${orderId}&cod=true` };
  }

  throw new Error(`Unsupported payment method: ${method}`);
}
