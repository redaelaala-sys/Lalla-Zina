import { getTranslations, getLocale } from "next-intl/server";

const SECTIONS_FR = [
  { title: "1. Objet", text: "Les présentes conditions générales de vente régissent les ventes effectuées sur le site LallaZina entre la boutique et ses clientes au Maroc." },
  { title: "2. Produits", text: "Les produits proposés sont décrits avec la plus grande précision possible. De légères variations de couleur peuvent apparaître selon l'écran utilisé." },
  { title: "3. Prix", text: "Les prix sont indiqués en dirhams marocains (DH), toutes taxes comprises. LallaZina se réserve le droit de modifier ses prix à tout moment." },
  { title: "4. Commande", text: "Toute commande passée sur le site ou via WhatsApp implique l'acceptation des présentes conditions générales de vente." },
  { title: "5. Paiement", text: "Le paiement s'effectue actuellement à la livraison (paiement en espèces au livreur). D'autres moyens de paiement pourront être proposés ultérieurement." },
  { title: "6. Livraison", text: "LallaZina livre dans toutes les villes du Maroc. Les délais et frais de livraison sont précisés sur la page Livraison et peuvent varier selon la destination." },
  { title: "7. Retours et échanges", text: "Les conditions de retour et d'échange sont détaillées sur la page Retours & échanges." },
  { title: "8. Responsabilité", text: "LallaZina ne saurait être tenue responsable des retards de livraison dus à des causes indépendantes de sa volonté." },
  { title: "9. Contact", text: "Pour toute question relative aux présentes conditions, contactez-nous via la page Contact ou WhatsApp." },
];

const SECTIONS_AR = [
  { title: "1. الموضوع", text: "تنظم هذه الشروط العامة عمليات البيع التي تتم عبر موقع لالة زينة بين المتجر وزبوناته في المغرب." },
  { title: "2. المنتجات", text: "يتم وصف المنتجات المعروضة بأكبر قدر ممكن من الدقة. قد تظهر اختلافات طفيفة في الألوان حسب الشاشة المستخدمة." },
  { title: "3. الأسعار", text: "الأسعار محددة بالدرهم المغربي، شاملة جميع الرسوم. تحتفظ لالة زينة بحق تعديل أسعارها في أي وقت." },
  { title: "4. الطلب", text: "أي طلب يتم عبر الموقع أو واتساب يعني الموافقة على هذه الشروط العامة للبيع." },
  { title: "5. الدفع", text: "يتم الدفع حالياً عند الاستلام (نقداً للموصل). قد يتم إضافة وسائل دفع أخرى لاحقاً." },
  { title: "6. التوصيل", text: "توصل لالة زينة إلى جميع مدن المغرب. الآجال والأسعار مفصلة في صفحة التوصيل وقد تختلف حسب الوجهة." },
  { title: "7. الإرجاع والتبديل", text: "شروط الإرجاع والتبديل مفصلة في صفحة الإرجاع والتبديل." },
  { title: "8. المسؤولية", text: "لا تتحمل لالة زينة مسؤولية التأخير في التوصيل الناتج عن أسباب خارجة عن إرادتها." },
  { title: "9. التواصل", text: "لأي سؤال يخص هذه الشروط، تواصلي معنا عبر صفحة الاتصال أو واتساب." },
];

export default async function TermsPage() {
  const [tp, locale] = await Promise.all([getTranslations("pages"), getLocale()]);
  const sections = locale === "ar" ? SECTIONS_AR : SECTIONS_FR;

  return (
    <div className="container-site py-14 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-8">{tp("termsTitle")}</h1>
      <p className="text-xs text-charcoal/40 mb-8">
        {locale === "ar"
          ? "نص عام قابل للتعديل من طرف المتجر أو مستشار قانوني قبل الإطلاق الرسمي."
          : "Texte générique, à faire valider par la boutique (ou un conseil juridique) avant mise en ligne définitive."}
      </p>
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-semibold mb-1.5">{s.title}</h2>
            <p className="text-sm text-charcoal/70 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
