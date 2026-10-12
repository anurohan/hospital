import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/kit";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await requireRole(["patient"]);
  return (
    <div>
      <PageHeader title="My profile" description="Keep your contact details up to date." />
      <ProfileForm
        fullName={session.profile.full_name}
        phone={session.profile.phone ?? ""}
        email={session.email ?? session.profile.email ?? ""}
      />
    </div>
  );
}
