import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lallazina.ma";
const LOCALES = ["fr", "ar"];
const STATIC_PATHS = [
  "",
  "/boutique",
  "/panier",
  "/livraison",
  "/retours-echanges",
  "/a-propos",
  "/contact",
  "/faq",
  "/cgv",
  "/confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Sitemap: could not read products from the database", error);
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${BASE_URL}/${locale}${path}`, changeFrequency: "weekly" });
    }
    for (const p of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/produit/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
      });
    }
  }

  return entries;
}
