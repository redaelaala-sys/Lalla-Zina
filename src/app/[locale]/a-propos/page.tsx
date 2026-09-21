import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/settings";

export default async function AboutPage() {
  const [t, tp, settings] = await Promise.all([
    getTranslations("about"),
    getTranslations("pages"),
    getSettings(),
  ]);
  const values = [t("value1"), t("value2"), t("value3"), t("value4"), t("value5")];

  return (
    <div>
      <div className="relative h-72 md:h-96">
        <Image src={settings.aboutImage} alt="LallaZina" fill className="object-cover brand-photo" />
        <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center">
          <h1 className="font-heading text-4xl md:text-5xl text-white">{tp("aboutTitle")}</h1>
        </div>
      </div>

      <div className="container-site py-14 max-w-2xl mx-auto">
        <p className="text-charcoal/70 leading-relaxed mb-5">{t("intro")}</p>
        <p className="text-charcoal/70 leading-relaxed mb-10">{t("introText2")}</p>

        <h2 className="font-heading text-2xl mb-3">{t("missionTitle")}</h2>
        <p className="text-charcoal/70 leading-relaxed mb-10">{t("missionText")}</p>

        <h2 className="font-heading text-2xl mb-5">{t("valuesTitle")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {values.map((v) => (
            <div key={v} className="bg-beige/40 rounded-lg py-5 text-center text-sm font-medium">
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
