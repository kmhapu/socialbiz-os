"use server";

import { createMessage } from "@/lib/data/messages";
import { classifyIntent, suggestReply } from "@/lib/ai";
import { updateConversation } from "@/lib/data/conversations";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function receiveMessage(conversationId: string, text: string) {
  // 1. Classify intent
  const { intent, confidence } = await classifyIntent(text);
  
  // 2. Suggest reply
  const { reply, matchedProductId } = await suggestReply(text, intent);
  
  // 3. Save message
  await createMessage({
    conversation_id: conversationId,
    body: text,
    sender: "customer",
    intent,
    intent_confidence: confidence,
    intent_source: "rule_classifier_v1",
    suggested_reply: reply,
    suggested_reply_confidence: reply ? 0.85 : null,
    suggested_reply_source: reply ? "catalog_lookup_v1" : null
  });
  
  // 4. Update conversation with intent and last message time
  await updateConversation(conversationId, {
    intent,
    intent_confidence: confidence,
    intent_source: "rule_classifier_v1",
    last_message_at: new Date().toISOString()
  });
  
  revalidatePath("/inbox");
  return { success: true, intent, reply, matchedProductId };
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
    
  return data || [];
}

export async function sendReply(conversationId: string, text: string) {
  await createMessage({
    conversation_id: conversationId,
    body: text,
    sender: "agent"
  });
  
  await updateConversation(conversationId, {
    last_message_at: new Date().toISOString()
  });
  
  revalidatePath("/inbox");
  return { success: true };
}
