"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur de connexion");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl text-center mb-2">LallaZina</h1>
        <p className="text-center text-sm text-charcoal/50 mb-8">Espace administration</p>
        <form onSubmit={onSubmit} className="space-y-4 bg-white border border-beige-dark/40 rounded-xl p-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-white rounded-full py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
