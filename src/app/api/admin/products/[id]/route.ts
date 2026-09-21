import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const variantSchema = z.object({ size: z.string().min(1), color: z.string().min(1), stock: z.number().int().min(0) });

const productSchema = z.object({
  slug: z.string().min(2),
  sku: z.string().min(2),
  nameFr: z.string().min(2),
  nameAr: z.string().min(1),
  descriptionFr: z.string().default(""),
  descriptionAr: z.string().default(""),
  composition: z.string().optional(),
  price: z.number().positive(),
  oldPrice: z.number().positive().nullable().optional(),
  images: z.array(z.string()).min(1),
  categoryId: z.string().min(1),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  variants: z.array(variantSchema).default([]),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });
  if (!product) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const duplicate = await prisma.product.findFirst({ where: { slug: data.slug, id: { not: id } } });
  if (duplicate) {
    return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  }

  await prisma.productVariant.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: data.slug,
      sku: data.sku,
      nameFr: data.nameFr,
      nameAr: data.nameAr,
      descriptionFr: data.descriptionFr,
      descriptionAr: data.descriptionAr,
      composition: data.composition,
      price: data.price,
      oldPrice: data.oldPrice ?? null,
      images: JSON.stringify(data.images),
      categoryId: data.categoryId,
      isNew: data.isNew,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      variants: { create: data.variants },
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
