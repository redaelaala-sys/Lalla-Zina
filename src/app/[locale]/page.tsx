import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/site/ProductCard";
import NewsletterForm from "@/components/site/NewsletterForm";
import {
  getCategories,
  getNewArrivals,
  getBestSellers,
} from "@/lib/products";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const [categories, newArrivals, bestSellers, settings] = await Promise.all([
    getCategories(),
    getNewArrivals(8),
    getBestSellers(8),
    getSettings(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center">
        <Image
          src={settings.heroImage}
          alt=""
          fill
          priority
          className="object-cover brand-photo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="relative container-site text-white">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-gold mb-4">
            {t("heroKicker")}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl max-w-xl leading-tight mb-5">
            {t("heroTitle")}
          </h1>
          <p className="max-w-md text-white/85 mb-8">{t("heroText")}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/boutique"
              className="bg-white text-charcoal px-7 py-3 rounded-full text-sm font-semibold hover:bg-beige transition"
            >
              {t("heroCta1")}
            </Link>
            <Link
              href="/boutique?sort=new"
              className="border border-white/70 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition"
            >
              {t("heroCta2")}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-site py-16">
        <h2 className="font-heading text-3xl text-center mb-10">{t("categoriesTitle")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/boutique?category=${c.slug}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden block"
            >
              <Image
                src={c.image}
                alt={locale === "ar" ? c.nameAr : c.nameFr}
                fill
                className="object-cover brand-photo transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-charcoal/25 group-hover:bg-charcoal/35 transition" />
              <span className="absolute bottom-5 start-5 text-white font-heading text-xl md:text-2xl">
                {locale === "ar" ? c.nameAr : c.nameFr}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-beige/50 py-16">
        <div className="container-site">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-3xl">{t("newArrivalsTitle")}</h2>
            <Link href="/boutique?sort=new" className="text-sm font-medium hover:text-rose-dark">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="container-site py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl">{t("bestSellersTitle")}</h2>
          <Link href="/boutique" className="text-sm font-medium hover:text-rose-dark">
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative h-72 md:h-96 flex items-center justify-center text-center overflow-hidden">
        <Image src={settings.promoBannerImage} alt="" fill className="object-cover brand-photo" />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative text-white px-4">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-gold mb-3">
            {t("promoKicker")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl mb-6">{t("promoTitle")}</h2>
          <Link
            href="/boutique?sort=promo"
            className="inline-block bg-white text-charcoal px-8 py-3 rounded-full text-sm font-semibold hover:bg-beige transition"
          >
            {t("promoCta")}
          </Link>
        </div>
      </section>

      {/* Advantages */}
      <section className="container-site py-16">
        <h2 className="font-heading text-3xl text-center mb-12">{t("advantagesTitle")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "🚚", title: t("advantage1Title"), text: t("advantage1Text") },
            { icon: "💳", title: t("advantage2Title"), text: t("advantage2Text") },
            { icon: "💬", title: t("advantage3Title"), text: t("advantage3Text") },
            { icon: "🔄", title: t("advantage4Title"), text: t("advantage4Text") },
          ].map((a) => (
            <div key={a.title} className="text-center">
              <div className="text-4xl mb-4">{a.icon}</div>
              <h3 className="font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-charcoal/60">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-beige/50 py-16">
        <div className="container-site text-center">
          <h2 className="font-heading text-3xl mb-8">{t("instagramTitle")}</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-8">
            {[
              "/images/category-robes.jpg",
              "/images/product-ensembles-2.jpg",
              "/images/category-hauts.jpg",
              "/images/category-vestes-manteaux.jpg",
              "/images/category-accessoires.jpg",
              "/images/product-robes-2.jpg",
            ].map((src) => (
              <div key={src} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={src} alt="Instagram LallaZina" fill className="object-cover brand-photo" />
              </div>
            ))}
          </div>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-charcoal px-7 py-3 rounded-full text-sm font-semibold hover:bg-charcoal hover:text-white transition"
          >
            {t("instagramCta")}
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-charcoal py-16">
        <div className="container-site flex flex-col items-center text-center gap-6">
          <h2 className="font-heading text-3xl text-white max-w-lg">{t("newsletterTitle")}</h2>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
