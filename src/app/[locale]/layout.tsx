import type { Metadata } from "next";
import { Playfair_Display, Poppins, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloatButton from "@/components/site/WhatsAppFloatButton";
import { getSettings } from "@/lib/settings";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  return {
    title: {
      default: `${t("name")} — ${t("slogan")}`,
      template: `%s — ${t("name")}`,
    },
    description:
      locale === "ar"
        ? "لالة زينة، أزياء نسائية أنيقة وعصرية في متناول الجميع، توصيل لجميع مدن المغرب."
        : "LallaZina, mode féminine élégante et accessible pour les femmes marocaines. Livraison partout au Maroc, paiement à la livraison.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSettings();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontStyle =
    locale === "ar"
      ? ({ "--font-heading": "var(--font-cairo)", "--font-body": "var(--font-cairo)" } as React.CSSProperties)
      : ({ "--font-heading": "var(--font-playfair)", "--font-body": "var(--font-poppins)" } as React.CSSProperties);

  return (
    <html
      lang={locale}
      dir={dir}
      style={fontStyle}
      className={`${playfair.variable} ${poppins.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <WhatsAppFloatButton phoneNumber={settings.whatsappNumber} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
