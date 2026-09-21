"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["Nouvelle", "Confirmée", "En préparation", "Expédiée", "Livrée", "Annulée", "Retour"];

const COLORS: Record<string, string> = {
  Nouvelle: "bg-blue-100 text-blue-700",
  Confirmée: "bg-indigo-100 text-indigo-700",
  "En préparation": "bg-amber-100 text-amber-700",
  Expédiée: "bg-purple-100 text-purple-700",
  Livrée: "bg-green-100 text-green-700",
  Annulée: "bg-red-100 text-red-700",
  Retour: "bg-orange-100 text-orange-700",
};

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  async function onChange(value: string) {
    setLoading(true);
    setCurrent(value);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={current}
      disabled={loading}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-medium rounded-full px-3 py-1.5 border-none ${COLORS[current] || "bg-gray-100"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
