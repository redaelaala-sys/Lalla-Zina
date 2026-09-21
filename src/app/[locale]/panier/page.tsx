import CartPageClient from "@/components/site/CartPageClient";
import { getSettings } from "@/lib/settings";

export default async function CartPage() {
  const settings = await getSettings();
  return <CartPageClient settings={settings} />;
}
