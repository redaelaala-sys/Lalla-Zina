import CheckoutClient from "@/components/site/CheckoutClient";
import { getSettings } from "@/lib/settings";

export default async function CheckoutPage() {
  const settings = await getSettings();
  return <CheckoutClient settings={settings} />;
}
