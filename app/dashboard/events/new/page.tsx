import { EventForm } from "@/components/dashboard/event-form";
import { requireRole } from "@/lib/auth";

export default async function CreateEventPage() {
  await requireRole(["admin"], "/dashboard/events/new");

  return <EventForm mode="create" />;
}