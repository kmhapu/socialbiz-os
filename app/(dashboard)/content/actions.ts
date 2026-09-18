"use server";

import { generateCaption } from "@/lib/ai";
import { createContentPost } from "@/lib/data/content";
import { revalidatePath } from "next/cache";

export async function generateAiCaptionAction(productContext: string, language: 'en' | 'bn' | 'banglish') {
  return await generateCaption(productContext, language);
}

export async function createPostAction(formData: FormData) {
  const caption = formData.get("caption") as string;
  const mediaUrl = formData.get("mediaUrl") as string;
  const status = formData.get("status") as string;
  
  await createContentPost({
    caption,
    media_urls: mediaUrl ? [mediaUrl] : [],
    status,
    tenant_id: "a0000000-0000-0000-0000-000000000001", // Default demo tenant
  });
  
  revalidatePath("/content");
}
