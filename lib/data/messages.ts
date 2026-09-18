import { createClient } from "@/lib/supabase/server";

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
    
  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data;
}

export async function createMessage(messageData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert(messageData)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating message:", error);
    return null;
  }
  return data;
}

export async function updateMessage(id: string, updates: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating message:", error);
    return null;
  }
  return data;
}
