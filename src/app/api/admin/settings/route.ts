import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSettings, invalidateSettingsCache } from "@/lib/settings";

const schema = z.object({
  whatsappNumber: z.string().min(6),
  instagramUrl: z.string().url().or(z.literal("")),
  facebookUrl: z.string().url().or(z.literal("")),
  tiktokUrl: z.string().url().or(z.literal("")),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(6),
  storeAddress: z.string().min(2),
  freeShippingThreshold: z.number().min(0),
  deliveryFees: z.record(z.string(), z.number()),
  returnPolicyTextFr: z.string(),
  returnPolicyTextAr: z.string(),
  sizeGuide: z.array(
    z.object({ size: z.string(), bust: z.string(), waist: z.string(), hips: z.string() })
  ),
  heroImage: z.string().min(1),
  promoBannerImage: z.string().min(1),
  aboutImage: z.string().min(1),
});

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const shared = {
    whatsappNumber: data.whatsappNumber,
    instagramUrl: data.instagramUrl,
    facebookUrl: data.facebookUrl,
    tiktokUrl: data.tiktokUrl,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    storeAddress: data.storeAddress,
    freeShippingThreshold: data.freeShippingThreshold,
    deliveryFeesJson: JSON.stringify(data.deliveryFees),
    returnPolicyTextFr: data.returnPolicyTextFr,
    returnPolicyTextAr: data.returnPolicyTextAr,
    sizeGuideJson: JSON.stringify(data.sizeGuide),
    heroImage: data.heroImage,
    promoBannerImage: data.promoBannerImage,
    aboutImage: data.aboutImage,
  };

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: shared,
    create: { id: "singleton", ...shared },
  });

  invalidateSettingsCache();
  return NextResponse.json({ ok: true });
}
