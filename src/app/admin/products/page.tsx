import Link from "next/link";
import ProductManager from "@/components/ProductManager";
import StorageUploader from "@/components/StorageUploader";

export default function AdminProductsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Product management</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Manage product records and upload images for the Supabase storage bucket. This page is intended for admin use only.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          View product catalog
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <ProductManager />
        <StorageUploader />
      </div>
    </main>
  );
}
