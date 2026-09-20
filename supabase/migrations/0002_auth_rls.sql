-- Lock down RLS for tenants, products, orders, and conversations

-- Tenants
drop policy if exists "tenants_v1_read" on tenants;
drop policy if exists "tenants_v1_write" on tenants;
create policy "tenants_auth_read" on tenants for select to authenticated using (auth.uid() = user_id);
create policy "tenants_auth_write" on tenants for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Products
drop policy if exists "products_v1_read" on products;
drop policy if exists "products_v1_write" on products;
create policy "products_auth_read" on products for select to authenticated using (auth.uid() = user_id);
create policy "products_auth_write" on products for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders
drop policy if exists "orders_v1_read" on orders;
drop policy if exists "orders_v1_write" on orders;
create policy "orders_auth_read" on orders for select to authenticated using (auth.uid() = user_id);
create policy "orders_auth_write" on orders for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Conversations
drop policy if exists "conversations_v1_read" on conversations;
drop policy if exists "conversations_v1_write" on conversations;
create policy "conversations_auth_read" on conversations for select to authenticated using (auth.uid() = user_id);
create policy "conversations_auth_write" on conversations for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
