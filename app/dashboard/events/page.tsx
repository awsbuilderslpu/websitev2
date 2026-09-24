import { requireRole } from "@/lib/auth";
import { ManageEvents } from "@/components/dashboard/manage-events";

export default async function EventsManagePage() {
  await requireRole(["admin"], "/dashboard/events");

  return <ManageEvents />;
}