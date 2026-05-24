import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_path: string | null;
};

export async function getProducts(): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,image_path")
    .order("id", { ascending: true });

  if (error) {
    console.warn("Unable to load products:", error.message);
    return [];
  }

  return (data as Product[]) ?? [];
}
