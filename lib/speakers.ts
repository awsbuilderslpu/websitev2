import { supabaseServer } from "@/lib/supabase/server";

export type SpeakerTalk = {
  id: string;
  title: string;
  description: string | null;
  talk_type: string;
  starts_at: string | null;
  ends_at: string | null;
  event: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

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
  talks_count: number;
};

export type PublicSpeaker = Omit<Speaker, "talks_count"> & {
  talks_count: number;
  talks: SpeakerTalk[];
};

export async function getPublicSpeakers(): Promise<
  Speaker[]
> {
  const { data, error } = await supabaseServer
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
      talk_speakers(count)
    `)
    .eq("is_public", true)
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to fetch public speakers:",
      error,
    );

    throw new Error(error.message);
  }

  return (data ?? []).map((speaker) => ({
    id: speaker.id,
    name: speaker.name,
    bio: speaker.bio,
    designation: speaker.designation,
    company: speaker.company,
    avatar_url: speaker.avatar_url,
    linkedin_url: speaker.linkedin_url,
    github_url: speaker.github_url,
    x_url: speaker.x_url,
    website_url: speaker.website_url,
    talks_count:
      speaker.talk_speakers?.[0]?.count ?? 0,
  }));
}

export async function getPublicSpeaker(
  id: string,
): Promise<PublicSpeaker | null> {
  const { data: speaker, error: speakerError } =
    await supabaseServer
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
      .eq("is_public", true)
      .maybeSingle();

  if (speakerError) {
    console.error(
      `Failed to fetch speaker "${id}":`,
      speakerError,
    );

    throw new Error(speakerError.message);
  }

  if (!speaker) {
    return null;
  }

  const { data: talkRows, error: talksError } =
    await supabaseServer
      .from("talk_speakers")
      .select(`
        sort_order,
        talks!inner (
          id,
          title,
          description,
          talk_type,
          starts_at,
          ends_at,
          events!inner (
            id,
            title,
            slug,
            is_published,
            is_cancelled
          )
        )
      `)
      .eq("speaker_id", id)
      .eq("talks.events.is_published", true)
      .eq("talks.events.is_cancelled", false)
      .order("sort_order", {
        ascending: true,
      });

  if (talksError) {
    console.error(
      `Failed to fetch talks for speaker "${id}":`,
      talksError,
    );

    throw new Error(talksError.message);
  }

  const talks = (talkRows ?? [])
    .map((row) => {
      const talk = Array.isArray(row.talks)
        ? row.talks[0]
        : row.talks;

      if (!talk) {
        return null;
      }

      const event = Array.isArray(talk.events)
        ? talk.events[0]
        : talk.events;

      return {
        id: talk.id,
        title: talk.title,
        description: talk.description,
        talk_type: talk.talk_type,
        starts_at: talk.starts_at,
        ends_at: talk.ends_at,
        event: event
          ? {
              id: event.id,
              title: event.title,
              slug: event.slug,
            }
          : null,
      };
    })
    .filter(
      (talk): talk is SpeakerTalk =>
        talk !== null,
    );

  talks.sort((a, b) => {
    const aTime = a.starts_at
      ? new Date(a.starts_at).getTime()
      : Number.MAX_SAFE_INTEGER;

    const bTime = b.starts_at
      ? new Date(b.starts_at).getTime()
      : Number.MAX_SAFE_INTEGER;

    return aTime - bTime;
  });

  return {
    id: speaker.id,
    name: speaker.name,
    bio: speaker.bio,
    designation: speaker.designation,
    company: speaker.company,
    avatar_url: speaker.avatar_url,
    linkedin_url: speaker.linkedin_url,
    github_url: speaker.github_url,
    x_url: speaker.x_url,
    website_url: speaker.website_url,
    talks_count: talks.length,
    talks,
  };
}