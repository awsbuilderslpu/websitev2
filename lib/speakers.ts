import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not configured");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export type Speaker = {
  id: string;
  name: string;
  bio: string | null;
  designation: string | null;
  company: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  x_url: string | null;
  website_url: string | null;
};

export async function getPublicSpeakers() {
  const { data, error } = await supabase
    .from("speakers")
    .select(
      `
        id,
        name,
        bio,
        designation,
        company,
        avatar_url,
        linkedin_url,
        github_url,
        x_url,
        website_url
      `,
    )
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Speaker[];
}

export async function getPublicSpeaker(id: string) {
  const { data, error } = await supabase
    .from("speakers")
    .select(
      `
        id,
        name,
        bio,
        designation,
        company,
        avatar_url,
        linkedin_url,
        github_url,
        x_url,
        website_url
      `,
    )
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Speaker | null;
}