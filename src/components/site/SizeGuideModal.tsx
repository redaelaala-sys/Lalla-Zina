"use client";

import { useTranslations } from "next-intl";

export default function SizeGuideModal({
  open,
  onClose,
  sizeGuide,
}: {
  open: boolean;
  onClose: () => void;
  sizeGuide: { size: string; bust: string; waist: string; hips: string }[];
}) {
  const t = useTranslations("sizeGuide");
  const tc = useTranslations("common");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-2xl">{t("title")}</h3>
          <button onClick={onClose} aria-label={tc("close")} className="text-2xl leading-none">
            ×
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead>
              <tr className="border-b border-beige-dark/60">
                <th className="py-2 text-start font-semibold">{t("size")}</th>
                <th className="py-2 text-start font-semibold">{t("bust")}</th>
                <th className="py-2 text-start font-semibold">{t("waist")}</th>
                <th className="py-2 text-start font-semibold">{t("hips")}</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((row) => (
                <tr key={row.size} className="border-b border-beige-dark/30">
                  <td className="py-2 font-medium">{row.size}</td>
                  <td className="py-2">{row.bust}</td>
                  <td className="py-2">{row.waist}</td>
                  <td className="py-2">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-charcoal/50 mt-4">{t("note")}</p>
      </div>
    </div>
  );
}
