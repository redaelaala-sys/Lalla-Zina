"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import LanguageSwitcher from "./LanguageSwitcher";
import type { SiteSettings } from "@/lib/settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const CATEGORY_LINKS = [
  { slug: "robes", key: "dresses" as const },
  { slug: "ensembles", key: "sets" as const },
  { slug: "pantalons", key: "pants" as const },
  { slug: "hauts", key: "tops" as const },
  { slug: "vestes-manteaux", key: "jackets" as const },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("nav");
  const th = useTranslations("header");
  const tb = useTranslations("brand");
  const tw = useTranslations("whatsappMessages");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clothingOpen, setClothingOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = useCartStore((s) => s.count());

  const isActive = (href: string) => pathname === href;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/boutique?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-beige-dark/40">
      <div className="container-site flex items-center justify-between h-18 py-3">
        <Link href="/" className="font-heading text-2xl md:text-3xl tracking-wide text-charcoal">
          {tb("name")}
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <Link href="/" className={isActive("/") ? "text-rose-dark" : "hover:text-rose-dark transition"}>
            {t("home")}
          </Link>
          <Link href="/boutique?sort=new" className="hover:text-rose-dark transition">
            {t("new")}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setClothingOpen(true)}
            onMouseLeave={() => setClothingOpen(false)}
          >
            <button className="hover:text-rose-dark transition flex items-center gap-1">
              {t("clothing")}
              <span className="text-xs">▾</span>
            </button>
            {clothingOpen && (
              <div className="absolute top-full start-0 bg-white shadow-lg rounded-md py-2 min-w-48 border border-beige-dark/30">
                {CATEGORY_LINKS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/boutique?category=${c.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-beige/60"
                  >
                    {t(c.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/boutique?category=accessoires" className="hover:text-rose-dark transition">
            {t("accessories")}
          </Link>
          <Link href="/boutique?sort=promo" className="text-rose-dark font-semibold hover:text-rose-dark/80 transition">
            {t("promotions")}
          </Link>
          <Link href="/contact" className="hover:text-rose-dark transition">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            aria-label={th("search")}
            onClick={() => setSearchOpen((v) => !v)}
            className="hidden sm:inline-flex hover:text-rose-dark transition"
          >
            <SearchIcon />
          </button>
          <Link href="/suivi-commande" aria-label={th("account")} className="hidden sm:inline-flex hover:text-rose-dark transition">
            <AccountIcon />
          </Link>
          <a
            href={buildWhatsAppLink(settings.whatsappNumber, tw("general"))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={th("whatsapp")}
            className="hidden sm:inline-flex text-[#25D366] hover:opacity-80 transition"
          >
            <WhatsAppIcon />
          </a>
          <Link href="/panier" aria-label={th("cart")} className="relative hover:text-rose-dark transition">
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-2 -end-2 bg-rose-dark text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <LanguageSwitcher />
          <button
            aria-label={th("menu")}
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-beige-dark/40 bg-white">
          <form onSubmit={submitSearch} className="container-site py-3 flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={th("searchPlaceholder")}
              className="flex-1 border border-beige-dark/60 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose"
            />
            <button type="submit" className="bg-charcoal text-white rounded-full px-5 py-2 text-sm">
              {th("search")}
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-beige-dark/40 bg-white">
          <nav className="container-site py-4 flex flex-col gap-1 text-sm">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-2.5">
              {t("home")}
            </Link>
            <Link href="/boutique?sort=new" onClick={() => setMobileOpen(false)} className="py-2.5">
              {t("new")}
            </Link>
            <button
              className="py-2.5 flex items-center justify-between"
              onClick={() => setClothingOpen((v) => !v)}
            >
              {t("clothing")} <span>{clothingOpen ? "−" : "+"}</span>
            </button>
            {clothingOpen && (
              <div className="ps-4 flex flex-col gap-1 border-s-2 border-beige-dark/50">
                {CATEGORY_LINKS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/boutique?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm text-charcoal/80"
                  >
                    {t(c.key)}
                  </Link>
                ))}
              </div>
            )}
            <Link href="/boutique?category=accessoires" onClick={() => setMobileOpen(false)} className="py-2.5">
              {t("accessories")}
            </Link>
            <Link href="/boutique?sort=promo" onClick={() => setMobileOpen(false)} className="py-2.5 text-rose-dark font-semibold">
              {t("promotions")}
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2.5">
              {t("contact")}
            </Link>
            <Link href="/suivi-commande" onClick={() => setMobileOpen(false)} className="py-2.5">
              {th("account")}
            </Link>
            <a
              href={buildWhatsAppLink(settings.whatsappNumber, tw("general"))}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 text-[#128C7E] font-medium"
            >
              {th("whatsapp")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.37 5.07L2 22l5.2-1.47a9.86 9.86 0 0 0 4.84 1.24h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.12h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.87.83-3.02-.2-.31a8.19 8.19 0 0 1-1.26-4.42c0-4.53 3.69-8.22 8.23-8.22 4.53 0 8.21 3.69 8.21 8.22 0 4.53-3.68 8.21-8.22 8.21zm4.51-6.16c-.25-.12-1.46-.72-1.68-.81-.23-.08-.39-.12-.56.13-.16.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}
