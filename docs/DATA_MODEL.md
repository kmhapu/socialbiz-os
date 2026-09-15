# SocialBiz OS — Data Model

## tenants
- id: uuid (pk)
- name: text
- plan: text (default 'free')
- user_id: uuid (nullable)
- created_at: timestamptz

## products
- id: uuid (pk)
- tenant_id: uuid (nullable)
- user_id: uuid (nullable)
- name: text
- sku: text
- description: text
- price: numeric(10,2)
- cost: numeric(10,2)
- stock: int (default 0)
- variants: jsonb (color/size, nullable)
- images: jsonb (array of URLs, nullable)
- category: text (nullable)
- created_at: timestamptz

## customers
- id: uuid (pk)
- tenant_id: uuid (nullable)
- user_id: uuid (nullable)
- name: text
- fb_psid: text (nullable) — Facebook sender PSID
- phone: text (nullable)
- email: text (nullable)
- address: text (nullable)
- tags: text[] (default {})
- ltv: numeric(12,2) (default 0) — computed from orders
- created_at: timestamptz

## conversations
- id: uuid (pk)
- tenant_id: uuid (nullable)
- user_id: uuid (nullable)
- customer_id: uuid (nullable → customers)
- status: text (default 'open') — open/pending/resolved
- assigned_to: text (nullable) — agent name
- intent: text (nullable) — AI-classified
- intent_confidence: numeric (nullable)
- intent_source: text (nullable) — 'ai_classifier'
- intent_review_status: text (default 'unreviewed')
- last_message_at: timestamptz
- created_at: timestamptz

## messages
- id: uuid (pk)
- conversation_id: uuid (→ conversations)
- user_id: uuid (nullable)
- body: text
- sender: text — 'customer' | 'agent' | 'ai'
- intent: text (nullable) — AI per-message intent
- intent_confidence: numeric (nullable)
- intent_source: text (nullable)
- intent_review_status: text (default 'unreviewed')
- suggested_reply: text (nullable) — AI draft
- suggested_reply_confidence: numeric (nullable)
- suggested_reply_source: text (nullable)
- suggested_reply_review_status: text (default 'unreviewed')
- created_at: timestamptz

## orders
- id: uuid (pk)
- tenant_id: uuid (nullable)
- user_id: uuid (nullable)
- customer_id: uuid (→ customers)
- conversation_id: uuid (nullable → conversations)
- status: text (default 'new') — new/confirmed/shipped/delivered/refunded/cancelled
- subtotal: numeric(12,2)
- discount: numeric(12,2) (default 0)
- shipping: numeric(12,2) (default 0)
- tax: numeric(12,2) (default 0)
- total: numeric(12,2)
- notes: text (nullable)
- created_at: timestamptz

## order_items
- id: uuid (pk)
- order_id: uuid (→ orders)
- user_id: uuid (nullable)
- product_id: uuid (→ products)
- product_name: text — snapshot
- unit_price: numeric(10,2) — snapshot
- quantity: int
- line_total: numeric(12,2)
- created_at: timestamptz

## content_posts
- id: uuid (pk)
- tenant_id: uuid (nullable)
- user_id: uuid (nullable)
- caption: text
- media_urls: jsonb (nullable)
- status: text (default 'draft') — draft/scheduled/published/failed
- scheduled_at: timestamptz (nullable)
- ai_caption: text (nullable)
- ai_caption_source: text (nullable)
- ai_caption_confidence: numeric (nullable)
- ai_caption_review_status: text (default 'unreviewed')
- language: text (default 'en') — en/bn/banglish
- created_at: timestamptz

## audit_logs
- id: uuid (pk)
- user_id: uuid (nullable)
- actor: text — 'system' | agent name
- action: text — e.g. 'order.confirmed', 'product.created', 'message.sent'
- entity_type: text
- entity_id: uuid (nullable)
- metadata: jsonb (nullable)
- created_at: timestamptz

## Relationships
- conversations.customer_id → customers.id
- messages.conversation_id → conversations.id
- orders.customer_id → customers.id
- orders.conversation_id → conversations.id
- order_items.order_id → orders.id
- order_items.product_id → products.id

## RLS / Permissions (v1)
All tables: RLS enabled, permissive v1 policies (open read/write for demo). Lock-down sprint replaces with `auth.uid() = user_id` scoping. AI fields always carry value + source + confidence + review_status.
