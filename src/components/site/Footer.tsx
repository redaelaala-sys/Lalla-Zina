import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/settings";

const CATEGORIES = [
  { slug: "robes", key: "dresses" as const },
  { slug: "ensembles", key: "sets" as const },
  { slug: "hauts", key: "tops" as const },
  { slug: "pantalons", key: "pants" as const },
  { slug: "accessoires", key: "accessories" as const },
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tb = useTranslations("brand");

  return (
    <footer className="bg-charcoal text-ivory/90 mt-20">
      <div className="container-site py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div className="col-span-2 md:col-span-1">
          <p className="font-heading text-2xl mb-3">{tb("name")}</p>
          <p className="text-ivory/60 leading-relaxed">{t("about")}</p>
          <p className="mt-4 text-gold text-xs">{tb("slogan")}</p>
        </div>

        <div>
          <p className="font-semibold mb-4">{t("linksTitle")}</p>
          <ul className="space-y-2 text-ivory/70">
            <li><Link href="/a-propos" className="hover:text-white">{t("aboutLink")}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{t("contactLink")}</Link></li>
            <li><Link href="/livraison" className="hover:text-white">{t("shippingLink")}</Link></li>
            <li><Link href="/retours-echanges" className="hover:text-white">{t("returnsLink")}</Link></li>
            <li><Link href="/cgv" className="hover:text-white">{t("termsLink")}</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">{t("privacyLink")}</Link></li>
            <li><Link href="/faq" className="hover:text-white">{t("faqLink")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4">{t("categoriesTitle")}</p>
          <ul className="space-y-2 text-ivory/70">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/boutique?category=${c.slug}`} className="hover:text-white">
                  {tn(c.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/boutique?sort=promo" className="hover:text-white">
                {tn("promotions")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4">{t("followTitle")}</p>
          <ul className="space-y-2 text-ivory/70">
            <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
            <li><a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></li>
            <li><a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">TikTok</a></li>
          </ul>
          <p className="font-semibold mt-6 mb-2">{t("paymentTitle")}</p>
          <p className="text-ivory/70">{t("paymentText")}</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/50">
        {t("rights", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
