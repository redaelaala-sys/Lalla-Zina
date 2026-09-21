import { prisma } from "@/lib/prisma";
import { DEFAULT_DELIVERY_FEES, type DeliveryFees } from "@/lib/delivery";

export type SiteSettings = {
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  freeShippingThreshold: number;
  deliveryFees: DeliveryFees;
  returnPolicyTextFr: string;
  returnPolicyTextAr: string;
  sizeGuide: { size: string; bust: string; waist: string; hips: string }[];
  heroImage: string;
  promoBannerImage: string;
  aboutImage: string;
};

const DEFAULT_SIZE_GUIDE = [
  { size: "XS", bust: "78-82", waist: "60-64", hips: "86-90" },
  { size: "S", bust: "83-87", waist: "65-69", hips: "91-95" },
  { size: "M", bust: "88-92", waist: "70-74", hips: "96-100" },
  { size: "L", bust: "93-98", waist: "75-80", hips: "101-106" },
  { size: "XL", bust: "99-105", waist: "81-87", hips: "107-113" },
  { size: "XXL", bust: "106-112", waist: "88-94", hips: "114-120" },
];

const DEFAULT_RETURN_FR =
  "Vous disposez de 14 jours après réception de votre commande pour demander un retour ou un échange. Les articles doivent être non portés, non lavés, avec leurs étiquettes d'origine. Les sous-vêtements et accessoires en promotion ne sont pas repris. Pour toute demande, contactez-nous sur WhatsApp avec votre numéro de commande. (Informations à confirmer par la boutique.)";
const DEFAULT_RETURN_AR =
  "لديك 14 يوماً بعد استلام طلبك لطلب الإرجاع أو التبديل. يجب أن تكون المنتجات غير مستعملة وغير مغسولة، مع الحفاظ على البطاقات الأصلية. الملابس الداخلية والإكسسوارات المخفضة غير قابلة للإرجاع. لأي طلب، تواصلي معنا عبر واتساب مع ذكر رقم طلبك. (معلومات قابلة للتأكيد من طرف المتجر.)";

let cachedSettings: SiteSettings | null = null;
let cacheTime = 0;

export async function getSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < 5000) {
    return cachedSettings;
  }

  const row = await prisma.settings.findUnique({ where: { id: "singleton" } });

  const settings: SiteSettings = row
    ? {
        whatsappNumber: row.whatsappNumber,
        instagramUrl: row.instagramUrl,
        facebookUrl: row.facebookUrl,
        tiktokUrl: row.tiktokUrl,
        contactEmail: row.contactEmail,
        contactPhone: row.contactPhone,
        storeAddress: row.storeAddress,
        freeShippingThreshold: row.freeShippingThreshold,
        deliveryFees: JSON.parse(row.deliveryFeesJson),
        returnPolicyTextFr: row.returnPolicyTextFr,
        returnPolicyTextAr: row.returnPolicyTextAr,
        sizeGuide: JSON.parse(row.sizeGuideJson),
        heroImage: row.heroImage,
        promoBannerImage: row.promoBannerImage,
        aboutImage: row.aboutImage,
      }
    : {
        whatsappNumber: "https://wa.me/message/MI6RIBZTHDILJ1",
        instagramUrl: "https://www.instagram.com/lallazina4?stkn=Z2tiN3QzM280Z3Zo&utm_source=qr",
        facebookUrl: "https://www.facebook.com/share/198VnFRVkf/?mibextid=wwXIfr",
        tiktokUrl: "https://www.tiktok.com/@lallazina4?_r=1&_t=ZS-99s9lsJuUuT",
        contactEmail: "contact@lallazina.ma",
        contactPhone: "212718149504",
        storeAddress: "JF4V+FFW، Avenue Souhaib Erroumi, Casablanca 20250",
        freeShippingThreshold: 500,
        deliveryFees: DEFAULT_DELIVERY_FEES,
        returnPolicyTextFr: DEFAULT_RETURN_FR,
        returnPolicyTextAr: DEFAULT_RETURN_AR,
        sizeGuide: DEFAULT_SIZE_GUIDE,
        heroImage: "/images/hero.jpg",
        promoBannerImage: "/images/promo-banner.jpg",
        aboutImage: "/images/about.jpg",
      };

  cachedSettings = settings;
  cacheTime = now;
  return settings;
}

export function invalidateSettingsCache() {
  cachedSettings = null;
}
