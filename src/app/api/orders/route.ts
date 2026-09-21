import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getDeliveryFee } from "@/lib/delivery";

const orderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  whatsapp: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(3),
  neighborhood: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        size: z.string(),
        color: z.string(),
        qty: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
});

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LZ${y}${m}-${rand}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const settings = await getSettings();
  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = getDeliveryFee(settings.deliveryFees, data.city, subtotal, settings.freeShippingThreshold);
  const total = subtotal + shippingFee;

  let orderNumber = generateOrderNumber();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.order.findUnique({ where: { orderNumber } });
    if (!exists) break;
    orderNumber = generateOrderNumber();
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      city: data.city,
      address: data.address,
      neighborhood: data.neighborhood,
      postalCode: data.postalCode,
      notes: data.notes,
      subtotal,
      shippingFee,
      total,
      status: "Nouvelle",
      paymentMethod: "COD",
      items: {
        create: data.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          color: i.color,
          qty: i.qty,
          unitPrice: i.price,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ orderNumber: order.orderNumber, total: order.total, shippingFee: order.shippingFee });
}
