import { createClient } from "@/lib/supabase/server";

export async function getCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
  return data;
}

export async function getCustomer(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
  return data;
}

export async function createCustomer(customerData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert(customerData)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating customer:", error);
    return null;
  }
  return data;
}
