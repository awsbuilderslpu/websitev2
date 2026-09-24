import { notFound } from "next/navigation";

import { SpeakerForm } from "@/components/dashboard/speaker-form";
import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSpeakerPage({
  params,
}: PageProps) {
  await requireRole(["admin"], "/dashboard/speakers");

  const { id } = await params;

  const { data: speaker } = await supabaseServer
    .from("speakers")
    .select(`
      id,
      name,
      bio,
      designation,
      company,
      avatar_url,
      linkedin_url,
      github_url,
      x_url,
      website_url,
      is_public
    `)
    .eq("id", id)
    .maybeSingle();

  if (!speaker) {
    notFound();
  }

  return (
    <SpeakerForm
      mode="edit"
      speakerId={speaker.id}
      initialData={{
        name: speaker.name,
        bio: speaker.bio ?? "",
        designation: speaker.designation ?? "",
        company: speaker.company ?? "",
        avatar_url: speaker.avatar_url ?? "",
        linkedin_url: speaker.linkedin_url ?? "",
        github_url: speaker.github_url ?? "",
        x_url: speaker.x_url ?? "",
        website_url: speaker.website_url ?? "",
        is_public: speaker.is_public,
      }}
    />
  );
}