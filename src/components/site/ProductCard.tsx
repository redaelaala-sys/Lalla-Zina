"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProductCard as ProductCardType } from "@/lib/products";

export default function ProductCard({ product }: { product: ProductCardType }) {
  const locale = useLocale();
  const t = useTranslations("product");
  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  const discount = hasPromo
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-beige">
        <Image
          src={product.images[0]}
          alt={name}
          fill
          className="object-cover brand-photo transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-charcoal text-ivory text-[11px] font-medium px-2.5 py-1 rounded-full">
              {t("new")}
            </span>
          )}
          {hasPromo && (
            <span className="bg-rose-dark text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-white/90 text-charcoal text-[11px] font-medium px-2.5 py-1 rounded-full">
              {t("outOfStock")}
            </span>
          )}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-charcoal line-clamp-1">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-rose-dark">{product.price} DH</span>
          {hasPromo && (
            <span className="text-xs text-charcoal/40 line-through">{product.oldPrice} DH</span>
          )}
        </div>
        {product.colors.length > 0 && (
          <p className="text-xs text-charcoal/50 mt-1">{product.colors.join(" · ")}</p>
        )}
      </div>
    </Link>
  );
}
