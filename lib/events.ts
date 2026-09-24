import { supabaseServer } from "@/lib/supabase/server";

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

type RawSpeaker = {
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

type RawTalkSpeaker = {
  sort_order: number;
  speakers: RawSpeaker[] | null;
};

type RawTalk = {
  id: string;
  title: string;
  description: string | null;
  talk_type: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  sort_order: number;
  talk_speakers: RawTalkSpeaker[] | null;
};

type RawEvent = {
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
  talks: RawTalk[] | null;
};

function normalizeEvent(event: RawEvent): Event {
  const talks = [...(event.talks ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((talk) => {
      const speakers = [...(talk.talk_speakers ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .flatMap((item) => item.speakers ?? []);

      return {
        id: talk.id,
        title: talk.title,
        description: talk.description,
        talk_type: talk.talk_type,
        starts_at: talk.starts_at,
        ends_at: talk.ends_at,
        location: talk.location,
        sort_order: talk.sort_order,
        speakers,
      };
    });

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    cover_image_url: event.cover_image_url,
    event_type: event.event_type,
    location: event.location,
    online_url: event.online_url,
    start_at: event.start_at,
    end_at: event.end_at,
    registration_deadline: event.registration_deadline,
    is_paid: event.is_paid,
    is_published: event.is_published,
    is_cancelled: event.is_cancelled,
    cancelled_at: event.cancelled_at,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at,
    talks,
  };
}

export async function getPublicEvents(): Promise<Event[]> {
  const { data, error } = await supabaseServer
    .from("events")
    .select(eventSelect)
    .eq("is_published", true)
    .eq("is_cancelled", false)
    .order("start_at", {
      ascending: true,
    });

  if (error) {
    console.error("Failed to fetch public events:", error);
    throw new Error(error.message);
  }

  return normalizeEvents(data);
}

export async function getPublicEvent(
  slug: string,
): Promise<Event | null> {
  const { data, error } = await supabaseServer
    .from("events")
    .select(eventSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_cancelled", false)
    .maybeSingle();

  if (error) {
    console.error(
      `Failed to fetch public event "${slug}":`,
      error,
    );

    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return normalizeEvent(data);
}

function normalizeEvents(data: unknown): Event[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) =>
    normalizeEvent(item as RawEvent),
  );
}