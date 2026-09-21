import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Paramètres</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
