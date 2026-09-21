import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_DELIVERY_FEES } from "../src/lib/delivery";

const prisma = new PrismaClient();

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const CATEGORIES = [
  { slug: "robes", nameFr: "Robes", nameAr: "فساتين", image: "/images/category-robes.jpg", order: 1 },
  { slug: "ensembles", nameFr: "Ensembles", nameAr: "أطقم", image: "/images/category-ensembles.jpg", order: 2 },
  { slug: "hauts", nameFr: "Hauts", nameAr: "قمصان وتيشيرتات", image: "/images/category-hauts.jpg", order: 3 },
  { slug: "pantalons", nameFr: "Pantalons", nameAr: "سراويل", image: "/images/category-pantalons.jpg", order: 4 },
  { slug: "vestes-manteaux", nameFr: "Vestes & manteaux", nameAr: "جاكيتات ومعاطف", image: "/images/category-vestes-manteaux.jpg", order: 5 },
  { slug: "accessoires", nameFr: "Accessoires", nameAr: "إكسسوارات", image: "/images/category-accessoires.jpg", order: 6 },
];

type SeedProduct = {
  slug: string;
  sku: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  composition: string;
  price: number;
  oldPrice?: number;
  categorySlug: string;
  isNew?: boolean;
  isFeatured?: boolean;
  colors: string[];
};

