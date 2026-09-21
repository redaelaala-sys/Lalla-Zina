"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";
import ImageUploadField from "./ImageUploadField";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateCity(city: string, fee: number) {
    set("deliveryFees", { ...form.deliveryFees, [city]: fee });
  }
  function removeCity(city: string) {
    const next = { ...form.deliveryFees };
    delete next[city];
    set("deliveryFees", next as typeof form.deliveryFees);
  }
  function addCity() {
    const city = prompt("Nom de la ville :");
    if (!city) return;
    set("deliveryFees", { ...form.deliveryFees, [city]: 35 });
  }

  function updateSizeRow(idx: number, field: "bust" | "waist" | "hips", value: string) {
    set(
      "sizeGuide",
      form.sizeGuide.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10 max-w-3xl">
      <section>
        <h2 className="font-semibold text-lg mb-4">Apparence de la page d'accueil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploadField
            label="Bannière principale (hero)"
            value={form.heroImage}
            onChange={(url) => set("heroImage", url)}
          />
          <ImageUploadField
            label="Bannière promotions"
            value={form.promoBannerImage}
            onChange={(url) => set("promoBannerImage", url)}
          />
          <ImageUploadField
            label="Photo page À propos"
            value={form.aboutImage}
            onChange={(url) => set("aboutImage", url)}
            aspect="aspect-[4/3]"
          />
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-4">Contact & réseaux sociaux</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="WhatsApp : numéro avec indicatif (ex: 212600000000) ou lien wa.me complet"
            value={form.whatsappNumber}
            onChange={(v) => set("whatsappNumber", v)}
          />
          <Field label="Téléphone de contact" value={form.contactPhone} onChange={(v) => set("contactPhone", v)} />
          <Field label="E-mail de contact" value={form.contactEmail} onChange={(v) => set("contactEmail", v)} />
          <Field label="Adresse de la boutique" value={form.storeAddress} onChange={(v) => set("storeAddress", v)} />
          <Field label="Lien Instagram" value={form.instagramUrl} onChange={(v) => set("instagramUrl", v)} />
          <Field label="Lien Facebook" value={form.facebookUrl} onChange={(v) => set("facebookUrl", v)} />
          <Field label="Lien TikTok" value={form.tiktokUrl} onChange={(v) => set("tiktokUrl", v)} />
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-4">Livraison</h2>
        <Field
          label="Seuil de livraison gratuite (DH)"
          type="number"
          value={String(form.freeShippingThreshold)}
          onChange={(v) => set("freeShippingThreshold", Number(v) || 0)}
        />
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Frais de livraison par ville (DH)</label>
            <button type="button" onClick={addCity} className="text-xs underline text-rose-dark">
              + Ajouter une ville
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(form.deliveryFees).map(([city, fee]) => (
              <div key={city} className="flex items-center gap-2">
                <span className="text-sm w-40">{city === "_default" ? "Autres villes" : city}</span>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => updateCity(city, Number(e.target.value) || 0)}
                  className="border border-beige-dark/60 rounded-lg px-3 py-1.5 text-sm w-24"
                />
                {city !== "_default" && (
                  <button type="button" onClick={() => removeCity(city)} className="text-xs text-red-600 underline">
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-4">Guide des tailles (mesures en cm)</h2>
        <div className="space-y-2">
          {form.sizeGuide.map((row, idx) => (
            <div key={row.size} className="flex items-center gap-2">
              <span className="text-sm w-12 font-medium">{row.size}</span>
              <input
                value={row.bust}
                onChange={(e) => updateSizeRow(idx, "bust", e.target.value)}
                placeholder="Poitrine"
                className="border border-beige-dark/60 rounded-lg px-3 py-1.5 text-sm w-28"
              />
              <input
                value={row.waist}
                onChange={(e) => updateSizeRow(idx, "waist", e.target.value)}
                placeholder="Taille"
                className="border border-beige-dark/60 rounded-lg px-3 py-1.5 text-sm w-28"
              />
              <input
                value={row.hips}
                onChange={(e) => updateSizeRow(idx, "hips", e.target.value)}
                placeholder="Hanches"
                className="border border-beige-dark/60 rounded-lg px-3 py-1.5 text-sm w-28"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-4">Politique de retours & échanges</h2>
        <TextArea label="Texte (français)" value={form.returnPolicyTextFr} onChange={(v) => set("returnPolicyTextFr", v)} />
        <TextArea label="Texte (arabe)" value={form.returnPolicyTextAr} onChange={(v) => set("returnPolicyTextAr", v)} dir="rtl" />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">Paramètres enregistrés avec succès.</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-charcoal text-white rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
      />
    </div>
  );
}

function TextArea({
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
    <div className="mb-4">
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
