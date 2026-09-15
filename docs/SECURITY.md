# SocialBiz OS — Security

## Secret Handling
- No secrets in frontend code, env vars, or client bundles.
- Supabase service keys server-side only (server actions / route handlers).
- AI API keys stored as server-only environment variables, never passed to client.
- FB tokens (later): encrypted at rest, stored in `tenants` table, refreshed server-side.
- `.env.local` never committed; `.env.example` documents required keys.

## Permission Model (end state after lock-down sprint)
- Every table has RLS enabled.
- Row-level: `auth.uid() = user_id` — users see only their workspace data.
- Tenant scoping: `tenant_id` matches user's tenant membership.
- Roles: Owner (all), Manager (orders, content, inbox), Agent (inbox, orders), Analyst (read-only).
- Agent inherits the logged-in user's permissions — AI can never exceed the user's role.
- v1 demo: permissive policies (open read/write) — replaced before real data.

## Approved-Tools Rule
- AI may only call named, whitelisted tools (see Agentic Layer doc).
- Never raw `run_any`, `execute_sql`, or `send_message` without human approval.
- Tool calls are logged with input, output, and confidence.
- New tools require code review + audit-log schema update.

## Audit Principle
- Every meaningful action writes to `audit_logs`: actor, action, entity, metadata, timestamp.
- Includes AI suggestions (classified, suggested) and human actions (confirmed, sent, deleted).
- Audit log is append-only — no UPDATE or DELETE on audit rows.
- Exportable for compliance review.

## Data Safety
- Soft-delete for products/customers (never hard delete in v1).
- Order status changes are forward-only except Refunded/Cancelled (human-only).
- Stock adjustments are logged with before/after values.

## Honesty Note
If real FB OAuth, payment gateway, or courier API integration is needed and cannot be validated end-to-end, STOP and get a human. v1 uses manual entry stubs precisely to avoid shipping unvalidated integrations.
