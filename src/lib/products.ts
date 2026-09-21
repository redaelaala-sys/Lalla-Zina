import { prisma } from "@/lib/prisma";
import type { Product, ProductVariant, Category } from "@prisma/client";

export type ProductWithRelations = Product & {
  category: Category;
  variants: ProductVariant[];
};

export type ProductCard = {
  id: string;
  slug: string;
  sku: string;
  nameFr: string;
  nameAr: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  categorySlug: string;
  isNew: boolean;
  isFeatured: boolean;
  sizes: string[];
  colors: string[];
  inStock: boolean;
};

export function toProductCard(p: ProductWithRelations): ProductCard {
  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));
  const colors = Array.from(new Set(p.variants.map((v) => v.color)));
  const inStock = p.variants.some((v) => v.stock > 0);
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    nameFr: p.nameFr,
    nameAr: p.nameAr,
    price: p.price,
    oldPrice: p.oldPrice,
    images: JSON.parse(p.images),
    categorySlug: p.category.slug,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    sizes,
    colors,
    inStock,
  };
}

export type ShopFilters = {
  category?: string;
  sizes?: string[];
  colors?: string[];
  priceRange?: string;
  availability?: "in" | "out";
  onSale?: boolean;
  search?: string;
  sort?: "new" | "best" | "price-asc" | "price-desc" | "promo";
};

const PRICE_RANGES: Record<string, [number, number]> = {
  under200: [0, 200],
  "200to300": [200, 300],
  "300to500": [300, 500],
  "500to800": [500, 800],
  over800: [800, Infinity],
};

export async function getFilteredProducts(filters: ShopFilters) {
  const all = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  let cards = all.map(toProductCard);

  if (filters.category) {
    cards = cards.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.sizes?.length) {
    cards = cards.filter((p) => filters.sizes!.some((s) => p.sizes.includes(s)));
  }
  if (filters.colors?.length) {
    cards = cards.filter((p) => filters.colors!.some((c) => p.colors.includes(c)));
  }
  if (filters.priceRange && PRICE_RANGES[filters.priceRange]) {
    const [min, max] = PRICE_RANGES[filters.priceRange];
    cards = cards.filter((p) => p.price >= min && p.price <= max);
  }
  if (filters.availability === "in") {
    cards = cards.filter((p) => p.inStock);
  } else if (filters.availability === "out") {
    cards = cards.filter((p) => !p.inStock);
  }
  if (filters.onSale) {
    cards = cards.filter((p) => p.oldPrice && p.oldPrice > p.price);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    cards = cards.filter(
      (p) =>
        p.nameFr.toLowerCase().includes(q) ||
        p.nameAr.includes(filters.search!) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "price-asc":
      cards.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      cards.sort((a, b) => b.price - a.price);
      break;
    case "promo":
      cards = cards.filter((p) => p.oldPrice && p.oldPrice > p.price);
      break;
    case "best":
      cards.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
    case "new":
    default:
      cards.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
  }

  return cards;
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, variants: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: { category: true, variants: true },
    take,
  });
  return products.map(toProductCard);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getNewArrivals(take = 8) {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
    take,
  });
  return products.map(toProductCard);
}

export async function getBestSellers(take = 8) {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true, variants: true },
    take,
  });
  return products.map(toProductCard);
}

export async function getPromoProducts(take = 8) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, variants: true },
  });
  return products
    .map(toProductCard)
    .filter((p) => p.oldPrice && p.oldPrice > p.price)
    .slice(0, take);
}
