import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Messages de contact</h1>
      <div className="space-y-4 max-w-3xl">
        {messages.map((m) => (
          <div key={m.id} className="bg-white border border-beige-dark/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">{m.subject}</p>
              <span className="text-xs text-charcoal/40">{new Date(m.createdAt).toLocaleString("fr-FR")}</span>
            </div>
            <p className="text-sm text-charcoal/70 mb-3">{m.message}</p>
            <p className="text-xs text-charcoal/50">
              {m.name} · {m.phone} {m.email ? `· ${m.email}` : ""}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-charcoal/50">Aucun message pour le moment.</p>
        )}
      </div>
    </div>
  );
}
