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

export async function getDashboardTopStats() {
  const supabase = await createClient();
  const { data: orders, error: ordersError } = await supabase.from("orders").select(`
    *,
    customers ( id, name, email ),
    order_items ( id, product_id, product_name, quantity, line_total )
  `);
  
  if (ordersError) {
    return { topProducts: [], topCustomers: [] };
  }
  
  const productSales = new Map();
  const customerSales = new Map();
  
  orders.forEach((order: any) => {
    // Customers
    if (order.customers) {
      const cId = order.customers.id;
      if (!customerSales.has(cId)) {
        customerSales.set(cId, { ...order.customers, totalSpent: 0, orderCount: 0 });
      }
      const c = customerSales.get(cId);
      c.totalSpent += (Number(order.total) || 0);
      c.orderCount += 1;
    }
    
    // Products
    if (order.order_items) {
      order.order_items.forEach((item: any) => {
        const pId = item.product_id;
        if (!productSales.has(pId)) {
          productSales.set(pId, { id: pId, name: item.product_name, totalRevenue: 0, quantity: 0 });
        }
        const p = productSales.get(pId);
        p.totalRevenue += (Number(item.line_total) || 0);
        p.quantity += (Number(item.quantity) || 0);
      });
    }
  });
  
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);
    
  const topCustomers = Array.from(customerSales.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
    
  return { topProducts, topCustomers };
}
