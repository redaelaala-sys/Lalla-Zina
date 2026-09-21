import { getTranslations, getLocale } from "next-intl/server";

const FAQ_FR = [
  { q: "Quels sont les délais de livraison ?", a: "Comptez généralement entre 2 et 5 jours ouvrables selon votre ville. Ces délais sont estimatifs et peuvent varier." },
  { q: "Livrez-vous partout au Maroc ?", a: "Oui, LallaZina livre dans toutes les villes du Maroc. Consultez notre page Livraison pour les tarifs par ville." },
  { q: "Quel est le prix de la livraison ?", a: "Le tarif dépend de votre ville de livraison. La livraison peut être gratuite à partir d'un certain montant d'achat — voir la page Livraison." },
  { q: "Comment choisir ma taille ?", a: "Consultez notre guide des tailles disponible sur chaque fiche produit pour trouver la taille qui vous correspond." },
  { q: "Puis-je échanger un article ?", a: "Oui, sous certaines conditions détaillées dans notre page Retours & échanges." },
  { q: "Puis-je retourner un article ?", a: "Oui, dans un délai déterminé après réception, si l'article est en parfait état. Voir notre page Retours & échanges." },
  { q: "Comment commander via WhatsApp ?", a: "Cliquez sur le bouton WhatsApp présent sur nos pages produits, panier ou checkout : un message pré-rempli avec les détails de votre commande s'ouvrira automatiquement." },
  { q: "Comment suivre ma commande ?", a: "Rendez-vous sur la page 'Suivre ma commande' avec votre numéro de commande et votre téléphone, ou contactez-nous directement sur WhatsApp." },
  { q: "Quels sont les moyens de paiement ?", a: "Actuellement, le paiement se fait uniquement à la livraison. D'autres moyens de paiement pourront être ajoutés prochainement." },
  { q: "Puis-je modifier ma commande ?", a: "Contactez-nous rapidement sur WhatsApp après votre commande, nous ferons notre possible pour la modifier avant expédition." },
];

const FAQ_AR = [
  { q: "ما هي آجال التوصيل؟", a: "عادةً ما بين 2 و5 أيام عمل حسب مدينتك. هذه الآجال تقديرية وقد تختلف." },
  { q: "هل توصلون لجميع مدن المغرب؟", a: "نعم، توصل لالة زينة لجميع مدن المغرب. راجعي صفحة التوصيل للاطلاع على الأسعار حسب المدينة." },
  { q: "كم يكلف التوصيل؟", a: "يعتمد السعر على مدينة التوصيل. قد يكون التوصيل مجانياً ابتداءً من مبلغ معين — راجعي صفحة التوصيل." },
  { q: "كيف أختار مقاسي؟", a: "راجعي دليل المقاسات المتوفر في كل صفحة منتج لإيجاد المقاس المناسب لك." },
  { q: "هل يمكنني تبديل منتج؟", a: "نعم، وفق شروط معينة موضحة في صفحة الإرجاع والتبديل." },
  { q: "هل يمكنني إرجاع منتج؟", a: "نعم، خلال مدة محددة بعد الاستلام، إذا كان المنتج في حالة ممتازة. راجعي صفحة الإرجاع والتبديل." },
  { q: "كيف أطلب عبر واتساب؟", a: "اضغطي على زر واتساب الموجود في صفحات المنتجات أو السلة أو إتمام الطلب: ستفتح رسالة جاهزة تحتوي تفاصيل طلبك." },
  { q: "كيف أتتبع طلبي؟", a: "توجهي إلى صفحة 'تتبعي طلبك' مع إدخال رقم الطلب والهاتف، أو تواصلي معنا مباشرة عبر واتساب." },
  { q: "ما هي وسائل الدفع المتاحة؟", a: "حالياً، الدفع يتم فقط عند الاستلام. سيتم إضافة وسائل دفع أخرى قريباً." },
  { q: "هل يمكنني تعديل طلبي؟", a: "تواصلي معنا بسرعة عبر واتساب بعد إتمام الطلب، سنبذل قصارى جهدنا لتعديله قبل الشحن." },
];

export default async function FaqPage() {
  const [tp, locale] = await Promise.all([getTranslations("pages"), getLocale()]);
  const items = locale === "ar" ? FAQ_AR : FAQ_FR;

  return (
    <div className="container-site py-14 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-10 text-center">{tp("faqTitle")}</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.q} className="group border border-beige-dark/40 rounded-lg px-5 py-4">
            <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-sm">
              {item.q}
              <span className="text-charcoal/40 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-charcoal/60 mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
