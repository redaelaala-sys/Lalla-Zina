"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Category = { id: string; nameFr: string };
type Variant = { size: string; color: string; stock: number };

export type ProductFormValues = {
  id?: string;
  slug: string;
  sku: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  composition: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  categoryId: string;
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  variants: Variant[];
};

const EMPTY: ProductFormValues = {
  slug: "",
  sku: "",
  nameFr: "",
  nameAr: "",
  descriptionFr: "",
  descriptionAr: "",
  composition: "",
  price: 0,
  oldPrice: null,
  images: [],
  categoryId: "",
  isNew: false,
  isFeatured: false,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  variants: [],
};

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>(initial || EMPTY);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur upload");
        set("images", [...form.images, data.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(idx: number) {
    set("images", form.images.filter((_, i) => i !== idx));
  }

  function addVariant() {
    set("variants", [...form.variants, { size: "M", color: "Noir", stock: 5 }]);
  }
  function updateVariant(idx: number, field: keyof Variant, value: string | number) {
    set(
      "variants",
      form.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  }
  function removeVariant(idx: number) {
    set("variants", form.variants.filter((_, i) => i !== idx));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.images.length === 0) {
      setError("Ajoutez au moins une photo.");
      return;
    }
    if (form.variants.length === 0) {
      setError("Ajoutez au moins une combinaison taille/couleur.");
      return;
    }
    setSaving(true);
    try {
      const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nom (français)" value={form.nameFr} onChange={(v) => set("nameFr", v)} required />
        <Field label="Nom (arabe)" value={form.nameAr} onChange={(v) => set("nameAr", v)} required dir="rtl" />
        <Field label="Slug (URL)" value={form.slug} onChange={(v) => set("slug", v)} required />
        <Field label="Référence (SKU)" value={form.sku} onChange={(v) => set("sku", v)} required />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Catégorie</label>
        <select
          required
          value={form.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
          className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm bg-white"
        >
          <option value="">Sélectionner...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameFr}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextAreaField label="Description (français)" value={form.descriptionFr} onChange={(v) => set("descriptionFr", v)} />
        <TextAreaField label="Description (arabe)" value={form.descriptionAr} onChange={(v) => set("descriptionAr", v)} dir="rtl" />
      </div>

      <Field label="Composition" value={form.composition} onChange={(v) => set("composition", v)} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Prix (DH)" type="number" value={String(form.price)} onChange={(v) => set("price", Number(v) || 0)} required />
        <Field
          label="Ancien prix / promo (DH, optionnel)"
          type="number"
          value={form.oldPrice ? String(form.oldPrice) : ""}
          onChange={(v) => set("oldPrice", v ? Number(v) : null)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Photos</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((img, idx) => (
            <div key={img + idx} className="relative w-24 h-28 rounded-lg overflow-hidden border border-beige-dark/40">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 end-1 bg-charcoal/80 text-white w-5 h-5 rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleUpload} disabled={uploading} />
        {uploading && <p className="text-xs text-charcoal/50 mt-1">Envoi en cours...</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Tailles, couleurs et stock</label>
          <button type="button" onClick={addVariant} className="text-xs underline text-rose-dark">
            + Ajouter une combinaison
          </button>
        </div>
        <div className="space-y-2">
          {form.variants.map((v, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={v.size}
                onChange={(e) => updateVariant(idx, "size", e.target.value)}
                placeholder="Taille"
                className="border border-beige-dark/60 rounded-lg px-3 py-2 text-sm w-24"
              />
              <input
                value={v.color}
                onChange={(e) => updateVariant(idx, "color", e.target.value)}
                placeholder="Couleur"
                className="border border-beige-dark/60 rounded-lg px-3 py-2 text-sm w-28"
              />
              <input
                type="number"
                min={0}
                value={v.stock}
                onChange={(e) => updateVariant(idx, "stock", Number(e.target.value) || 0)}
                placeholder="Stock"
                className="border border-beige-dark/60 rounded-lg px-3 py-2 text-sm w-24"
              />
              <button type="button" onClick={() => removeVariant(idx)} className="text-xs text-red-600 underline">
                Retirer
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)} /> Nouveauté
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /> Mise en avant (meilleure vente)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Actif (visible sur le site)
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Titre SEO (optionnel)" value={form.seoTitle} onChange={(v) => set("seoTitle", v)} />
        <Field label="Meta description SEO (optionnel)" value={form.seoDescription} onChange={(v) => set("seoDescription", v)} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-charcoal text-white rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Enregistrement..." : form.id ? "Enregistrer les modifications" : "Créer le produit"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  dir?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <input
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <textarea
        dir={dir}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
      />
    </div>
  );
}
