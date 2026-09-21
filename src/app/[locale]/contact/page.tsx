import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/site/ContactForm";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppLink, isWhatsAppLink } from "@/lib/whatsapp";

export default async function ContactPage() {
  const [t, tp, tw, settings] = await Promise.all([
    getTranslations("contact"),
    getTranslations("pages"),
    getTranslations("whatsappMessages"),
    getSettings(),
  ]);

  return (
    <div className="container-site py-14">
      <h1 className="font-heading text-3xl md:text-4xl mb-3 text-center">{tp("contactTitle")}</h1>
      <p className="text-charcoal/60 text-center mb-12">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold mb-1">{t("phone")}</p>
            <a href={`tel:+${settings.contactPhone}`} className="text-charcoal/70 hover:text-rose-dark">
              +{settings.contactPhone}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">WhatsApp</p>
            <a
              href={buildWhatsAppLink(settings.whatsappNumber, tw("general"))}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/70 hover:text-rose-dark"
            >
              {isWhatsAppLink(settings.whatsappNumber) ? t("chatCta") : `+${settings.whatsappNumber}`}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">{t("email")}</p>
            <a href={`mailto:${settings.contactEmail}`} className="text-charcoal/70 hover:text-rose-dark">
              {settings.contactEmail}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">{t("address")}</p>
            <p className="text-charcoal/70 mb-1">{settings.storeAddress}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.storeAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline text-rose-dark"
            >
              {t("mapCta")}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">{t("followUs")}</p>
            <div className="flex gap-4 text-sm text-charcoal/70">
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-rose-dark">
                Instagram
              </a>
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-rose-dark">
                Facebook
              </a>
              <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-rose-dark">
                TikTok
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>

      <div className="max-w-4xl mx-auto mt-12 rounded-xl overflow-hidden border border-beige-dark/40 h-72">
        <iframe
          title="LallaZina — localisation"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.storeAddress)}&z=15&output=embed`}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
