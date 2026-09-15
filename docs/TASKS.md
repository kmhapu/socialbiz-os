# SocialBiz OS — Tasks & Sprints

## Sprint 1: Core Engine — Catalog + Orders
**Goal:** Product catalog CRUD + order creation/confirmation working end-to-end against the DB.
- [ ] Set up Next.js + Supabase + Tailwind/shadcn project
- [ ] Create migration (all v1 tables + seed data)
- [ ] `lib/data/` layer: products, orders, order_items, audit_logs
- [ ] `lib/actions/`: createProduct, updateProduct, createOrder, confirmOrder, adjustStock
- [ ] Products page: list (loading/empty/error/ready), create/edit form, stock display
- [ ] Orders page: list, create form (select product, qty, customer name), confirm button
- [ ] Stock decrements on order confirm; audit log written
- [ ] Dashboard: revenue + order count from real DB data
- **DoD:** Create a product, create an order with that product, click Confirm, see stock drop and dashboard revenue update. Works without login.

## Sprint 2: Inbox + Conversations + AI Intent
**Goal:** Unified inbox with AI intent classification and suggested replies.
- [ ] `lib/data/`: conversations, messages, customers
- [ ] `lib/ai/`: intent classifier (rule-based), reply suggester (catalog lookup)
- [ ] Inbox: conversation list (filter by status/intent), message thread view
- [ ] Manual message entry (simulated FB message)
- [ ] Auto-classify intent on save + show confidence + source
- [ ] AI suggested reply using real product data — shown as draft, not sent
- [ ] Customer auto-created from conversation
- [ ] "Create Order" button from conversation → pre-fills customer + product match
- **DoD:** Paste a message "red saree price?", see intent tag + suggested reply with real price/stock, click Create Order, confirm it. No login required.

## Sprint 3: Content Studio + AI Captions
**Goal:** Content creation + scheduling with AI caption assistant.
- [ ] `lib/data/` + `lib/ai/`: content_posts, caption generator
- [ ] Content page: create post (caption, media URL), schedule, status workflow
- [ ] AI caption suggestion (EN/BN/Banglish) from product context — draft, editable
- [ ] Content calendar list view (draft/scheduled/published)
- **DoD:** Create a content post, generate an AI caption, edit it, schedule it. Caption has source+confidence+review_status.

## Sprint 4: CRM + Dashboard Polish
**Goal:** Customer 360 + analytics dashboard.
- [ ] Customers page: list, profile (tags, order history, LTV computed from orders)
- [ ] Dashboard: revenue, orders, top products, top customers — date filter
- [ ] All pages handle empty/loading/error/partial states
- [ ] Audit log viewer in Settings
- **DoD:** View a customer profile showing their orders and computed LTV. Dashboard shows real metrics. **v1 FUNCTIONAL MILESTONE — success scenario fully usable.**

## Sprint 5: Lock It Down — Auth + RLS
**Goal:** Per-user auth and owner-scoped data isolation.
- [ ] Supabase Auth: signup, login, session
- [ ] Replace permissive RLS with `auth.uid() = user_id` policies on all tables
- [ ] Login/signup pages; redirect unauthenticated users from workspace
- [ ] Seed demo data tagged with a demo user_id
- [ ] Test: user A cannot see user B's data
- **DoD:** Two logged-in users see only their own products/orders/conversations. Anonymous users see login page.

## Simple Gantt
```
Sprint 1  | catalog + orders + dashboard shell
Sprint 2  | inbox + AI intent + conversation→order
Sprint 3  | content studio + AI captions
Sprint 4  | CRM + dashboard polish ← v1 FUNCTIONAL
Sprint 5  | auth + RLS lock-down
```
