import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
