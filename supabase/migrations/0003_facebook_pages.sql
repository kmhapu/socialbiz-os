create table if not exists facebook_pages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  page_id text not null unique,
  page_name text,
  access_token text not null,
  created_at timestamptz not null default now()
);

alter table facebook_pages enable row level security;
create policy "facebook_pages_v1_read" on facebook_pages for select using (true);
create policy "facebook_pages_v1_write" on facebook_pages for all using (true) with check (true);
