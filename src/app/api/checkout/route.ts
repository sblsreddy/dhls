import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export async function POST(request: Request) {
  const body = await request.json();
  const stripe = createStripeClient();
  let lineItems;

  if (body.productId) {
    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Missing Supabase admin credentials" }, { status: 500 });
    }

    const { data: product, error } = await supabase
      .from("products")
      .select("name,description,price")
      .eq("id", Number(body.productId))
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description ?? "",
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ];
  } else {
    lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "DHLS Starter Product",
            description: "Example item for Stripe Checkout",
          },
          unit_amount: 4999,
        },
        quantity: 1,
      },
    ];
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe error" },
      { status: 500 }
    );
  }
}
