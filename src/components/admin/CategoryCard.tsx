"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

type Category = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  image: string;
};

export default function CategoryCard({ category }: { category: Category }) {
  const [nameFr, setNameFr] = useState(category.nameFr);
  const [nameAr, setNameAr] = useState(category.nameAr);
  const [image, setImage] = useState(category.image);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameFr, nameAr, image }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-beige-dark/30 rounded-xl p-5">
      <p className="text-xs text-charcoal/40 mb-3">/{category.slug}</p>
      <ImageUploadField label="Photo de la catégorie" value={image} onChange={setImage} aspect="aspect-[4/5]" />
      <div className="grid grid-cols-1 gap-3 mt-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Nom (français)</label>
          <input
            value={nameFr}
            onChange={(e) => setNameFr(e.target.value)}
            className="w-full border border-beige-dark/60 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Nom (arabe)</label>
          <input
            dir="rtl"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full border border-beige-dark/60 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      <button
        onClick={onSave}
        disabled={saving}
        className="mt-4 bg-charcoal text-white rounded-full px-5 py-2 text-xs font-semibold disabled:opacity-60"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
      {saved && <span className="ms-3 text-xs text-green-700">Enregistré !</span>}
    </div>
  );
}
