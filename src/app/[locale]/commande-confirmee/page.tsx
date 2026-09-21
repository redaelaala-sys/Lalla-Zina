import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppLink, fillTemplate } from "@/lib/whatsapp";
import { getSettings } from "@/lib/settings";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const [t, tw, settings] = await Promise.all([
    getTranslations("orderConfirmation"),
    getTranslations("whatsappMessages"),
    getSettings(),
  ]);

  const message = order ? fillTemplate(tw("orderConfirm"), { order }) : "";

  return (
    <div className="container-site py-24 text-center max-w-lg mx-auto">
      <div className="text-5xl mb-6">✓</div>
      <h1 className="font-heading text-3xl md:text-4xl mb-4">{t("title")}</h1>
      {order && (
        <p className="text-charcoal/70 mb-10">{t("text", { orderNumber: order })}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {order && (
          <a
            href={buildWhatsAppLink(settings.whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white rounded-full px-7 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            {t("whatsappCta")}
          </a>
        )}
        <Link href="/" className="border border-charcoal rounded-full px-7 py-3 text-sm font-semibold hover:bg-charcoal hover:text-white transition">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
