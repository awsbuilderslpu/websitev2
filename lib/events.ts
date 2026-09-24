import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not configured");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export type EventSpeaker = {
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

export type EventTalk = {
  id: string;
  title: string;
  description: string | null;
  talk_type: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  sort_order: number;
  speakers: EventSpeaker[];
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  event_type: string;
  location: string | null;
  online_url: string | null;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  is_paid: boolean;
  is_published: boolean;
  is_cancelled: boolean;
  cancelled_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  talks: EventTalk[];
};

const eventSelect = `
  id,
  title,
  slug,
  description,
  cover_image_url,
  event_type,
  location,
  online_url,
  start_at,
  end_at,
  registration_deadline,
  is_paid,
  is_published,
  is_cancelled,
  cancelled_at,
  created_by,
  created_at,
  updated_at,
  talks (
    id,
    title,
    description,
    talk_type,
    starts_at,
    ends_at,
    location,
    sort_order,
    talk_speakers (
      sort_order,
      speakers (
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
      )
    )
  )
`;

function normalizeEvent(event: any): Event {
  const talks = [...(event.talks ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((talk) => ({
      id: talk.id,
      title: talk.title,
      description: talk.description,
      talk_type: talk.talk_type,
      starts_at: talk.starts_at,
      ends_at: talk.ends_at,
      location: talk.location,
      sort_order: talk.sort_order,
      speakers: [...(talk.talk_speakers ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.speakers)
        .filter(Boolean),
    }));

  return {
    ...event,
    talks,
  };
}

export async function getPublicEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(eventSelect)
    .eq("is_published", true)
    .eq("is_cancelled", false)
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeEvent);
}

export async function getPublicEvent(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select(eventSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_cancelled", false)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return normalizeEvent(data);
}