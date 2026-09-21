import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { variants: true } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Modifier le produit</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          slug: product.slug,
          sku: product.sku,
          nameFr: product.nameFr,
          nameAr: product.nameAr,
          descriptionFr: product.descriptionFr,
          descriptionAr: product.descriptionAr,
          composition: product.composition || "",
          price: product.price,
          oldPrice: product.oldPrice,
          images: JSON.parse(product.images),
          categoryId: product.categoryId,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
          variants: product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock })),
        }}
      />
    </div>
  );
}
