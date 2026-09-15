# SocialBiz OS — Product Requirements

## Problem
Bangladeshi Facebook-first SMEs sell entirely through Messenger — fragmented chats, no structured order data, no inventory link, no revenue attribution. Owners juggle 5+ tabs, lose orders in chat, and can't answer "how much did we sell last week."

## Target User
A fashion or cosmetics SME owner running a FB Page with 500–50k messages/month. Has 1–5 agents handling chats. Wants one screen for products, conversations, orders, and revenue.

## Core Objects
- **Product**: SKU, price, cost, stock, variants, images
- **Customer**: FB identity, name, tags, order history, LTV
- **Conversation**: FB thread, status, assigned agent, intent
- **Message**: text, sender, timestamp, AI classification
- **Order**: items, totals, status (New→Confirmed→Shipped→Delivered→Refunded), customer snapshot
- **ContentPost**: caption, media, schedule, publish status, AI caption data

## MVP (v1) Checklist
- [ ] Product catalog with variants + stock (CRUD)
- [ ] Unified inbox: conversation list, message thread, assign, status filters
- [ ] AI intent classification on messages (price/stock/order/general) with confidence
- [ ] AI suggested reply using verified product data, never inventing facts
- [ ] Manual order creation from conversation context
- [ ] Order confirmation workflow (New→Confirmed→Shipped→Delivered)
- [ ] Customer profiles auto-created from conversations
- [ ] Content create + schedule (EN/BN/Banglish), AI caption assistant
- [ ] Dashboard: revenue, orders, products, top customers — date-filtered
- [ ] Audit log for all meaningful actions

## Non-Goals (v1)
- No real FB OAuth/webhook (manual paste of messages in v1; adapter stub ready)
- No live courier or payment gateway integration
- No autonomous ad management
- No WhatsApp/Instagram
- No multi-tenant billing
- No visual automation builder UI

## Success Criteria (one concrete scenario)
An owner opens the inbox, sees a message "red saree price?", the AI suggests a reply with the verified price and stock. Owner clicks "Create Order", fills 1 item × red saree, confirms. The order appears with status Confirmed, stock decrements, the dashboard revenue updates, and the audit log records every step. This works without login on first visit.
