import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl">Produits</h1>
        <Link href="/admin/produits/nouveau" className="bg-charcoal text-white rounded-full px-6 py-2.5 text-sm font-semibold">
          + Ajouter un produit
        </Link>
      </div>

      <div className="bg-white border border-beige-dark/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige/40">
            <tr>
              <th className="text-start p-3">Photo</th>
              <th className="text-start p-3">Nom</th>
              <th className="text-start p-3">Référence</th>
              <th className="text-start p-3">Catégorie</th>
              <th className="text-start p-3">Prix</th>
              <th className="text-start p-3">Stock</th>
              <th className="text-start p-3">Statut</th>
              <th className="text-start p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const images: string[] = JSON.parse(p.images);
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-t border-beige-dark/20">
                  <td className="p-3">
                    <div className="relative w-12 h-14 rounded-md overflow-hidden bg-beige">
                      <Image src={images[0]} alt={p.nameFr} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-3 font-medium">{p.nameFr}</td>
                  <td className="p-3 text-charcoal/60">{p.sku}</td>
                  <td className="p-3 text-charcoal/60">{p.category.nameFr}</td>
                  <td className="p-3">{p.price} DH</td>
                  <td className={`p-3 ${stock === 0 ? "text-red-600" : ""}`}>{stock}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/produits/${p.id}`} className="text-xs underline">
                        Modifier
                      </Link>
                      <DeleteProductButton id={p.id} name={p.nameFr} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-sm text-charcoal/50">Aucun produit pour le moment.</p>
        )}
      </div>
    </div>
  );
}
