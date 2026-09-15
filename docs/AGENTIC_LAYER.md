# SocialBiz OS — Agentic Layer

## Draftable Actions (low risk — auto)
- **Classify message intent** — auto-tag intent + confidence on every incoming message. Logged.
- **Generate suggested reply** — draft reply using verified catalog data, never sent. Logged.
- **Draft order from conversation** — pre-fill order form with matched product + customer. Stays as draft. Logged.
- **Generate content caption** — AI caption suggestion (EN/BN/Banglish). Draft only. Logged.
- **Tag customer** — auto-assign tags (e.g. "repeat_buyer", "high_value") based on order history. Logged.

## Executable-After-Approval Actions (medium risk — one click)
- **Confirm order** — agent clicks Confirm → status changes, stock decrements, revenue updates. Requires human click. Logged with actor.
- **Assign conversation** — route to specific agent. Logged.
- **Schedule content post** — set publish time. Logged.
- **Update order status** — ship/deliver transitions. Logged.

## Human-Only Actions (high/critical risk — never automated)
- **Send message to customer** — agent must type or approve every outbound message. AI never auto-sends.
- **Refund or cancel order** — human-only, requires reason. Logged.
- **Delete product or customer** — human-only. Soft-delete only. Logged.
- **Adjust stock manually** — human-only (AI can suggest reorder). Logged.

## Named Tools
AI may only invoke these approved tools (never raw execution):
- `lookup_product(query)` → returns matching product(s) with price/stock
- `classify_intent(message)` → returns intent + confidence
- `draft_reply(context)` → returns suggested text (never sends)
- `draft_order(conversation_id)` → returns pre-filled order object (never commits)
- `generate_caption(product_id, language)` → returns caption text

## Audit Log Fields (per agentic action)
- actor: 'ai' | agent_name | 'system'
- action: e.g. 'ai.reply_suggested', 'order.confirmed'
- entity_type + entity_id
- metadata: { confidence, source, approved_by }
- created_at

## v1 vs Later
**v1:** Classify, suggest reply, draft order, draft caption — all low-risk, all logged, all require human to act on the suggestion. No auto-send, no auto-confirm.
**Later:** Auto-reply with confidence threshold > 0.9 (still logged + reversible), auto-assign conversations by rule, automation engine triggers.
