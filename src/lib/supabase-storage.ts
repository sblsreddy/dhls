import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export function getProductImageUrl(imagePath: string | null) {
  if (!imagePath) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(imagePath);
  return data?.publicUrl ?? null;
}
