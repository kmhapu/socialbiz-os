import { createClient } from "@/lib/supabase/server";

export async function getConversations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*, customers(*)")
    .order("last_message_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
  return data;
}

export async function getConversation(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*, customers(*)")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
  return data;
}

export async function updateConversation(id: string, updates: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating conversation:", error);
    return null;
  }
  return data;
}

export async function createConversation(customerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      customer_id: customerId,
      status: 'open',
      last_message_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
  return data;
}
