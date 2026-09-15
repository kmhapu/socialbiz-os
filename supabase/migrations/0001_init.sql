create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Demo Workspace',
  plan text not null default 'free',
  user_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  name text not null,
  sku text not null,
  description text,
  price numeric(10,2) not null default 0,
  cost numeric(10,2) not null default 0,
  stock int not null default 0,
  variants jsonb,
  images jsonb,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  name text not null,
  fb_psid text,
  phone text,
  email text,
  address text,
  tags text[] default '{}',
  ltv numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  customer_id uuid,
  status text not null default 'open',
  assigned_to text,
  intent text,
  intent_confidence numeric,
  intent_source text,
  intent_review_status text default 'unreviewed',
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid,
  body text not null,
  sender text not null default 'customer',
  intent text,
  intent_confidence numeric,
  intent_source text,
  intent_review_status text default 'unreviewed',
  suggested_reply text,
  suggested_reply_confidence numeric,
  suggested_reply_source text,
  suggested_reply_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  customer_id uuid references customers(id),
  conversation_id uuid references conversations(id),
  status text not null default 'new',
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  user_id uuid,
  product_id uuid references products(id),
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null default 1,
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists content_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  caption text not null,
  media_urls jsonb,
  status text not null default 'draft',
  scheduled_at timestamptz,
  ai_caption text,
  ai_caption_source text,
  ai_caption_confidence numeric,
  ai_caption_review_status text default 'unreviewed',
  language text not null default 'en',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  actor text not null default 'system',
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table tenants enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table content_posts enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "tenants_v1_read" on tenants;
create policy "tenants_v1_read" on tenants for select using (true);
drop policy if exists "tenants_v1_write" on tenants;
create policy "tenants_v1_write" on tenants for all using (true) with check (true);

drop policy if exists "products_v1_read" on products;
create policy "products_v1_read" on products for select using (true);
drop policy if exists "products_v1_write" on products;
create policy "products_v1_write" on products for all using (true) with check (true);

drop policy if exists "customers_v1_read" on customers;
create policy "customers_v1_read" on customers for select using (true);
drop policy if exists "customers_v1_write" on customers;
create policy "customers_v1_write" on customers for all using (true) with check (true);

drop policy if exists "conversations_v1_read" on conversations;
create policy "conversations_v1_read" on conversations for select using (true);
drop policy if exists "conversations_v1_write" on conversations;
create policy "conversations_v1_write" on conversations for all using (true) with check (true);

drop policy if exists "messages_v1_read" on messages;
create policy "messages_v1_read" on messages for select using (true);
drop policy if exists "messages_v1_write" on messages;
create policy "messages_v1_write" on messages for all using (true) with check (true);

drop policy if exists "orders_v1_read" on orders;
create policy "orders_v1_read" on orders for select using (true);
drop policy if exists "orders_v1_write" on orders;
create policy "orders_v1_write" on orders for all using (true) with check (true);

drop policy if exists "order_items_v1_read" on order_items;
create policy "order_items_v1_read" on order_items for select using (true);
drop policy if exists "order_items_v1_write" on order_items;
create policy "order_items_v1_write" on order_items for all using (true) with check (true);

drop policy if exists "content_posts_v1_read" on content_posts;
create policy "content_posts_v1_read" on content_posts for select using (true);
drop policy if exists "content_posts_v1_write" on content_posts;
create policy "content_posts_v1_write" on content_posts for all using (true) with check (true);

drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into tenants (id, name, plan) values
  ('a0000000-0000-0000-0000-000000000001', 'Rongdhonu Fashion', 'free')
on conflict (id) do nothing;

insert into products (id, tenant_id, name, sku, description, price, cost, stock, category, variants) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Red Cotton Saree', 'RC-SAREE-001', 'Elegant red cotton saree with traditional border', 1200.00, 650.00, 8, 'Fashion', '{"color":"red","size":"free"}'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Black Abaya', 'AB-001', 'Premium black abaya, full length', 2500.00, 1400.00, 12, 'Fashion', '{"color":"black","size":"M"}'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Matte Lipstick Set', 'LIP-SET-003', 'Set of 5 matte lipsticks', 850.00, 320.00, 30, 'Cosmetics', null),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Wireless Earbuds Pro', 'EB-PRO-004', 'Bluetooth earbuds with charging case', 1800.00, 900.00, 5, 'Electronics', '{"color":"white"}'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Hijab Cap Inner', 'HC-005', 'Comfortable inner hijab cap', 150.00, 60.00, 50, 'Accessories', '{"color":"beige"}')
on conflict (id) do nothing;

