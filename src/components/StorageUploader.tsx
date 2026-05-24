"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-client";

export default function StorageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = getSupabaseBrowser();

  async function handleUpload() {
    if (!file) {
      setStatus("Please choose a file to upload.");
      return;
    }

    if (!supabase) {
      setStatus("Missing Supabase browser configuration.");
      return;
    }

    setUploading(true);
    setStatus(null);
    setUrl(null);

    const filePath = `products/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setStatus(error.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setUrl(publicUrlData.publicUrl ?? null);
    setStatus("Upload complete.");
    setUploading(false);
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Upload product image</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Upload a file to the `product-images` Supabase storage bucket and use the returned public URL for product assets.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="rounded-xl border border-slate-300 px-4 py-2"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {status ? <p className="text-sm text-slate-700">{status}</p> : null}
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-950 underline">
            View uploaded image
          </a>
        ) : null}
      </div>
    </div>
  );
}
