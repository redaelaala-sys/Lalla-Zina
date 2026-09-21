"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { buildWhatsAppLink, fillTemplate } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/settings";

export default function CartPageClient({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("cart");
  const tw = useTranslations("whatsappMessages");
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const subtotal = useCartStore((s) => s.subtotal());

  const freeShippingReached = subtotal >= settings.freeShippingThreshold;

  function handleWhatsAppOrder() {
    const itemsText = items
      .map((i) => `- ${i.name} (${i.size}, ${i.color}) x${i.qty} — ${i.price * i.qty} DH`)
      .join("\n");
    const message = fillTemplate(tw("cartOrder"), { items: itemsText, total: subtotal });
    window.open(buildWhatsAppLink(settings.whatsappNumber, message), "_blank");
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-24 text-center">
        <h1 className="font-heading text-3xl mb-4">{t("title")}</h1>
        <p className="text-charcoal/60 mb-8">{t("empty")}</p>
        <Link href="/boutique" className="inline-block bg-charcoal text-white px-7 py-3 rounded-full text-sm font-semibold">
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-10">
      <h1 className="font-heading text-3xl md:text-4xl mb-10">{t("title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-beige-dark/30 pb-5">
              <div className="relative h-28 w-24 rounded-lg overflow-hidden bg-beige shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1">{item.name}</p>
                <p className="text-xs text-charcoal/50 mb-2">
                  {item.size} · {item.color}
                </p>
                <p className="text-sm font-semibold text-rose-dark">{item.price} DH</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-beige-dark/60 rounded-full">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 text-base"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 text-base"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-charcoal/50 underline hover:text-red-600"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold shrink-0">{item.price * item.qty} DH</p>
            </div>
          ))}
        </div>

        <div className="bg-beige/40 rounded-xl p-6 h-fit">
          {!freeShippingReached && (
            <p className="text-xs text-charcoal/60 mb-4 bg-white rounded-lg p-3">
              {t("freeShippingNotice", { amount: settings.freeShippingThreshold })}
            </p>
          )}
          {freeShippingReached && (
            <p className="text-xs text-green-700 mb-4 bg-white rounded-lg p-3">
              {t("freeShippingReached")}
            </p>
          )}
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal/60">{t("subtotal")}</span>
            <span className="font-medium">{subtotal} DH</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-charcoal/60">{t("shipping")}</span>
            <span className="text-charcoal/60">{t("shippingCalculated")}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-beige-dark/50 pt-4 mb-6">
            <span>{t("total")}</span>
            <span>{subtotal} DH</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-charcoal text-white rounded-full py-3.5 text-sm font-semibold mb-3 hover:bg-charcoal/90 transition"
          >
            {t("checkout")}
          </button>
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#25D366] text-white rounded-full py-3.5 text-sm font-semibold hover:opacity-90 transition"
          >
            {t("orderWhatsapp")}
          </button>
        </div>
      </div>
    </div>
  );
}
