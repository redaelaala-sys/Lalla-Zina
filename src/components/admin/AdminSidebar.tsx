"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/produits", label: "Produits", icon: "👗" },
  { href: "/admin/categories", label: "Catégories", icon: "🏷️" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/clients", label: "Clientes", icon: "👥" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/parametres", label: "Paramètres", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full md:w-60 md:min-h-screen bg-charcoal text-ivory md:fixed md:inset-y-0 md:start-0">
      <div className="p-6">
        <p className="font-heading text-2xl">LallaZina</p>
        <p className="text-xs text-ivory/50">Administration</p>
      </div>
      <nav className="px-3 space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active ? "bg-white/10 text-white font-medium" : "text-ivory/70 hover:bg-white/5"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 mt-6">
        <button
          onClick={logout}
          className="w-full text-start px-3 py-2.5 rounded-lg text-sm text-ivory/60 hover:bg-white/5 transition"
        >
          ↩ Déconnexion
        </button>
      </div>
    </aside>
  );
}