const PRODUCTS: SeedProduct[] = [
  // Robes
  { slug: "robe-longue-emma", sku: "LZ-ROB-001", nameFr: "Robe longue Emma", nameAr: "فستان طويل إيما", descriptionFr: "Robe longue fluide à manches longues, idéale pour un look élégant et couvrant au quotidien.", descriptionAr: "فستان طويل وانسيابي بأكمام طويلة، مثالي لإطلالة أنيقة ومحتشمة في الحياة اليومية.", composition: "95% Viscose, 5% Élasthanne", price: 349, oldPrice: 449, categorySlug: "robes", isNew: true, isFeatured: true, colors: ["Noir", "Beige", "Bordeaux"] },
  { slug: "robe-soiree-yasmine", sku: "LZ-ROB-002", nameFr: "Robe de soirée Yasmine", nameAr: "فستان سهرة ياسمين", descriptionFr: "Robe de soirée brodée, coupe évasée, parfaite pour les grandes occasions.", descriptionAr: "فستان سهرة مطرز بقصة واسعة، مثالي للمناسبات الخاصة.", composition: "100% Polyester", price: 599, categorySlug: "robes", isFeatured: true, colors: ["Noir", "Vert"] },
  { slug: "robe-kaftan-amira", sku: "LZ-ROB-003", nameFr: "Kaftan Amira", nameAr: "قفطان أميرة", descriptionFr: "Kaftan traditionnel revisité avec broderies dorées, pour un style intemporel.", descriptionAr: "قفطان تقليدي بلمسة عصرية مع تطريز ذهبي، لإطلالة خالدة.", composition: "100% Polyester", price: 749, categorySlug: "robes", colors: ["Bleu", "Rose"] },
  { slug: "robe-midi-nour", sku: "LZ-ROB-004", nameFr: "Robe midi Nour", nameAr: "فستان قصير نور", descriptionFr: "Robe midi ceinturée, coupe cintrée qui souligne la silhouette avec élégance.", descriptionAr: "فستان متوسط الطول بحزام، قصة تبرز القوام بأناقة.", composition: "90% Coton, 10% Élasthanne", price: 299, categorySlug: "robes", isNew: true, colors: ["Beige", "Noir"] },

  // Ensembles
  { slug: "ensemble-tailleur-sarah", sku: "LZ-ENS-001", nameFr: "Tailleur Sarah veste + pantalon", nameAr: "طقم سارة جاكيت وبنطلون", descriptionFr: "Ensemble tailleur chic composé d'une veste cintrée et d'un pantalon droit.", descriptionAr: "طقم أنيق يتكون من جاكيت مضبوطة وبنطلون مستقيم.", composition: "70% Polyester, 30% Viscose", price: 549, categorySlug: "ensembles", isFeatured: true, colors: ["Noir", "Gris"] },
  { slug: "ensemble-deux-pieces-lina", sku: "LZ-ENS-002", nameFr: "Ensemble deux pièces Lina", nameAr: "طقم قطعتين لينا", descriptionFr: "Haut et jupe assortis, coupe moderne pour un look coordonné sans effort.", descriptionAr: "قميص وتنورة متناسقان، قصة عصرية لإطلالة منسقة بسهولة.", composition: "95% Polyester, 5% Élasthanne", price: 429, oldPrice: 519, categorySlug: "ensembles", isNew: true, colors: ["Rose", "Beige"] },
  { slug: "ensemble-decontracte-hiba", sku: "LZ-ENS-003", nameFr: "Ensemble décontracté Hiba", nameAr: "طقم مريح هبة", descriptionFr: "Ensemble confortable en maille, parfait pour un usage quotidien sans compromis sur le style.", descriptionAr: "طقم مريح من التريكو، مثالي للاستخدام اليومي دون التنازل عن الأناقة.", composition: "100% Coton", price: 379, categorySlug: "ensembles", colors: ["Gris", "Marron"] },

  // Hauts
  { slug: "haut-chemisier-soie-maya", sku: "LZ-HAU-001", nameFr: "Chemisier satiné Maya", nameAr: "قميص ساتان مايا", descriptionFr: "Chemisier fluide en satin, col boutonné, idéal pour le bureau comme pour le soir.", descriptionAr: "قميص انسيابي من الساتان بياقة مزررة، مثالي للعمل والسهرة.", composition: "100% Polyester satiné", price: 249, categorySlug: "hauts", isNew: true, colors: ["Blanc", "Noir", "Rose"] },
  { slug: "haut-tunique-brodee-salma", sku: "LZ-HAU-002", nameFr: "Tunique brodée Salma", nameAr: "قميص طويل مطرز سلمى", descriptionFr: "Tunique longue avec broderies fines sur l'encolure, à porter avec un pantalon ou un legging.", descriptionAr: "قميص طويل بتطريز أنيق عند الرقبة، يُلبس مع بنطلون أو سروال ضيق.", composition: "100% Viscose", price: 219, categorySlug: "hauts", colors: ["Beige", "Bleu"] },
  { slug: "haut-pull-doux-rim", sku: "LZ-HAU-003", nameFr: "Pull douceur Rim", nameAr: "سترة صوف ريم", descriptionFr: "Pull en maille douce et chaude, coupe ample pour un confort optimal.", descriptionAr: "سترة من الصوف الناعم والدافئ، قصة واسعة لراحة قصوى.", composition: "60% Acrylique, 40% Coton", price: 199, oldPrice: 269, categorySlug: "hauts", isFeatured: true, colors: ["Beige", "Gris", "Bordeaux"] },
  { slug: "haut-top-elegant-dounia", sku: "LZ-HAU-004", nameFr: "Top élégant Dounia", nameAr: "توب أنيق دنيا", descriptionFr: "Top ajusté à manches longues, parfait pour superposer sous une veste.", descriptionAr: "توب ضيق بأكمام طويلة، مثالي للطبقات تحت الجاكيت.", composition: "95% Coton, 5% Élasthanne", price: 179, categorySlug: "hauts", colors: ["Noir", "Blanc", "Vert"] },

  // Pantalons
  { slug: "pantalon-tailleur-lea", sku: "LZ-PAN-001", nameFr: "Pantalon tailleur Léa", nameAr: "بنطلون كلاسيكي ليا", descriptionFr: "Pantalon droit taille haute, coupe fluide qui structure la silhouette.", descriptionAr: "بنطلون مستقيم بخصر عالٍ، قصة انسيابية تبرز القوام بأناقة.", composition: "68% Polyester, 30% Viscose, 2% Élasthanne", price: 279, categorySlug: "pantalons", isFeatured: true, colors: ["Noir", "Beige", "Marron"] },
  { slug: "pantalon-large-nada", sku: "LZ-PAN-002", nameFr: "Pantalon large Nada", nameAr: "بنطلون واسع ندى", descriptionFr: "Pantalon large et fluide, ultra confortable, à associer avec un haut ajusté.", descriptionAr: "بنطلون واسع وانسيابي، مريح جداً، يُنسق مع قميص ضيق.", composition: "100% Viscose", price: 259, categorySlug: "pantalons", isNew: true, colors: ["Beige", "Noir"] },
  { slug: "pantalon-jean-mom-widad", sku: "LZ-PAN-003", nameFr: "Jean mom-fit Widad", nameAr: "بنطلون جينز واسع وداد", descriptionFr: "Jean coupe mom taille haute, style intemporel et confort assuré toute la journée.", descriptionAr: "بنطلون جينز بقصة واسعة وخصر عالٍ، ستايل خالد وراحة طوال اليوم.", composition: "99% Coton, 1% Élasthanne", price: 329, categorySlug: "pantalons", colors: ["Bleu"] },

  // Vestes & manteaux
  { slug: "veste-longue-elegance-sofia", sku: "LZ-VES-001", nameFr: "Veste longue Élégance Sofia", nameAr: "جاكيت طويل أناقة صوفيا", descriptionFr: "Veste longue à ceinture, coupe droite, parfaite en toute saison.", descriptionAr: "جاكيت طويل بحزام، قصة مستقيمة، مثالي في كل الفصول.", composition: "80% Polyester, 20% Viscose", price: 649, oldPrice: 799, categorySlug: "vestes-manteaux", isFeatured: true, colors: ["Camel", "Noir"] },
  { slug: "manteau-hiver-doux-imane", sku: "LZ-VES-002", nameFr: "Manteau d'hiver Imane", nameAr: "معطف شتوي إيمان", descriptionFr: "Manteau chaud et douillet, doublure intérieure, idéal pour les journées fraîches.", descriptionAr: "معطف دافئ ومريح ببطانة داخلية، مثالي للأيام الباردة.", composition: "60% Laine, 40% Polyester", price: 899, categorySlug: "vestes-manteaux", isNew: true, colors: ["Gris", "Noir", "Camel"] },
  { slug: "veste-jean-oversize-chaima", sku: "LZ-VES-003", nameFr: "Veste en jean oversize Chaima", nameAr: "جاكيت جينز واسع شيماء", descriptionFr: "Veste en jean coupe oversize, un basique intemporel à porter en toutes saisons.", descriptionAr: "جاكيت جينز بقصة واسعة، قطعة أساسية خالدة تُلبس في كل الفصول.", composition: "100% Coton", price: 389, categorySlug: "vestes-manteaux", colors: ["Bleu"] },

  // Accessoires
  { slug: "foulard-soie-doree", sku: "LZ-ACC-001", nameFr: "Foulard en soie dorée", nameAr: "وشاح حرير ذهبي", descriptionFr: "Foulard léger aux reflets dorés, idéal pour sublimer une tenue.", descriptionAr: "وشاح خفيف بلمسات ذهبية، مثالي لإضفاء لمسة أنيقة على الإطلالة.", composition: "100% Polyester", price: 129, categorySlug: "accessoires", isNew: true, colors: ["Doré", "Beige"] },
  { slug: "sac-main-cuir-lallazina", sku: "LZ-ACC-002", nameFr: "Sac à main LallaZina", nameAr: "حقيبة يد لالة زينة", descriptionFr: "Sac à main structuré en simili cuir, avec bandoulière amovible.", descriptionAr: "حقيبة يد بتصميم أنيق من الجلد الصناعي، مع حزام قابل للإزالة.", composition: "Simili cuir", price: 349, categorySlug: "accessoires", isFeatured: true, colors: ["Noir", "Beige", "Camel"] },
  { slug: "ceinture-doree-fine", sku: "LZ-ACC-003", nameFr: "Ceinture fine dorée", nameAr: "حزام رفيع ذهبي", descriptionFr: "Ceinture fine à boucle dorée, parfaite pour souligner la taille.", descriptionAr: "حزام رفيع بإبزيم ذهبي، مثالي لإبراز الخصر.", composition: "Simili cuir", price: 99, categorySlug: "accessoires", colors: ["Noir", "Camel"] },
];

