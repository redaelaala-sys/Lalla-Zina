import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import ProductGallery from "@/components/site/ProductGallery";
import AddToCartPanel from "@/components/site/AddToCartPanel";
import ProductCard from "@/components/site/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.nameFr,
    description: product.seoDescription || product.descriptionFr,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const [product, t, locale, settings] = await Promise.all([
    getProductBySlug(slug),
    getTranslations("product"),
    getLocale(),
    getSettings(),
  ]);

  if (!product || !product.isActive) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);
  const images: string[] = JSON.parse(product.images);
  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const description = locale === "ar" ? product.descriptionAr : product.descriptionFr;
  const hasPromo = product.oldPrice && product.oldPrice > product.price;

  return (
    <div className="container-site py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        <ProductGallery images={images} alt={name} />

        <div>
          <h1 className="font-heading text-3xl md:text-4xl mb-3">{name}</h1>
          <p className="text-xs text-charcoal/50 mb-4">
            {t("reference")} : {product.sku}
          </p>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold text-rose-dark">{product.price} DH</span>
            {hasPromo && (
              <span className="text-base text-charcoal/40 line-through">{product.oldPrice} DH</span>
            )}
          </div>

          <p className="text-charcoal/70 leading-relaxed mb-6">{description}</p>
          {product.composition && (
            <p className="text-sm text-charcoal/50 mb-8">
              {t("composition")} : {product.composition}
            </p>
          )}

          <AddToCartPanel
            productId={product.id}
            slug={product.slug}
            sku={product.sku}
            nameFr={product.nameFr}
            nameAr={product.nameAr}
            price={product.price}
            image={images[0]}
            variants={product.variants}
            whatsappNumber={settings.whatsappNumber}
            sizeGuide={settings.sizeGuide}
          />

          <p className="text-xs text-charcoal/50 mt-8 border-t border-beige-dark/40 pt-6">
            {t("deliveryInfo")}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-heading text-2xl md:text-3xl mb-8">{t("similarTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
