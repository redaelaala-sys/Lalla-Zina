"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { buildWhatsAppLink, fillTemplate } from "@/lib/whatsapp";
import SizeGuideModal from "./SizeGuideModal";

type Variant = { size: string; color: string; stock: number };

export default function AddToCartPanel({
  productId,
  slug,
  sku,
  nameFr,
  nameAr,
  price,
  image,
  variants,
  whatsappNumber,
  sizeGuide,
}: {
  productId: string;
  slug: string;
  sku: string;
  nameFr: string;
  nameAr: string;
  price: number;
  image: string;
  variants: Variant[];
  whatsappNumber: string;
  sizeGuide: { size: string; bust: string; waist: string; hips: string }[];
}) {
  const t = useTranslations("product");
  const tw = useTranslations("whatsappMessages");
  const locale = useLocale();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const name = locale === "ar" ? nameAr : nameFr;

  const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size))), [variants]);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const colorsForSize = useMemo(
    () => Array.from(new Set(variants.filter((v) => !size || v.size === size).map((v) => v.color))),
    [variants, size]
  );

  const selectedVariant = variants.find((v) => v.size === size && v.color === color);
  const outOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  function handleAdd() {
    if (!size) {
      setError(t("sizeRequired"));
      return;
    }
    if (!color) {
      setError(t("colorRequired"));
      return;
    }
    setError("");
    addItem(
      { productId, slug, sku, name, image, size, color, price },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWhatsAppOrder() {
    if (!size || !color) {
      setError(!size ? t("sizeRequired") : t("colorRequired"));
      return;
    }
    const message = fillTemplate(tw("productOrder"), {
      product: name,
      ref: sku,
      size,
      color,
      price,
    });
    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank");
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold">{t("selectSize")}</label>
          <button
            onClick={() => setGuideOpen(true)}
            className="text-xs underline text-charcoal/60 hover:text-rose-dark"
          >
            {t("sizeGuide")}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setColor("");
                setError("");
              }}
              className={`h-10 min-w-10 px-3 rounded-md border text-sm font-medium transition ${
                size === s ? "bg-charcoal text-white border-charcoal" : "border-beige-dark/60 hover:border-charcoal"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">{t("selectColor")}</label>
        <div className="flex flex-wrap gap-2">
          {colorsForSize.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setError("");
              }}
              className={`px-4 h-10 rounded-md border text-sm font-medium transition ${
                color === c ? "bg-charcoal text-white border-charcoal" : "border-beige-dark/60 hover:border-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold">{t("quantity")}</label>
        <div className="flex items-center border border-beige-dark/60 rounded-full">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 text-lg">
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 text-lg">
            +
          </button>
        </div>
        {selectedVariant && (
          <span className={`text-xs ${outOfStock ? "text-red-600" : "text-green-700"}`}>
            {outOfStock ? t("outOfStock") : t("inStock")}
          </span>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 bg-charcoal text-white rounded-full py-3.5 text-sm font-semibold hover:bg-charcoal/90 transition disabled:opacity-50"
        >
          {added ? t("addedToCart") : t("addToCart")}
        </button>
        <button
          onClick={handleWhatsAppOrder}
          className="flex-1 bg-[#25D366] text-white rounded-full py-3.5 text-sm font-semibold hover:opacity-90 transition"
        >
          {t("orderWhatsapp")}
        </button>
      </div>

      {added && (
        <button
          onClick={() => router.push("/panier")}
          className="text-sm underline text-rose-dark"
        >
          {t("buyNow")} →
        </button>
      )}

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} sizeGuide={sizeGuide} />
    </div>
  );
}
