import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().min(2),
  message: z.string().min(5),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      subject: data.subject,
      message: data.message,
    },
  });
  return NextResponse.json({ ok: true });
}
