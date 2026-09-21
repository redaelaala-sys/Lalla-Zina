"use client";

import { useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppFloatButton({ phoneNumber }: { phoneNumber: string }) {
  const tw = useTranslations("whatsappMessages");
  const href = buildWhatsAppLink(phoneNumber, tw("general"));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 end-5 z-50 bg-[#25D366] text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.37 5.07L2 22l5.2-1.47a9.86 9.86 0 0 0 4.84 1.24h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.12h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.87.83-3.02-.2-.31a8.19 8.19 0 0 1-1.26-4.42c0-4.53 3.69-8.22 8.23-8.22 4.53 0 8.21 3.69 8.21 8.22 0 4.53-3.68 8.21-8.22 8.21zm4.51-6.16c-.25-.12-1.46-.72-1.68-.81-.23-.08-.39-.12-.56.13-.16.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
      </svg>
    </a>
  );
}
