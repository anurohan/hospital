import { requireRole } from "@/lib/auth/session";
import { listNotifications } from "@/lib/services/notifications";
import { markNotificationRead, markAllNotificationsRead } from "../actions";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await requireRole(["patient"]);
  const items = await listNotifications(session.id);
  const hasUnread = items.some((n) => !n.is_read);

  return (
    <div>
      <PageHeader
        title="Notifications"
        actions={
          hasUnread ? (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="btn btn-outline btn-sm">Mark all read</button>
            </form>
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <EmptyState title="No notifications" description="Updates about your appointments will appear here." />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => (
            <div key={n.id} className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${n.is_read ? "border-gray-200 bg-white" : "border-sky-200 bg-sky-50"}`}>
              <div>
                <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="mt-1 text-xs text-gray-400">{new Date(n.created_at).toLocaleString("en-IN")}</p>
              </div>
              {!n.is_read && (
                <form action={markNotificationRead}>
                  <input type="hidden" name="id" value={n.id} />
                  <button type="submit" className="text-xs text-sky-700 hover:underline">Mark read</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
