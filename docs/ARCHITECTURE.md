# SocialBiz OS — Architecture

## Stack
Next.js 15 (App Router) + Supabase (Postgres + RLS) + Vercel. Tailwind + shadcn/ui.

## Build Now vs Later
**Now (v1):** Catalog CRUD, inbox (manual message entry + AI classify), orders (create→confirm→ship), customer profiles, content scheduler, dashboard, audit log.
**Later:** Real FB OAuth/webhooks, courier/payment integrations, ad workspace, automation engine, RBAC UI, billing, WhatsApp/IG.

## Key User Action Flow (conversation → confirmed order)
1. Agent opens a conversation thread (seeded or manually created)
2. Messages auto-classify intent (price/stock/order/general) with confidence + source
3. AI suggests a reply using real product data (price, stock from catalog)
4. Agent sends reply (manual send in v1; logged)
5. Agent clicks "Create Order" → pre-fills customer + conversation context
6. Adds line items (product lookup), confirms totals
7. Order saved as New → agent marks Confirmed
8. Stock decrements, revenue updates on dashboard, audit log written

## Responsive Nav Shell
Persistent left sidebar (desktop): Dashboard, Inbox, Orders, Products, Customers, Content, Settings. Collapses to hamburger on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** (`lib/data/`): all DB reads/writes — products, orders, conversations, customers, content, audit. Single source of truth.
2. **App logic** (`lib/actions/`): server actions for order creation, confirmation, stock adjustment, content scheduling.
3. **Intelligence** (`lib/ai/`): message intent classifier, suggested reply generator, caption assistant. Isolated; core works without it.

## Why Core Works Without AI
Every action (create product, create order, confirm, ship, view dashboard) is a direct DB operation. AI only adds: intent tags, suggested replies, caption drafts. If AI is off, agent manually classifies and types replies — the order workflow is unchanged.

## Repo Structure
```
lib/data/          # all DB queries (products, orders, conversations, customers, content, audit)
lib/actions/       # server actions (createOrder, confirmOrder, schedulePost, adjustStock)
lib/ai/            # intent classification, reply suggestion, caption assistant
app/(dashboard)/   # route groups per feature
  inbox/
  orders/
  products/
  customers/
  content/
  dashboard/
components/         # shared UI (shadcn-based)
__tests__/          # test files beside feature logic
```

## Module Map
| Module | Responsibility | Data Owned | Build Order |
|--------|---------------|------------|-------------|
| catalog | Product CRUD, variants, stock | products | 1st |
| inbox | Conversation list, messages, intent, reply suggestion | conversations, messages | 2nd |
| orders | Order creation, confirmation, fulfillment states, stock decrement | orders, order_items | 3rd (core engine) |
| crm | Customer profiles from conversations, tags, LTV | customers | 4th |
| content | Post creation, scheduling, AI captions | content_posts | 5th |
| analytics | Dashboard metrics, revenue attribution | (reads orders, products) | 6th |
| platform | Audit logging, tenant settings, app config | audit_logs, tenants | woven throughout |
