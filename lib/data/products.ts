import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}
