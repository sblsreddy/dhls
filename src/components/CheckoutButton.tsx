"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  productId?: number;
  label?: string;
};

export default function CheckoutButton({ productId, label }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to create checkout session");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Starting checkout…" : label ?? "Checkout with Stripe"}
      </button>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