const RETURN_FR =
  "Vous disposez de 14 jours après réception de votre commande pour demander un retour ou un échange. Les articles doivent être non portés, non lavés, avec leurs étiquettes d'origine. Les sous-vêtements et accessoires en promotion ne sont pas repris. Pour toute demande, contactez-nous sur WhatsApp avec votre numéro de commande. (Informations à confirmer par la boutique.)";
const RETURN_AR =
  "لديك 14 يوماً بعد استلام طلبك لطلب الإرجاع أو التبديل. يجب أن تكون المنتجات غير مستعملة وغير مغسولة، مع الحفاظ على البطاقات الأصلية. الملابس الداخلية والإكسسوارات المخفضة غير قابلة للإرجاع. لأي طلب، تواصلي معنا عبر واتساب مع ذكر رقم طلبك. (معلومات قابلة للتأكيد من طرف المتجر.)";

const SIZE_GUIDE = [
  { size: "XS", bust: "78-82", waist: "60-64", hips: "86-90" },
  { size: "S", bust: "83-87", waist: "65-69", hips: "91-95" },
  { size: "M", bust: "88-92", waist: "70-74", hips: "96-100" },
  { size: "L", bust: "93-98", waist: "75-80", hips: "101-106" },
  { size: "XL", bust: "99-105", waist: "81-87", hips: "107-113" },
  { size: "XXL", bust: "106-112", waist: "88-94", hips: "114-120" },
];

