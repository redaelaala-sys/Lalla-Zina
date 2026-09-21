import { getTranslations, getLocale } from "next-intl/server";

const SECTIONS_FR = [
  { title: "1. Données collectées", text: "Lors d'une commande ou d'une prise de contact, nous collectons : nom, téléphone, adresse, ville et éventuellement e-mail." },
  { title: "2. Utilisation des données", text: "Ces informations sont utilisées uniquement pour traiter vos commandes, assurer la livraison et vous contacter si nécessaire." },
  { title: "3. Partage des données", text: "Vos données ne sont jamais vendues. Elles peuvent être partagées avec nos partenaires de livraison dans la seule mesure nécessaire à l'acheminement de votre commande." },
  { title: "4. Conservation", text: "Vos données sont conservées le temps nécessaire au traitement de vos commandes et au suivi de la relation client." },
  { title: "5. Vos droits", text: "Vous pouvez demander à tout moment l'accès, la rectification ou la suppression de vos données personnelles en nous contactant." },
  { title: "6. Sécurité", text: "Nous mettons en œuvre des mesures raisonnables pour protéger vos données contre tout accès non autorisé." },
];

const SECTIONS_AR = [
  { title: "1. البيانات المجمعة", text: "عند إتمام طلب أو التواصل معنا، نقوم بجمع: الاسم، الهاتف، العنوان، المدينة، والبريد الإلكتروني إن وجد." },
  { title: "2. استخدام البيانات", text: "تُستخدم هذه المعلومات فقط لمعالجة طلباتك وضمان التوصيل والتواصل معك عند الحاجة." },
  { title: "3. مشاركة البيانات", text: "لا يتم بيع بياناتك أبداً. قد تتم مشاركتها مع شركاء التوصيل فقط بالقدر اللازم لإيصال طلبك." },
  { title: "4. الاحتفاظ بالبيانات", text: "يتم الاحتفاظ ببياناتك للمدة اللازمة لمعالجة طلباتك ومتابعة العلاقة مع الزبونة." },
  { title: "5. حقوقك", text: "يمكنك في أي وقت طلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها بالتواصل معنا." },
  { title: "6. الأمان", text: "نتخذ تدابير معقولة لحماية بياناتك من أي وصول غير مصرح به." },
];

export default async function PrivacyPage() {
  const [tp, locale] = await Promise.all([getTranslations("pages"), getLocale()]);
  const sections = locale === "ar" ? SECTIONS_AR : SECTIONS_FR;

  return (
    <div className="container-site py-14 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-8">{tp("privacyTitle")}</h1>
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
