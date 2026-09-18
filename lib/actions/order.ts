"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getOrder } from "@/lib/data/orders";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  
  // Minimal order creation for sprint 1
  // Create a customer first
  const { data: customer, error: customerError } = await supabase.from("customers").insert([
    { name: "Guest Customer", email: "guest@example.com" }
  ]).select().single();
  
  if (customerError) {
    return { success: false, error: customerError.message };
  }
  
  const productId = formData.get("productId") as string;
  const quantity = Number(formData.get("quantity") || 1);
  
  // Get product
  const { data: product } = await supabase.from("products").select("*").eq("id", productId).single();
  
  if (!product) {
    return { success: false, error: "Product not found" };
  }
  
  const unit_price = Number(product.price);
  const line_total = unit_price * quantity;
  
  // Create order
  const { data: order, error: orderError } = await supabase.from("orders").insert([
    {
      customer_id: customer.id,
      status: "new",
      subtotal: line_total,
      total: line_total,
    }
  ]).select().single();
  
  if (orderError) {
    return { success: false, error: orderError.message };
  }
  
  // Create order item
  await supabase.from("order_items").insert([
    {
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      unit_price: unit_price,
      quantity,
      line_total,
    }
  ]);

  revalidatePath("/orders");
  return { success: true };
}

export async function confirmOrder(id: string) {
  const supabase = await createClient();
  
  // 1. Get the order with items
  const order = await getOrder(id);
  
  if (!order) return { success: false, error: "Order not found" };
  if (order.status === "confirmed") return { success: false, error: "Already confirmed" };
  
  // 2. Decrement stock for each item
  for (const item of order.order_items || []) {
    if (item.product_id) {
      // Get current stock
      const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).single();
      const currentStock = product?.stock || 0;
      
      // Update stock
      await supabase.from("products").update({
        stock: currentStock - item.quantity
      }).eq("id", item.product_id);
    }
  }
  
  // 3. Update order status
  const { error: updateError } = await supabase.from("orders").update({ status: "confirmed" }).eq("id", id);
  if (updateError) {
    return { success: false, error: updateError.message };
  }
  
  // 4. Write to audit_logs
  await supabase.from("audit_logs").insert([
    {
      actor: "system",
      action: "order.confirmed",
      entity_type: "order",
      entity_id: id,
      metadata: { items_count: order.order_items?.length || 0 }
    }
  ]);
  
  revalidatePath("/orders");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  
  return { success: true };
}