async function main() {
  console.log("Seeding database...");

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  const categories = await prisma.category.findMany();
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  for (const p of PRODUCTS) {
    const category = categoryBySlug[p.categorySlug];
    const images = [1, 2, 3].map((i) => `/images/product-${p.categorySlug}-${i}.jpg`);

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        sku: p.sku,
        nameFr: p.nameFr,
        nameAr: p.nameAr,
        descriptionFr: p.descriptionFr,
        descriptionAr: p.descriptionAr,
        composition: p.composition,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        images: JSON.stringify(images),
        categoryId: category.id,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        seoTitle: `${p.nameFr} — LallaZina`,
        seoDescription: p.descriptionFr,
      },
      create: {
        slug: p.slug,
        sku: p.sku,
        nameFr: p.nameFr,
        nameAr: p.nameAr,
        descriptionFr: p.descriptionFr,
        descriptionAr: p.descriptionAr,
        composition: p.composition,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        images: JSON.stringify(images),
        categoryId: category.id,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        seoTitle: `${p.nameFr} — LallaZina`,
        seoDescription: p.descriptionFr,
      },
    });

    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    const variantSizes = SIZES.slice(0, p.categorySlug === "accessoires" ? 1 : SIZES.length);
    const sizesForProduct = p.categorySlug === "accessoires" ? ["Taille unique"] : variantSizes;

    for (const size of sizesForProduct) {
      for (const color of p.colors) {
        const stock = Math.floor(Math.random() * 12) + (Math.random() > 0.85 ? 0 : 3);
        await prisma.productVariant.create({
          data: { productId: product.id, size, color, stock },
        });
      }
    }
  }

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsappNumber: "https://wa.me/message/MI6RIBZTHDILJ1",
      instagramUrl: "https://www.instagram.com/lallazina4?stkn=Z2tiN3QzM280Z3Zo&utm_source=qr",
      facebookUrl: "https://www.facebook.com/share/198VnFRVkf/?mibextid=wwXIfr",
      tiktokUrl: "https://www.tiktok.com/@lallazina4?_r=1&_t=ZS-99s9lsJuUuT",
      contactEmail: "contact@lallazina.ma",
      contactPhone: "212718149504",
      storeAddress: "JF4V+FFW، Avenue Souhaib Erroumi, Casablanca 20250",
      freeShippingThreshold: 500,
      deliveryFeesJson: JSON.stringify(DEFAULT_DELIVERY_FEES),
      returnPolicyTextFr: RETURN_FR,
      returnPolicyTextAr: RETURN_AR,
      sizeGuideJson: JSON.stringify(SIZE_GUIDE),
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@lallazina.ma";
  const adminPassword = process.env.ADMIN_PASSWORD || "LallaZina2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log(`Seed done. Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
