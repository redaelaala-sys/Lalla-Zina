"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SortBar({ resultsCount }: { resultsCount: number }) {
  const t = useTranslations("shop");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "new";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-charcoal/60">{t("resultsCount", { count: resultsCount })}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-charcoal/60">{t("sortBy")}</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-beige-dark/60 rounded-full px-4 py-2 text-sm bg-white"
        >
          <option value="new">{t("sortNew")}</option>
          <option value="best">{t("sortBest")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
          <option value="promo">{t("sortPromo")}</option>
        </select>
      </div>
    </div>
  );
}
