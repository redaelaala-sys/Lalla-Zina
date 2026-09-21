import { getTranslations, getLocale } from "next-intl/server";
import { getSettings } from "@/lib/settings";

export default async function ShippingPage() {
  const [t, locale, settings] = await Promise.all([
    getTranslations("shipping"),
    getLocale(),
    getSettings(),
  ]);
  const tp = await getTranslations("pages");
  const cities = Object.entries(settings.deliveryFees).filter(([k]) => k !== "_default");

  return (
    <div className="container-site py-14 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-6">{tp("shippingTitle")}</h1>
      <p className="text-charcoal/70 leading-relaxed mb-8">{t("intro")}</p>

      <div className="bg-beige/40 rounded-xl p-4 mb-6 text-sm space-y-2">
        <p>{t("estimatedDelay")}</p>
        <p>{t("freeShipping", { amount: settings.freeShippingThreshold })}</p>
      </div>

      <h2 className="font-heading text-2xl mb-4">{t("cityTable")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige-dark/60">
              <th className="py-2.5 text-start font-semibold">{t("city")}</th>
              <th className="py-2.5 text-start font-semibold">{t("fee")}</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(([city, fee]) => (
              <tr key={city} className="border-b border-beige-dark/30">
                <td className="py-2.5">{city}</td>
                <td className="py-2.5">{fee} DH</td>
              </tr>
            ))}
            <tr>
              <td className="py-2.5">{t("otherCities")}</td>
              <td className="py-2.5">{settings.deliveryFees._default} DH</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-charcoal/40 mt-6">
        {locale === "ar"
          ? "الأسعار أعلاه تقديرية ويمكن تعديلها من طرف المتجر."
          : "Les tarifs ci-dessus sont indicatifs et modifiables par la boutique."}
      </p>
    </div>
  );
}
