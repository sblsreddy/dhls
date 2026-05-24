import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AuthForm from "@/components/AuthForm";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "DHLS Shopping Cart",
  description: "Next.js shopping cart with Supabase Auth, Storage, and Stripe Checkout",
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const session = data.session;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-10 shadow-lg shadow-slate-900/5">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">DHLS</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Shopping cart starter for Next.js, Supabase, and Stripe.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              A production-ready foundation for authentication, file storage, Postgres-backed user sessions,
              and Stripe Checkout. Use this scaffold to build a full storefront on Vercel.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 px-3 py-1">Next.js</span>
              <span className="rounded-full border border-slate-200 px-3 py-1">TypeScript</span>
              <span className="rounded-full border border-slate-200 px-3 py-1">Tailwind CSS</span>
              <span className="rounded-full border border-slate-200 px-3 py-1">Supabase</span>
              <span className="rounded-full border border-slate-200 px-3 py-1">Stripe</span>
              <span className="rounded-full border border-slate-200 px-3 py-1">Storage</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            {session?.user ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Signed in</p>
                  <p className="mt-3 text-xl font-semibold text-slate-950">{session.user.email}</p>
                </div>
                <CheckoutButton />
              </div>
            ) : (
              <AuthForm />
            )}
            <div className="mt-8">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Browse product catalog
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Supabase integration</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Authentication and storage are wired with Supabase. After configuring your project, users can sign in with email and access storage-backed data through Supabase Postgres.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Stripe Checkout</h2>
          <p className="mt-4 text-slate-600 leading-7">
            A Stripe Checkout session is created on the server using a secret key. This demo shows a ready-to-use checkout flow for a sample cart item.
          </p>
        </div>
      </section>
    </main>
  );
}
