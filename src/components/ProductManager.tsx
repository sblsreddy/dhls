"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_path: string | null;
};

const defaultForm = {
  name: "",
  description: "",
  price: 0,
  image_path: "",
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = useMemo(() => selectedProductId !== null, [selectedProductId]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch("/api/products");
    const data = await response.json();

    if (response.ok) {
      setProducts(data);
      setError(null);
    } else {
      setError(data.error ?? "Unable to load products");
    }
  }

  function resetForm() {
    setForm({ ...defaultForm });
    setSelectedProductId(null);
    setError(null);
  }

  function fillForm(product: Product) {
    setSelectedProductId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      image_path: product.image_path ?? "",
    });
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      image_path: form.image_path || null,
    };

    const method = isEditing ? "PUT" : "POST";
    const body = isEditing ? { id: selectedProductId, ...payload } : payload;

    const response = await fetch("/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save product");
      setLoading(false);
      return;
    }

    await fetchProducts();
    resetForm();
    setLoading(false);
  }

  async function handleDelete(productId: number) {
    if (!confirm("Delete this product?")) {
      return;
    }

    setLoading(true);
    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to delete product");
      setLoading(false);
      return;
    }

    await fetchProducts();
    resetForm();
    setLoading(false);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Product manager</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Manage catalog entries</h2>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-950 transition hover:bg-slate-100"
          >
            New product
          </button>
        </div>

        {error ? <p className="mt-4 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Price (cents)</label>
              <input
                type="number"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Image path</label>
              <input
                value={form.image_path ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, image_path: event.target.value }))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
                placeholder="products/example.png"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving…" : isEditing ? "Update product" : "Create product"}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Product catalog</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Existing products</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {products.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">No products available yet. Add one using the form.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-600">${(product.price / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fillForm(product)}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{product.description ?? "No description provided."}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">Image: {product.image_path ?? "none"}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
