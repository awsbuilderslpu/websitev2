import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { CoreDashboard } from "@/components/dashboard/core-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");

  switch (user.role) {
    case "admin":
      return <AdminDashboard user={user} />;

    case "core":
      return <CoreDashboard user={user} />;

    default:
      return <UserDashboard user={user} />;
  }
}