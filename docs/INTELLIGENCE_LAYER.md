# SocialBiz OS — Intelligence Layer

## Messy Inputs
- Raw Messenger messages (abbreviated, code-mixed EN/BN/Banglish): "red saree ta koto?", "ai product available naki?", "ami 2ta order korbo"
- Product names with typos: "red saree" vs product "Red Cotton Saree"
- Missing order fields: no quantity, no address, no size variant

## Auto-Structure Schema (per message)
```json
{
  "message_id": "uuid",
  "intent": "price_inquiry",
  "intent_confidence": 0.92,
  "intent_source": "rule_classifier_v1",
  "entities": {
    "product_ref": "red saree",
    "matched_product_id": "uuid-or-null",
    "quantity": null,
    "variant": null
  },
  "suggested_reply": "Red Cotton Saree is ৳1,200 and we have 8 in stock. Would you like to order?",
  "suggested_reply_confidence": 0.85,
  "suggested_reply_source": "catalog_lookup_v1",
  "missing_fields": ["quantity", "delivery_address"],
  "should_escalate": false
}
```

## Events to Track
- `message.received` — new message arrives
- `message.classified` — intent assigned
- `reply.suggested` — AI draft generated
- `order.created` — order created from conversation
- `order.confirmed` — human confirmed
- `product.stock_changed` — stock decremented
- `content.caption_generated` — AI caption drafted

## Scoring Rules (v1: rule-based)
- **Intent match**: keyword → intent. "price/koto/dam" → price_inquiry (conf 0.9). "stock/available/ache" → stock_check (0.9). "order/korte chai/korbo" → purchase_intent (0.95). Else → general (0.5).
- **Product match**: normalized text overlap with product name/sku. Exact match: 0.95. Partial: 0.6. No match: null.
- **Reply confidence**: product matched + intent clear → 0.85. Product unmatched → 0.3 (escalate). Intent ambiguous → 0.4 (escalate).
- **Escalate if**: confidence < 0.5, or message contains anger keywords ("angry", "bad", "complain"), or missing critical fields after 2 rounds.

## What Gets Ranked
- Inbox conversations by: intent=purchase_intent first, then recency, then unassigned.
- Suggested replies by confidence descending.
- Products for matching by fuzzy text similarity to message.

## v1 vs Later
**v1:** Rule-based intent classifier, catalog lookup for verified replies, keyword escalation, simple ranking. No ML model.
**Later:** LLM-based intent + entity extraction, learning from confirmed orders, adaptive reply tone, multi-turn order collection, sentiment analysis.
