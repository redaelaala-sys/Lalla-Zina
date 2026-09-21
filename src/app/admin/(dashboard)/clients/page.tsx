import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  const clientsByPhone = new Map<
    string,
    { name: string; phone: string; city: string; count: number; total: number; lastOrder: Date }
  >();

  for (const o of orders) {
    const key = o.phone.replace(/\D/g, "");
    const existing = clientsByPhone.get(key);
    if (existing) {
      existing.count += 1;
      existing.total += o.total;
      if (o.createdAt > existing.lastOrder) existing.lastOrder = o.createdAt;
    } else {
      clientsByPhone.set(key, {
        name: o.customerName,
        phone: o.phone,
        city: o.city,
        count: 1,
        total: o.total,
        lastOrder: o.createdAt,
      });
    }
  }

  const clients = [...clientsByPhone.values()].sort((a, b) => b.lastOrder.getTime() - a.lastOrder.getTime());

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Clientes</h1>
      <div className="bg-white border border-beige-dark/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige/40">
            <tr>
              <th className="text-start p-3">Nom</th>
              <th className="text-start p-3">Téléphone</th>
              <th className="text-start p-3">Ville</th>
              <th className="text-start p-3">Nb. commandes</th>
              <th className="text-start p-3">Total achats</th>
              <th className="text-start p-3">Dernière commande</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.phone} className="border-t border-beige-dark/20">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-charcoal/60">{c.phone}</td>
                <td className="p-3 text-charcoal/60">{c.city}</td>
                <td className="p-3">{c.count}</td>
                <td className="p-3 font-medium">{c.total} DH</td>
                <td className="p-3 text-charcoal/60">{c.lastOrder.toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="p-8 text-center text-sm text-charcoal/50">Aucune cliente pour le moment.</p>
        )}
      </div>
    </div>
  );
}
