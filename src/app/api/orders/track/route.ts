import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber")?.trim();
  const phone = request.nextUrl.searchParams.get("phone")?.trim();

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order || !order.phone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-8))) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    city: order.city,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({ name: i.name, size: i.size, color: i.color, qty: i.qty })),
  });
}
