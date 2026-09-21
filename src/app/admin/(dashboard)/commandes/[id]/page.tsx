import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/commandes" className="text-sm underline text-charcoal/60">
        ← Retour aux commandes
      </Link>
      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="font-heading text-3xl">Commande {order.orderNumber}</h1>
        <OrderStatusSelect id={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-beige-dark/30 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Cliente</h2>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-charcoal/60">{order.phone}</p>
          {order.whatsapp && order.whatsapp !== order.phone && (
            <p className="text-sm text-charcoal/60">WhatsApp : {order.whatsapp}</p>
          )}
        </div>
        <div className="bg-white border border-beige-dark/30 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Livraison</h2>
          <p className="text-sm">{order.address}</p>
          {order.neighborhood && <p className="text-sm text-charcoal/60">{order.neighborhood}</p>}
          <p className="text-sm text-charcoal/60">
            {order.city} {order.postalCode}
          </p>
        </div>
      </div>

      {order.notes && (
        <div className="bg-beige/40 rounded-xl p-4 mb-8 text-sm">
          <span className="font-semibold">Notes : </span>
          {order.notes}
        </div>
      )}

      <div className="bg-white border border-beige-dark/30 rounded-xl overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-beige/40">
            <tr>
              <th className="text-start p-3">Produit</th>
              <th className="text-start p-3">Taille</th>
              <th className="text-start p-3">Couleur</th>
              <th className="text-start p-3">Qté</th>
              <th className="text-start p-3">Prix</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id} className="border-t border-beige-dark/20">
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.size}</td>
                <td className="p-3">{i.color}</td>
                <td className="p-3">{i.qty}</td>
                <td className="p-3">{i.unitPrice} DH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-charcoal/60">Sous-total</span>
            <span>{order.subtotal} DH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/60">Livraison</span>
            <span>{order.shippingFee} DH</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-beige-dark/40 pt-2">
            <span>Total</span>
            <span>{order.total} DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
