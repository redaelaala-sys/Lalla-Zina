export type DeliveryFees = Record<string, number> & { _default: number };

export function getDeliveryFee(fees: DeliveryFees, city: string, subtotal: number, freeShippingThreshold: number): number {
  if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) return 0;
  const normalized = city.trim().toLowerCase();
  const match = Object.keys(fees).find((key) => key.toLowerCase() === normalized);
  if (match) return fees[match];
  return fees._default ?? 35;
}

export const DEFAULT_DELIVERY_FEES: DeliveryFees = {
  Casablanca: 25,
  Rabat: 25,
  Marrakech: 30,
  Agadir: 35,
  Tanger: 30,
  Fès: 30,
  Meknès: 30,
  Oujda: 40,
  Kénitra: 30,
  Tétouan: 35,
  _default: 40,
};
