import { getProducts } from "@/lib/data/products";

export async function classifyIntent(text: string): Promise<{ intent: string; confidence: number }> {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("price") || lowerText.includes("koto") || lowerText.includes("dam") || lowerText.includes("taka")) {
    return { intent: "price_inquiry", confidence: 0.9 };
  }
  if (lowerText.includes("order") || lowerText.includes("kinbo") || lowerText.includes("buy") || lowerText.includes("purchase")) {
    return { intent: "purchase_intent", confidence: 0.95 };
  }
  if (lowerText.includes("delivery") || lowerText.includes("somoy") || lowerText.includes("kobe")) {
    return { intent: "delivery_inquiry", confidence: 0.85 };
  }
  
  return { intent: "general", confidence: 0.5 };
}

export async function suggestReply(text: string, intent: string): Promise<{ reply: string | null; matchedProductId: string | null }> {
  const lowerText = text.toLowerCase();
  
  if (intent === "price_inquiry" || intent === "purchase_intent") {
    const products = await getProducts();
    for (const product of products) {
      const productNameLower = product.name.toLowerCase();
      // basic matching
      const words = productNameLower.split(" ");
      let matchCount = 0;
      for (const word of words) {
        if (lowerText.includes(word)) {
          matchCount++;
        }
      }
      
      // If we match at least one word from the product name (like 'red', 'saree', 'abaya')
      if (matchCount > 0) {
        if (intent === "price_inquiry") {
          return { 
            reply: `${product.name} is ৳${product.price} and we have ${product.stock} in stock. Would you like to order?`,
            matchedProductId: product.id
          };
        } else {
          return {
            reply: `${product.name} is ৳${product.price} each. Please confirm your size and delivery address.`,
            matchedProductId: product.id
          };
        }
      }
    }
  }
  
  if (intent === "delivery_inquiry") {
    return { reply: "Delivery usually takes 2-3 business days within Dhaka.", matchedProductId: null };
  }
  
  return { reply: null, matchedProductId: null };
}
