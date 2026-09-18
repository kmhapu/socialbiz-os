"use client";

import { useState, useEffect } from "react";
import { receiveMessage, getConversationMessages, sendReply } from "@/lib/actions/inbox";
import { createOrderFromConversation } from "@/lib/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function InboxClient({ initialConversations, products }: { initialConversations: any[], products: any[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [filterIntent, setFilterIntent] = useState("all");
  
  const selectedConv = conversations.find(c => c.id === selectedConvId);
  
  useEffect(() => {
    if (selectedConvId) {
      getConversationMessages(selectedConvId).then(setMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConvId]);

  const filteredConversations = conversations.filter(c => {
    if (filterIntent === "all") return true;
    return c.intent === filterIntent;
  });

  const handleSimulateReceive = async () => {
    if (!selectedConvId || !inputText) return;
    const text = inputText;
    setInputText("");
    
    // Optimistic UI update could go here, but for simplicity we just re-fetch
    const res = await receiveMessage(selectedConvId, text);
    if (res.success) {
      const msgs = await getConversationMessages(selectedConvId);
      setMessages(msgs);
      // Update the local conversation list intent
      setConversations(prev => prev.map(c => 
        c.id === selectedConvId ? { ...c, intent: res.intent } : c
      ));
    }
  };

  const handleSendReply = async (text: string) => {
    if (!selectedConvId || !text) return;
    
    const res = await sendReply(selectedConvId, text);
    if (res.success) {
      const msgs = await getConversationMessages(selectedConvId);
      setMessages(msgs);
    }
  };

  const handleCreateOrder = async (productId: string | null) => {
    if (!selectedConvId) return;
    
    const formData = new FormData();
    formData.append("conversationId", selectedConvId);
    if (selectedConv?.customer_id) {
      formData.append("customerId", selectedConv.customer_id);
    }
    
    // If we have a matched product in the suggested reply, use it.
    // We can just pick the first product if we can't find it, or let user select.
    // For simplicity, we just use the first product if none provided by match, or the matched one.
    if (productId) {
      formData.append("productId", productId);
    } else {
      formData.append("productId", products[0]?.id || "");
    }
    formData.append("quantity", "1");
    
    const res = await createOrderFromConversation(formData);
    if (res.success) {
      alert("Order created successfully!");
    } else {
      alert("Failed to create order: " + res.error);
    }
  };

  return (
    <div className="flex h-full border rounded-md overflow-hidden">
      {/* Sidebar: Conversation List */}
      <div className="w-1/3 border-r flex flex-col bg-muted/20">
        <div className="p-4 border-b">
          <Select value={filterIntent} onValueChange={setFilterIntent}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intents</SelectItem>
              <SelectItem value="price_inquiry">Price Inquiry</SelectItem>
              <SelectItem value="purchase_intent">Purchase Intent</SelectItem>
              <SelectItem value="delivery_inquiry">Delivery Inquiry</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-1">
          {filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              className={`p-4 border-b cursor-pointer hover:bg-muted ${selectedConvId === conv.id ? 'bg-muted' : ''}`}
              onClick={() => setSelectedConvId(conv.id)}
            >
              <div className="font-semibold">{conv.customers?.name || "Unknown Customer"}</div>
              <div className="text-sm text-muted-foreground flex justify-between mt-1">
                <Badge variant="outline">{conv.intent || "No intent"}</Badge>
                <span className="text-xs">{new Date(conv.last_message_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      
      {/* Main View: Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConvId ? (
          <>
            <div className="p-4 border-b flex justify-between items-center shadow-sm z-10 bg-background">
              <div>
                <h3 className="font-bold">{selectedConv?.customers?.name || "Chat"}</h3>
                <div className="text-sm text-muted-foreground">Status: {selectedConv?.status}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleCreateOrder(null)}>Create Order (Manual)</Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4 bg-slate-50/50">
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="space-y-1">
                    <div className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'customer' ? 'bg-white border text-foreground' : 'bg-primary text-primary-foreground'}`}>
                        <div>{msg.body}</div>
                        {msg.intent && (
                          <div className="mt-2 flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">{msg.intent}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {msg.suggested_reply && (
                      <div className="flex justify-start pl-4">
                        <Card className="w-full max-w-[80%] border-dashed border-primary/50 bg-primary/5">
                          <CardContent className="p-3 text-sm space-y-2">
                            <div className="font-semibold text-primary/80 flex items-center gap-2">
                              <span>✨ AI Suggested Reply</span>
                            </div>
                            <div className="italic text-muted-foreground">{msg.suggested_reply}</div>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleSendReply(msg.suggested_reply)}>Send Reply</Button>
                              <Button size="sm" onClick={() => {
                                // Extract product match conceptually or if we stored it in DB.
                                // For simplicity, we just pass null and let it pick default, but we should match if possible.
                                // If the reply contains price, it's likely we matched a product.
                                const matchedProd = products.find(p => msg.suggested_reply.includes(p.name));
                                handleCreateOrder(matchedProd?.id || null);
                              }}>Create Order from Match</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type a message to simulate customer incoming..." 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSimulateReceive()}
                />
                <Button onClick={handleSimulateReceive}>Simulate</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
}
