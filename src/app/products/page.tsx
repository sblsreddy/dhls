import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getProductImageUrl } from "@/lib/supabase-storage";
import CheckoutButton from "@/components/CheckoutButton";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Product catalog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Browse storefront products</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Back to home
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Manage products
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">No products are configured yet.</p>
          <p className="mt-4 text-slate-600 leading-7">
            Create a `products` table in Supabase and upload images to the `product-images` bucket to populate this catalog. See the README for sample SQL and storage setup.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => {
            const imageUrl = getProductImageUrl(product.image_path);

            return (
              <article key={product.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                {imageUrl ? (
                  <div className="relative h-64 w-full">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center bg-slate-100 text-slate-500">No image</div>
                )}
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Product</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">{product.name}</h2>
                  <p className="mt-4 text-slate-600">{product.description ?? "No description available."}</p>
                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-950">
                      <span>${(product.price / 100).toFixed(2)}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">ID {product.id}</span>
                    </div>
                    <CheckoutButton productId={product.id} label="Buy this product" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
