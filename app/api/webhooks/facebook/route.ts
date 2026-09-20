import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifyIntent, suggestReply } from "@/lib/ai";

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || "socialbiz_fb_verify_123";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object === "page") {
      const supabase = createAdminClient();

      for (const entry of body.entry) {
        const webhookEvent = entry.messaging?.[0];
        if (!webhookEvent || !webhookEvent.message) continue;

        const senderPsid = webhookEvent.sender.id;
        // The page ID that received the message
        const pageId = webhookEvent.recipient.id;
        const messageText = webhookEvent.message.text;

        if (!messageText) continue;

        // Find the page in our DB to get tenant_id and user_id
        const { data: pageData } = await supabase
          .from("facebook_pages")
          .select("tenant_id, user_id")
          .eq("page_id", pageId)
          .single();

        if (!pageData) {
          console.error(`Page not found for ID: ${pageId}`);
          continue; // Cannot attribute to a tenant
        }

        const tenantId = pageData.tenant_id;
        const userId = pageData.user_id;

        // 1. Find or create customer by fb_psid
        let customerId;
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("id")
          .eq("tenant_id", tenantId)
          .eq("fb_psid", senderPsid)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const { data: newCustomer, error: custError } = await supabase
            .from("customers")
            .insert({
              tenant_id: tenantId,
              user_id: userId,
              name: `FB User ${senderPsid}`,
              fb_psid: senderPsid,
            })
            .select("id")
            .single();
          
          if (custError || !newCustomer) {
            console.error("Failed to create customer:", custError);
            continue;
          }
          customerId = newCustomer.id;
        }

        // 2. Find or create conversation
        let conversationId;
        const { data: existingConversation } = await supabase
          .from("conversations")
          .select("id")
          .eq("tenant_id", tenantId)
          .eq("customer_id", customerId)
          .order("last_message_at", { ascending: false })
          .limit(1)
          .single();

        if (existingConversation) {
          conversationId = existingConversation.id;
        } else {
          const { data: newConv, error: convError } = await supabase
            .from("conversations")
            .insert({
              tenant_id: tenantId,
              user_id: userId,
              customer_id: customerId,
              status: "open",
              last_message_at: new Date().toISOString()
            })
            .select("id")
            .single();

          if (convError || !newConv) {
            console.error("Failed to create conversation:", convError);
            continue;
          }
          conversationId = newConv.id;
        }

        // 3. Classify intent and suggest reply
        const { intent, confidence } = await classifyIntent(messageText);
        const { reply } = await suggestReply(messageText, intent);

        // 4. Save message
        const { error: msgError } = await supabase.from("messages").insert({
          conversation_id: conversationId,
          user_id: userId,
          body: messageText,
          sender: "customer",
          intent,
          intent_confidence: confidence,
          intent_source: "webhook_classifier_v1",
          suggested_reply: reply,
          suggested_reply_confidence: reply ? 0.85 : null,
          suggested_reply_source: reply ? "catalog_lookup_v1" : null
        });

        if (msgError) {
          console.error("Failed to save message:", msgError);
          continue;
        }

        // 5. Update conversation status
        await supabase.from("conversations").update({
          intent,
          intent_confidence: confidence,
          intent_source: "webhook_classifier_v1",
          last_message_at: new Date().toISOString()
        }).eq("id", conversationId);
      }

      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (err) {
    console.error("FB Webhook error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
