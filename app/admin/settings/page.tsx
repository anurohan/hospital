import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { adminListSettings } from "@/lib/services/admin";
import { updateSetting } from "../actions";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export const metadata = { title: "Settings — Admin" };

const KNOWN_KEYS = [
  "opd_hours", "emergency_hours", "pharmacy_hours", "appointment_advance_days",
  "cancellation_hours_before", "allow_reschedule", "max_reschedule_count",
  "walk_in_enabled", "online_booking_enabled", "auto_confirm_online",
  "sms_notifications", "email_notifications", "whatsapp_notifications",
];

export default async function AdminSettingsPage() {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  if (!hospitalId) return <EmptyState title="Hospital not configured" description="Connect the database to manage settings." />;

  const settings = await adminListSettings(hospitalId);
  const map = new Map(settings.map((s) => [s.setting_key, s.setting_value ?? ""]));
  const keys = Array.from(new Set([...KNOWN_KEYS, ...settings.map((s) => s.setting_key)]));

  return (
    <div>
      <PageHeader title="Hospital settings" description="Operational configuration for this hospital." />
      <div className="max-w-2xl divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {keys.map((key) => (
          <form key={key} action={updateSetting} className="flex items-center gap-3 px-4 py-3">
            <label className="w-56 shrink-0 text-sm font-medium text-gray-700">{key}</label>
            <input type="hidden" name="key" value={key} />
            <input name="value" defaultValue={map.get(key) ?? ""} className="input flex-1" />
            <button type="submit" className="btn btn-outline btn-sm">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
