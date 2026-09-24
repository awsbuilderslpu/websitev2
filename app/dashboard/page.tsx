import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { CoreDashboard } from "@/components/dashboard/core-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");

  if (user.role === "admin") {
    return <AdminDashboard user={user} />;
  }

  if (user.role === "core") {
    return <CoreDashboard user={user} />;
  }

  return <UserDashboard user={user} />;
}