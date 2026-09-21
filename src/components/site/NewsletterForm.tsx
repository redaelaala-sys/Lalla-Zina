"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function NewsletterForm() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // ignore network errors in demo
    }
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return <p className="text-white font-medium">{t("newsletterSuccess")}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletterPlaceholder")}
        className="flex-1 rounded-full px-5 py-3 text-sm text-charcoal focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-charcoal font-semibold rounded-full px-6 py-3 text-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {t("newsletterCta")}
      </button>
    </form>
  );
}
