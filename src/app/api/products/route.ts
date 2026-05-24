import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase admin credentials" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,image_path")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase admin credentials" }, { status: 500 });
  }

  const { name, description, price, image_path } = body;

  const { data, error } = await supabase.from("products").insert([
    {
      name,
      description: description ?? null,
      price: Number(price),
      image_path: image_path ?? null,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0] ?? null);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase admin credentials" }, { status: 500 });
  }

  const { id, name, description, price, image_path } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description: description ?? null,
      price: Number(price),
      image_path: image_path ?? null,
    })
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0] ?? null);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase admin credentials" }, { status: 500 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const { error } = await supabase.from("products").delete().eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
