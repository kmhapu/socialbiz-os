import { createClient } from "@/lib/supabase/server";

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select(`
    *,
    customers ( name, email ),
    order_items ( id, product_name, quantity, unit_price, line_total )
  `).order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
}

export async function getOrder(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select(`
    *,
    customers ( name, email ),
    order_items ( id, product_id, product_name, quantity, unit_price, line_total )
  `).eq("id", id).single();
  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }
  return data;
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: orders, error: ordersError } = await supabase.from("orders").select("total");
  
  if (ordersError) {
    console.error("Error fetching dashboard stats:", ordersError);
    return { revenue: 0, orderCount: 0 };
  }
  
  const orderCount = orders.length;
  const revenue = orders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
  
  return { revenue, orderCount };
}
