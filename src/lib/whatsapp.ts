/**
 * Accepts either a plain phone number (e.g. "212600000000") or a full
 * WhatsApp link (e.g. "https://wa.me/message/XXXX" business shortlink)
 * and returns a link with the pre-filled message appended.
 */
export function buildWhatsAppLink(target: string, message: string): string {
  const encoded = encodeURIComponent(message);

  if (/^https?:\/\//i.test(target)) {
    const separator = target.includes("?") ? "&" : "?";
    return `${target}${separator}text=${encoded}`;
  }

  const digits = target.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function isWhatsAppLink(target: string): boolean {
  return /^https?:\/\//i.test(target);
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}
