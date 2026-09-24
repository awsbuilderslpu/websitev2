import { ManageSpeakers } from "@/components/dashboard/manage-speakers";
import { requireRole } from "@/lib/auth";

export default async function SpeakersManagePage() {
  await requireRole(["admin"], "/dashboard/speakers");

  return <ManageSpeakers />;
}