"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  
  const { error } = await supabase.from("products").insert([
    {
      name,
      sku,
      price: Number(price),
      stock: Number(stock),
    }
  ]);

  if (error) {
    console.error("Create product error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/products");
  return { success: true };
}

export async function editProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  
  const { error } = await supabase.from("products").update({
    name,
    sku,
    price: Number(price),
    stock: Number(stock),
  }).eq("id", id);

  if (error) {
    console.error("Edit product error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/products");
  return { success: true };
}
