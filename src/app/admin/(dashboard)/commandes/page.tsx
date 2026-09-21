import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

const STATUSES = ["Nouvelle", "Confirmée", "En préparation", "Expédiée", "Livrée", "Annulée", "Retour"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q } },
              { customerName: { contains: q } },
              { phone: { contains: q } },
              { city: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Commandes</h1>

      <form className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher (n°, nom, téléphone, ville)"
          className="border border-beige-dark/60 rounded-lg px-4 py-2 text-sm flex-1 min-w-48"
        />
        <select name="status" defaultValue={status || ""} className="border border-beige-dark/60 rounded-lg px-4 py-2 text-sm bg-white">
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-charcoal text-white rounded-lg px-5 py-2 text-sm">
          Filtrer
        </button>
      </form>

      <div className="bg-white border border-beige-dark/30 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-beige/40">
            <tr>
              <th className="text-start p-3">N° commande</th>
              <th className="text-start p-3">Date</th>
              <th className="text-start p-3">Cliente</th>
              <th className="text-start p-3">Téléphone</th>
              <th className="text-start p-3">Ville</th>
              <th className="text-start p-3">Montant</th>
              <th className="text-start p-3">Statut</th>
              <th className="text-start p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-beige-dark/20">
                <td className="p-3 font-medium">{o.orderNumber}</td>
                <td className="p-3 text-charcoal/60">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3 text-charcoal/60">{o.phone}</td>
                <td className="p-3 text-charcoal/60">{o.city}</td>
                <td className="p-3 font-medium">{o.total} DH</td>
                <td className="p-3">
                  <OrderStatusSelect id={o.id} status={o.status} />
                </td>
                <td className="p-3">
                  <Link href={`/admin/commandes/${o.id}`} className="text-xs underline">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-sm text-charcoal/50">Aucune commande trouvée.</p>
        )}
      </div>
    </div>
  );
}
