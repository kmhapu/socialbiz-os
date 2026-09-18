import { createClient } from "@/lib/supabase/server";

export async function getContentPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching content posts:", error);
    return [];
  }
  return data;
}

export async function createContentPost(post: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_posts").insert(post).select().single();
  if (error) {
    console.error("Error creating content post:", error);
    return null;
  }
  return data;
}

export async function updateContentPost(id: string, updates: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_posts").update(updates).eq("id", id).select().single();
  if (error) {
    console.error("Error updating content post:", error);
    return null;
  }
  return data;
}
