"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

type Category = { slug: string; nameFr: string; nameAr: string };

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { key: "Noir", fr: "Noir", hex: "#1a1a1a" },
  { key: "Blanc", fr: "Blanc", hex: "#ffffff" },
  { key: "Beige", fr: "Beige", hex: "#e8dcc8" },
  { key: "Marron", fr: "Marron", hex: "#6b4a35" },
  { key: "Gris", fr: "Gris", hex: "#9a9a9a" },
  { key: "Bleu", fr: "Bleu", hex: "#3a5a8c" },
  { key: "Rouge", fr: "Rouge", hex: "#b23a3a" },
  { key: "Rose", fr: "Rose", hex: "#d9a9a0" },
  { key: "Vert", fr: "Vert", hex: "#4a6b4a" },
];
const PRICE_RANGES = [
  { key: "under200", labelKey: "priceUnder200" as const },
  { key: "200to300", labelKey: "price200to300" as const },
  { key: "300to500", labelKey: "price300to500" as const },
  { key: "500to800", labelKey: "price500to800" as const },
  { key: "over800", labelKey: "priceOver800" as const },
];

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const sizes = searchParams.getAll("size");
  const colors = searchParams.getAll("color");
  const priceRange = searchParams.get("price") || "";
  const availability = searchParams.get("availability") || "";
  const onSale = searchParams.get("sale") === "1";

  function update(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleMulti(key: string, value: string) {
    update((params) => {
      const values = params.getAll(key);
      params.delete(key);
      if (values.includes(value)) {
        values.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        [...values, value].forEach((v) => params.append(key, v));
      }
    });
  }

  function setSingle(key: string, value: string) {
    update((params) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
  }

  function reset() {
    router.push(pathname);
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden w-full flex items-center justify-between border border-beige-dark/60 rounded-full px-5 py-2.5 text-sm font-medium mb-4"
      >
        {t("filters")} <span>{open ? "−" : "+"}</span>
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block space-y-8`}>
        <div>
          <h3 className="font-semibold text-sm mb-3">{t("category")}</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <button
                  onClick={() => setSingle("category", category === c.slug ? "" : c.slug)}
                  className={`${category === c.slug ? "text-rose-dark font-semibold" : "text-charcoal/70"} hover:text-rose-dark transition`}
                >
                  {locale === "ar" ? c.nameAr : c.nameFr}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">{t("size")}</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => toggleMulti("size", s)}
                className={`h-9 min-w-9 px-2 rounded-md border text-xs font-medium transition ${
                  sizes.includes(s)
                    ? "bg-charcoal text-white border-charcoal"
                    : "border-beige-dark/60 hover:border-charcoal"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">{t("color")}</h3>
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c.key}
                title={c.fr}
                onClick={() => toggleMulti("color", c.key)}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  colors.includes(c.key) ? "border-rose-dark scale-110" : "border-white"
                }`}
                style={{ backgroundColor: c.hex, boxShadow: "0 0 0 1px #d9c9a8" }}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">{t("price")}</h3>
          <ul className="space-y-2 text-sm">
            {PRICE_RANGES.map((r) => (
              <li key={r.key}>
                <button
                  onClick={() => setSingle("price", priceRange === r.key ? "" : r.key)}
                  className={`${priceRange === r.key ? "text-rose-dark font-semibold" : "text-charcoal/70"} hover:text-rose-dark transition`}
                >
                  {t(r.labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">{t("availability")}</h3>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={availability === "in"}
                onChange={() => setSingle("availability", availability === "in" ? "" : "in")}
              />
              {t("inStock")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onSale}
                onChange={() => setSingle("sale", onSale ? "" : "1")}
              />
              {t("onSale")}
            </label>
          </div>
        </div>

        <button onClick={reset} className="text-sm underline text-charcoal/60 hover:text-charcoal">
          {t("resetFilters")}
        </button>
      </div>
    </div>
  );
}
