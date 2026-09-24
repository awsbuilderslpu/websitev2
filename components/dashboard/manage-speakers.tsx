"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Speaker = {
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
  is_public: boolean;
  created_at: string;
  updated_at: string;
  talks_count?: number;
};

export function ManageSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSpeakers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/v1/admin/speakers",
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch speakers",
        );
      }

      setSpeakers(data.speakers ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch speakers",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpeakers();
  }, []);

  async function deleteSpeaker(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this speaker?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/admin/speakers/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete speaker",
        );
      }

      setSpeakers((current) =>
        current.filter((speaker) => speaker.id !== id),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete speaker",
      );
    }
  }

  const filteredSpeakers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return speakers;
    }

    return speakers.filter((speaker) => {
      return (
        speaker.name.toLowerCase().includes(query) ||
        speaker.company
          ?.toLowerCase()
          .includes(query) ||
        speaker.designation
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [speakers, search]);

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-360 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                Administration
              </div>

              <h1 className="text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
                Manage Speakers.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#8F96A5]">
                Manage the people who contribute sessions,
                workshops, panels, and talks to the community.
              </p>
            </div>

            <Link
              href="/dashboard/speakers/new"
              className="inline-flex w-fit items-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF]"
            >
              <Plus size={17} />
              Add Speaker
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#596273]">
            {speakers.length}{" "}
            {speakers.length === 1 ? "speaker" : "speakers"}
          </p>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search speakers..."
            className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7] sm:max-w-sm"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-[#737B8C]">
            Loading speakers...
          </div>
        ) : error ? (
          <div className="border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300">
            {error}
          </div>
        ) : filteredSpeakers.length === 0 ? (
          <div className="border-y border-white/10 py-20 text-center">
            <p className="text-lg font-medium">
              No speakers found.
            </p>

            <p className="mt-2 text-sm text-[#737B8C]">
              Add your first speaker to the community.
            </p>
          </div>
        ) : (
          <div className="border-t border-white/10">
            {filteredSpeakers.map((speaker, index) => (
              <div
                key={speaker.id}
                className="grid gap-6 border-b border-white/10 py-7 lg:grid-cols-[55px_64px_1fr_auto] lg:items-center lg:gap-8"
              >
                <span className="font-mono text-xs text-[#596273]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <SpeakerAvatar speaker={speaker} />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight">
                      {speaker.name}
                    </h2>

                    {!speaker.is_public && (
                      <span className="border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#737B8C]">
                        Hidden
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-[#8F96A5]">
                    {[
                      speaker.designation,
                      speaker.company,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "No designation"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#596273]">
                      {speaker.talks_count ?? 0}{" "}
                      {(speaker.talks_count ?? 0) === 1
                        ? "session"
                        : "sessions"}
                    </span>

                    <SocialLinks speaker={speaker} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/speakers/${speaker.id}`}
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                    aria-label={`Edit ${speaker.name}`}
                  >
                    <ArrowUpRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      deleteSpeaker(speaker.id)
                    }
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-red-400 hover:bg-red-400 hover:text-white"
                    aria-label={`Delete ${speaker.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SpeakerAvatar({
  speaker,
}: {
  speaker: Speaker;
}) {
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#172033]">
      {speaker.avatar_url ? (
        <img
          src={speaker.avatar_url}
          alt={speaker.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#A855F7]">
          {initials}
        </div>
      )}
    </div>
  );
}

function SocialLinks({
  speaker,
}: {
  speaker: Speaker;
}) {
  return (
    <div className="flex items-center gap-3 text-[#596273]">
      {speaker.linkedin_url && (
        <a
          href={speaker.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold transition-colors hover:text-[#A855F7]"
          aria-label={`${speaker.name} LinkedIn`}
        >
          in
        </a>
      )}

      {speaker.github_url && (
        <a
          href={speaker.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold transition-colors hover:text-[#A855F7]"
          aria-label={`${speaker.name} GitHub`}
        >
          GH
        </a>
      )}

      {speaker.x_url && (
        <a
          href={speaker.x_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold transition-colors hover:text-[#A855F7]"
          aria-label={`${speaker.name} X`}
        >
          𝕏
        </a>
      )}

      {speaker.website_url && (
        <a
          href={speaker.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[#A855F7]"
          aria-label={`${speaker.name} website`}
        >
          <Globe size={14} />
        </a>
      )}
    </div>
  );
}