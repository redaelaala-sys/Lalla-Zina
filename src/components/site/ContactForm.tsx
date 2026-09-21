"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-green-700 bg-green-50 rounded-lg p-4 text-sm">{t("success")}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          required
          placeholder={t("formName")}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
        />
        <input
          required
          type="tel"
          placeholder={t("formPhone")}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
        />
      </div>
      <input
        type="email"
        placeholder={t("formEmail")}
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
      />
      <input
        required
        placeholder={t("formSubject")}
        value={form.subject}
        onChange={(e) => update("subject", e.target.value)}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
      />
      <textarea
        required
        rows={5}
        placeholder={t("formMessage")}
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        className="w-full border border-beige-dark/60 rounded-lg px-4 py-2.5 text-sm"
      />
      {status === "error" && <p className="text-sm text-red-600">Une erreur est survenue.</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-charcoal text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-charcoal/90 transition disabled:opacity-60"
      >
        {t("send")}
      </button>
    </form>
  );
}
