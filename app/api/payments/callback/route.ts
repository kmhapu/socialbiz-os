import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  
  if (!orderId) {
    return NextResponse.redirect(new URL("/orders", request.url));
  }

  const supabase = await createClient();
  let paymentStatus = "pending";
  let paymentMethod = searchParams.get("method") || "unknown";

  // Check if it's a Stripe callback
  const sessionId = searchParams.get("session_id");
  if (sessionId) {
    paymentMethod = "stripe";
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        paymentStatus = "paid";
      } else {
        paymentStatus = "failed";
      }
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      paymentStatus = "failed";
    }
  } 
  // Check for mock aggregator callback
  else if (searchParams.get("status")) {
    const status = searchParams.get("status");
    if (status === "success") {
      paymentStatus = "paid";
    } else {
      paymentStatus = "failed";
    }
  }
  // Cash on delivery
  else if (searchParams.get("cod") === "true") {
      paymentMethod = "cash_on_delivery";
      paymentStatus = "pending"; // Will be paid on delivery
  }

  if (paymentStatus === "paid") {
    // Update order status to confirmed or paid
    await supabase.from("orders").update({ 
        status: "confirmed",
        notes: `Paid via ${paymentMethod}` 
    }).eq("id", orderId);
    
    // In a real app we'd also decrement stock here or via webhook
  } else if (paymentStatus === "failed") {
    await supabase.from("orders").update({ 
        status: "failed",
        notes: `Payment failed via ${paymentMethod}` 
    }).eq("id", orderId);
  } else if (paymentMethod === "cash_on_delivery") {
      await supabase.from("orders").update({ 
        notes: `Cash on Delivery` 
    }).eq("id", orderId);
  }

  // Redirect back to orders page
  return NextResponse.redirect(new URL("/orders", request.url));
}
