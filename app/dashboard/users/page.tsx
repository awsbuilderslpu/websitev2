import { requireRole } from "@/lib/auth";
import { ManageUsers } from "@/components/dashboard/manage-users";

export default async function ManageUsersPage() {
  await requireRole(
    ["admin"],
    "/dashboard/users",
  );

  return <ManageUsers />;
}