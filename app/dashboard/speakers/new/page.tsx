import { SpeakerForm } from "@/components/dashboard/speaker-form";
import { requireRole } from "@/lib/auth";

export default async function NewSpeakerPage() {
  await requireRole(["admin"], "/dashboard/speakers/new");

  return <SpeakerForm mode="create" />;
}