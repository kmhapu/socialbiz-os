"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function connectFacebookPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData?.user) {
    throw new Error("Unauthorized");
  }

  // Get tenant ID (simplified for mock purposes, assume first tenant)
  const { data: tenant } = await supabase.from("tenants").select("id").limit(1).single();
  const tenantId = tenant?.id;

  if (!tenantId) {
    throw new Error("No tenant found");
  }

  // Mock OAuth connection result
  const mockPageId = `page_${Math.floor(Math.random() * 1000000)}`;
  const mockPageName = "My Business Page";
  const mockToken = "mock_facebook_page_access_token";

  const { error } = await supabase.from("facebook_pages").insert({
    tenant_id: tenantId,
    user_id: userData.user.id,
    page_id: mockPageId,
    page_name: mockPageName,
    access_token: mockToken,
  });

  if (error) {
    console.error("Failed to insert facebook page:", error);
    throw new Error("Failed to connect Facebook page");
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function getFacebookPages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("facebook_pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch facebook pages:", error);
    return [];
  }

  return data;
}
