import { getConversations } from "@/lib/data/conversations";
import { getProducts } from "@/lib/data/products";
import { InboxClient } from "./inbox-client";
import { Suspense } from "react";

export default async function InboxPage() {
  const conversations = await getConversations();
  const products = await getProducts();
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-[calc(100vh-65px)] flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
      </div>
      <Suspense fallback={<div>Loading inbox...</div>}>
        <InboxClient initialConversations={conversations} products={products} />
      </Suspense>
    </div>
  );
}
