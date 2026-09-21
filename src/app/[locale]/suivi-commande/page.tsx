"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type OrderResult = {
  orderNumber: string;
  status: string;
  total: number;
  city: string;
  createdAt: string;
  items: { name: string; size: string; color: string; qty: number }[];
};

export default function OrderTrackingPage() {
  const th = useTranslations("header");
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`
      );
      if (!res.ok) {
        setError("Commande introuvable. Vérifiez votre numéro de commande et de téléphone.");
        return;
      }
      setResult(await res.json());
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-site py-14 max-w-lg mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-8 text-center">{th("account")}</h1>
      <form onSubmit={onSubmit} className="space-y-4 mb-10">
        <input
          required
          placeholder="Numéro de commande (ex: LZ2609-1234)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
        />
        <input
          required
          type="tel"
          placeholder="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-charcoal text-white rounded-full py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "..." : "Suivre ma commande"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {result && (
        <div className="bg-beige/40 rounded-xl p-6 text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-charcoal/60">Commande</span>
            <span className="font-semibold">{result.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/60">Statut</span>
            <span className="font-semibold text-rose-dark">{result.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/60">Ville</span>
            <span>{result.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/60">Total</span>
            <span className="font-semibold">{result.total} DH</span>
          </div>
          <div className="border-t border-beige-dark/50 pt-3">
            {result.items.map((i, idx) => (
              <p key={idx} className="text-charcoal/70">
                {i.name} ({i.size}, {i.color}) x{i.qty}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