insert into customers (id, tenant_id, name, phone, tags, ltv) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Fatima Khan', '01711234567', array['repeat_buyer','high_value'], 4800.00),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Rahim Ahmed', '01822987654', array['new'], 0.00),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Nusrat Jahan', '01933456789', array['repeat_buyer'], 2550.00)
on conflict (id) do nothing;

insert into conversations (id, tenant_id, customer_id, status, assigned_to, intent, intent_confidence, intent_source, intent_review_status, last_message_at) values
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'open', null, 'price_inquiry', 0.90, 'rule_classifier_v1', 'unreviewed', now() - interval '5 minutes'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'pending', 'Sales Agent', 'purchase_intent', 0.95, 'rule_classifier_v1', 'reviewed', now() - interval '1 hour'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'resolved', 'Support Agent', 'general', 0.50, 'rule_classifier_v1', 'reviewed', now() - interval '2 days')
on conflict (id) do nothing;

insert into messages (id, conversation_id, body, sender, intent, intent_confidence, intent_source, suggested_reply, suggested_reply_confidence, suggested_reply_source) values
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'red saree ta koto taka?', 'customer', 'price_inquiry', 0.90, 'rule_classifier_v1', 'Red Cotton Saree is ৳1,200 and we have 8 in stock. Would you like to order?', 0.85, 'catalog_lookup_v1'),
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'ami 2ta black abaya order korte chai', 'customer', 'purchase_intent', 0.95, 'rule_classifier_v1', 'Black Abaya is ৳2,500 each. 2 pieces = ৳5,000. Please confirm your size and delivery address.', 0.80, 'catalog_lookup_v1'),
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'Size M dile hobe, address: 123 Gulshan, Dhaka', 'customer', 'general', 0.50, 'rule_classifier_v1', null, null, null),
  ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003', 'delivery koto din lagbe?', 'customer', 'general', 0.50, 'rule_classifier_v1', 'Delivery usually takes 2-3 business days within Dhaka.', 0.70, 'rule_classifier_v1')
on conflict (id) do nothing;

insert into orders (id, tenant_id, customer_id, conversation_id, status, subtotal, discount, shipping, tax, total) values
  ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'confirmed', 5000.00, 0, 60.00, 0, 5060.00),
  ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', null, 'shipped', 1200.00, 100.00, 60.00, 0, 1160.00),
  ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', null, 'delivered', 850.00, 0, 50.00, 0, 900.00)
on conflict (id) do nothing;

insert into order_items (id, order_id, product_id, product_name, unit_price, quantity, line_total) values
  ('10000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Black Abaya', 2500.00, 2, 5000.00),
  ('10000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Red Cotton Saree', 1200.00, 1, 1200.00),
  ('10000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Matte Lipstick Set', 850.00, 1, 850.00)
on conflict (id) do nothing;

insert into content_posts (id, tenant_id, caption, status, scheduled_at, ai_caption, ai_caption_source, ai_caption_confidence, language) values
  ('11000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'নতুন কালেকশন এসেছে! 🔥 Red Cotton Saree - মাত্র ৳1,200. স্টক সীমিত। ইনবক্স করুন এখনই।', 'scheduled', now() + interval '2 days', 'নতুন কালেকশন এসেছে! Red Cotton Saree at ৳1,200. Limited stock - DM to order now!', 'catalog_caption_v1', 0.82, 'banglish'),
  ('11000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Matte Lipstick Set - 5 gorgeous shades for ৳850. Perfect for everyday wear. Order now!', 'draft', null, 'Matte Lipstick Set - 5 shades, ৳850. Long-lasting, everyday wear. DM to order!', 'catalog_caption_v1', 0.80, 'en')
on conflict (id) do nothing;

insert into audit_logs (id, actor, action, entity_type, entity_id, metadata) values
  ('12000000-0000-0000-0000-000000000001', 'system', 'order.confirmed', 'order', 'f0000000-0000-0000-0000-000000000001', '{"stock_change":"-2","product":"Black Abaya"}'),
  ('12000000-0000-0000-0000-000000000002', 'ai', 'ai.reply_suggested', 'message', 'e0000000-0000-0000-0000-000000000001', '{"intent":"price_inquiry","confidence":0.90}'),
  ('12000000-0000-0000-0000-000000000003', 'Sales Agent', 'order.created', 'order', 'f0000000-0000-0000-0000-000000000002', '{"source":"conversation","conversation_id":"d0000000-0000-0000-0000-000000000002"}')
on conflict (id) do nothing;