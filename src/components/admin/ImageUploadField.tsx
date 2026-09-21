"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUploadField({
  label,
  value,
  onChange,
  aspect = "aspect-video",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <div className={`relative ${aspect} w-full max-w-sm rounded-lg overflow-hidden border border-beige-dark/40 bg-beige mb-2`}>
        {value && <Image src={value} alt={label} fill className="object-cover" />}
      </div>
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} disabled={uploading} />
      {uploading && <p className="text-xs text-charcoal/50 mt-1">Envoi en cours...</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
