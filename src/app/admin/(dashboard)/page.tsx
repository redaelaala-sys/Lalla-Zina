import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay();
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d: Date) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const [orders, items] = await Promise.all([
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
  ]);

  const validOrders = orders.filter((o) => o.status !== "Annulée");
  const revenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const ordersToday = orders.filter((o) => o.createdAt >= startOfDay(now)).length;
  const ordersWeek = orders.filter((o) => o.createdAt >= startOfWeek(now)).length;
  const ordersMonth = orders.filter((o) => o.createdAt >= startOfMonth(now)).length;
  const avgBasket = validOrders.length > 0 ? Math.round(revenue / validOrders.length) : 0;
  const cancelled = orders.filter((o) => o.status === "Annulée").length;
  const cancelRate = totalOrders > 0 ? Math.round((cancelled / totalOrders) * 100) : 0;

  const salesByProduct = new Map<string, number>();
  for (const i of items) {
    salesByProduct.set(i.name, (salesByProduct.get(i.name) || 0) + i.qty);
  }
  const topProducts = [...salesByProduct.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const ordersByCity = new Map<string, number>();
  for (const o of orders) {
    ordersByCity.set(o.city, (ordersByCity.get(o.city) || 0) + 1);
  }
  const topCities = [...ordersByCity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "Chiffre d'affaires", value: `${revenue} DH` },
    { label: "Commandes totales", value: totalOrders },
    { label: "Commandes aujourd'hui", value: ordersToday },
    { label: "Commandes cette semaine", value: ordersWeek },
    { label: "Commandes ce mois", value: ordersMonth },
    { label: "Panier moyen", value: `${avgBasket} DH` },
    { label: "Taux d'annulation", value: `${cancelRate}%` },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-beige-dark/30 rounded-xl p-5">
            <p className="text-xs text-charcoal/50 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-beige-dark/30 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Produits les plus vendus</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-charcoal/50">Aucune vente encore.</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map(([name, qty]) => (
                <li key={name} className="flex items-center justify-between text-sm">
                  <span className="truncate">{name}</span>
                  <span className="font-semibold shrink-0 ms-3">{qty} vendus</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-beige-dark/30 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Villes avec le plus de commandes</h2>
          {topCities.length === 0 ? (
            <p className="text-sm text-charcoal/50">Aucune commande encore.</p>
          ) : (
            <ul className="space-y-3">
              {topCities.map(([city, count]) => (
                <li key={city} className="flex items-center justify-between text-sm">
                  <span>{city}</span>
                  <span className="font-semibold">{count} commandes</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
