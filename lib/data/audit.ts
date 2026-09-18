import { createClient } from "@/lib/supabase/server";

export async function getAuditLogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
  return data;
}