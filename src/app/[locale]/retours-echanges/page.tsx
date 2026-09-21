import { getTranslations, getLocale } from "next-intl/server";
import { getSettings } from "@/lib/settings";

export default async function ReturnsPage() {
  const [t, tp, locale, settings] = await Promise.all([
    getTranslations("returns"),
    getTranslations("pages"),
    getLocale(),
    getSettings(),
  ]);

  const text = locale === "ar" ? settings.returnPolicyTextAr : settings.returnPolicyTextFr;

  return (
    <div className="container-site py-14 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-6">{tp("returnsTitle")}</h1>
      <p className="text-charcoal/70 leading-relaxed mb-6">{t("intro")}</p>
      <div className="bg-beige/40 rounded-xl p-6 text-sm leading-relaxed whitespace-pre-line">
        {text}
      </div>
    </div>
  );
}
