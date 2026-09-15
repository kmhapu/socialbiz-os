# SocialBiz OS — Test Plan

## v1 Success Scenario (manual)
1. Open app without login → dashboard renders with seeded revenue/orders
2. Go to Products → see 5 seeded products with stock
3. Click "New Product" → fill name, SKU, price, stock → save → appears in list
4. Go to Inbox → see seeded conversations
5. Click a conversation → see messages with intent tags + confidence
6. Type a new message: "red saree ta koto taka?" → save
7. See intent: price_inquiry (confidence shown), suggested reply with real price + stock
8. Click "Create Order" from conversation → form pre-fills customer + product
9. Set quantity 1 → save order → status: New
10. Click "Confirm" → status: Confirmed, stock decremented, audit logged
11. Go to Dashboard → revenue updated, order count updated
12. Go to Customers → see the customer with order in history, LTV updated
13. Go to Content → create post, click "Generate Caption" → AI caption appears with confidence → edit → schedule

## Empty State Tests
- Delete all orders → Orders page shows "No orders yet. Create one from the inbox."
- No conversations → Inbox shows "No conversations. Start by creating one."
- No products → Products page shows "No products yet. Add your first product."
- Dashboard with zero orders → shows ৳0 revenue, empty charts, helpful message

## Error State Tests
- Network failure on form submit → error toast, form retains input, no data loss
- Invalid quantity (negative/zero) → form validation blocks submit, inline error
- Duplicate SKU → DB constraint blocks, UI shows "SKU already exists"
- AI service unavailable → suggested reply area shows "Suggestion unavailable — type your reply." Order/inbox still fully functional.

## Loading State Tests
- Product list shows skeleton cards while fetching
- Order list shows skeleton rows
- Conversation thread shows shimmer placeholders

## Permission Tests (post lock-down)
- User A logs in, creates products → logs out
- User B logs in → does not see User A's products
- Anonymous visit → redirected to login (not the workspace)

## Audit Log Tests
- Confirm an order → audit_logs row with action='order.confirmed', actor, entity_id
- AI suggests reply → audit_logs row with action='ai.reply_suggested', confidence in metadata
- Delete is never available as an action for AI; only human can soft-delete a product (logged)
