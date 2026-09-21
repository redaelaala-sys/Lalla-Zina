"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { getDeliveryFee } from "@/lib/delivery";
import type { SiteSettings } from "@/lib/settings";

export default function CheckoutClient({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    whatsapp: "",
    city: "",
    address: "",
    neighborhood: "",
    postalCode: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = useMemo(
    () => Object.keys(settings.deliveryFees).filter((k) => k !== "_default"),
    [settings.deliveryFees]
  );

  const shippingFee = form.city
    ? getDeliveryFee(settings.deliveryFees, form.city, subtotal, settings.freeShippingThreshold)
    : null;
  const total = subtotal + (shippingFee ?? 0);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!form.customerName || !form.phone || !form.city || !form.address) {
      setError(t("required"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size,
            color: i.color,
            qty: i.qty,
            price: i.price,
          })),
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      clear();
      router.push(`/commande-confirmee?order=${data.orderNumber}`);
    } catch {
      setError(t("required"));
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-charcoal/60">{t("title")}</p>
      </div>
    );
  }

  return (
    <div className="container-site py-10">
      <h1 className="font-heading text-3xl md:text-4xl mb-10">{t("title")}</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-5">
          <h2 className="font-semibold text-lg">{t("customerInfo")}</h2>
          <Field label={t("fullName")} value={form.customerName} onChange={(v) => update("customerName", v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("phone")} value={form.phone} onChange={(v) => update("phone", v)} required type="tel" />
            <Field label={t("whatsapp")} value={form.whatsapp} onChange={(v) => update("whatsapp", v)} type="tel" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("city")}</label>
            <select
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              required
              className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm bg-white"
            >
              <option value="">{t("selectCity")}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Autre">Autre ville</option>
            </select>
          </div>

          <Field label={t("address")} value={form.address} onChange={(v) => update("address", v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("neighborhood")} value={form.neighborhood} onChange={(v) => update("neighborhood", v)} />
            <Field label={t("postalCode")} value={form.postalCode} onChange={(v) => update("postalCode", v)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("notes")}</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-3">{t("paymentMethod")}</h2>
            <div className="border border-beige-dark/60 rounded-lg p-4 flex items-center gap-3">
              <input type="radio" checked readOnly />
              <span className="text-sm font-medium">{t("cod")}</span>
            </div>
            <p className="text-xs text-charcoal/50 mt-2">{t("codOnly")}</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="bg-beige/40 rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">{t("orderSummary")}</h2>
          <div className="space-y-2 mb-4 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="text-charcoal/70">
                  {i.name} ({i.size}, {i.color}) x{i.qty}
                </span>
                <span className="font-medium">{i.price * i.qty} DH</span>
              </div>
            ))}
          </div>
          <div className="border-t border-beige-dark/50 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/60">Sous-total</span>
              <span>{subtotal} DH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/60">Livraison</span>
              <span>{shippingFee === null ? "—" : shippingFee === 0 ? "Gratuite" : `${shippingFee} DH`}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t border-beige-dark/50 pt-3">
              <span>{t("amountDue")}</span>
              <span>{total} DH</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-charcoal text-white rounded-full py-3.5 text-sm font-semibold hover:bg-charcoal/90 transition disabled:opacity-60"
          >
            {loading ? "..." : t("confirm")}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose"
      />
    </div>
  );
}
