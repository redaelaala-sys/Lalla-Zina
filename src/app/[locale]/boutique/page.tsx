import { getTranslations } from "next-intl/server";
import ProductCard from "@/components/site/ProductCard";
import ShopFilters from "@/components/site/ShopFilters";
import SortBar from "@/components/site/SortBar";
import { getCategories, getFilteredProducts, type ShopFilters as Filters } from "@/lib/products";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const t = await getTranslations("shop");

  const asArray = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v : v ? [v] : [];
  const asString = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const filters: Filters = {
    category: asString(sp.category),
    sizes: asArray(sp.size),
    colors: asArray(sp.color),
    priceRange: asString(sp.price),
    availability: asString(sp.availability) as "in" | "out" | undefined,
    onSale: sp.sale === "1",
    search: asString(sp.search),
    sort: (asString(sp.sort) as Filters["sort"]) || "new",
  };

  const [categories, products] = await Promise.all([
    getCategories(),
    getFilteredProducts(filters),
  ]);

  return (
    <div className="container-site py-10">
      <h1 className="font-heading text-3xl md:text-4xl text-center mb-10">{t("title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <aside>
          <ShopFilters categories={categories} />
        </aside>
        <div>
          <SortBar resultsCount={products.length} />
          {products.length === 0 ? (
            <p className="text-center text-charcoal/60 py-20">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
