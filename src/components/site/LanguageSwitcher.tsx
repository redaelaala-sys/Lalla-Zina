"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = locale === "fr" ? "ar" : "fr";

  function switchLocale() {
    const qs = searchParams.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { locale: next });
  }

  return (
    <button
      onClick={switchLocale}
      className="text-sm font-semibold border border-beige-dark/60 rounded-full h-8 w-8 flex items-center justify-center hover:bg-beige/60 transition"
      aria-label="Changer de langue"
    >
      {next === "ar" ? "ع" : "FR"}
    </button>
  );
}
