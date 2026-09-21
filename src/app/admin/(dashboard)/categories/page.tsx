import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/admin/CategoryCard";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-3xl mb-2">Catégories</h1>
      <p className="text-sm text-charcoal/50 mb-8">
        Photos et noms affichés sur la page d'accueil et dans les filtres de la boutique.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
