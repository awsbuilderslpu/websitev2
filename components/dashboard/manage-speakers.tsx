"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Plus,
  Trash2,
  UsersRound,
  Mic2,
  Search,
  ExternalLink,
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

const posterColors = [
  "bg-[#E5E2FF] text-[#6252BD]",
  "bg-[#FFE5A5] text-[#8A5B12]",
  "bg-[#DDF2E5] text-[#287B56]",
  "bg-[#FFDCCF] text-[#B95526]",
  "bg-[#DCEBFF] text-[#365DB4]",
  "bg-[#F9DDF0] text-[#A3447C]",
];

export function ManageSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadSpeakers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/v1/admin/speakers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch speakers");
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
    void loadSpeakers();
  }, []);

  async function deleteSpeaker(id: string) {
    const speaker = speakers.find((item) => item.id === id);

    if (!speaker) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${speaker.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(`/api/v1/admin/speakers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete speaker");
      }

      setSpeakers((current) =>
        current.filter((item) => item.id !== id),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete speaker",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredSpeakers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return speakers;
    }

    return speakers.filter((speaker) =>
      [
        speaker.name,
        speaker.company,
        speaker.designation,
        speaker.bio,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [speakers, search]);

  const publicCount = speakers.filter((speaker) => speaker.is_public).length;
  const hiddenCount = speakers.length - publicCount;
  const sessionCount = speakers.reduce(
    (total, speaker) => total + (speaker.talks_count ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-3.5 py-2 text-xs font-medium text-[#656474]">
            <span className="h-2 w-2 rounded-full bg-[#F07832]" />
            Community directory
          </div>

          <Link
            href="/dashboard/speakers/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6252BD]"
          >
            <Plus size={17} />
            Add a speaker
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-[30px] border border-[#EEE9E0] bg-white p-6 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full bg-[#E5E2FF]" />
          <div className="pointer-events-none absolute right-40 top-28 h-20 w-20 rotate-12 rounded-[28px] bg-[#FFE5A5]" />
          <div className="pointer-events-none absolute bottom-0 right-24 h-16 w-16 -rotate-12 rounded-full bg-[#DDF2E5]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF1E9] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B95526]">
                <Mic2 size={13} />
                The people behind the ideas
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Good ideas need{" "}
                <span className="text-[#6252BD]">great voices.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#777586] sm:text-base">
                Manage the people bringing talks, workshops, panels, and
                fresh perspectives to the AWS Student Builder Group community.
              </p>
            </div>

            <div className="relative flex items-center gap-3 rounded-[22px] border border-white/80 bg-white/80 p-4 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
                <UsersRound size={20} />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {speakers.length}
                </p>
                <p className="text-xs text-[#777586]">Community voices</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="All speakers"
            value={speakers.length}
            color="lavender"
          />
          <StatCard
            label="Public profiles"
            value={publicCount}
            color="mint"
          />
          <StatCard
            label="Hidden profiles"
            value={hiddenCount}
            color="peach"
          />
          <StatCard
            label="Linked sessions"
            value={sessionCount}
            color="yellow"
          />
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#898797]">
                Speaker directory
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">
                Meet the speakers
              </h2>
              <p className="mt-1.5 text-sm text-[#777586]">
                {search.trim()
                  ? `${filteredSpeakers.length} matching ${
                      filteredSpeakers.length === 1 ? "person" : "people"
                    }`
                  : "Everyone sharing knowledge with the community."}
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-full border border-[#EAE6DE] bg-white px-4 py-3 transition focus-within:border-[#B9B0F5] sm:max-w-sm">
              <Search size={17} className="shrink-0 text-[#898797]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, role, company..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#242333] outline-none placeholder:text-[#AAA7B3]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-medium text-[#6252BD] hover:text-[#44359C]"
                >
                  Clear
                </button>
              )}
            </label>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[26px] border border-[#EEE9E0] bg-white p-5"
                >
                  <div className="h-24 rounded-2xl bg-[#F3F0E9]" />
                  <div className="mt-5 h-5 w-2/3 rounded-full bg-[#F3F0E9]" />
                  <div className="mt-3 h-4 w-1/2 rounded-full bg-[#F3F0E9]" />
                  <div className="mt-6 h-10 rounded-xl bg-[#F3F0E9]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[26px] border border-[#F1C7BC] bg-[#FFF1E9] p-6 sm:p-8">
              <p className="font-semibold text-[#963F2A]">
                We couldn’t load the speakers.
              </p>
              <p className="mt-2 text-sm text-[#8B6653]">{error}</p>
              <button
                type="button"
                onClick={() => void loadSpeakers()}
                className="mt-5 rounded-full bg-[#242333] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6252BD]"
              >
                Try again
              </button>
            </div>
          ) : filteredSpeakers.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#DCD6CB] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#E5E2FF] text-[#6252BD]">
                <UsersRound size={24} />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {search.trim() ? "No matches this time." : "Your stage is empty."}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777586]">
                {search.trim()
                  ? "Try another name, company, or designation."
                  : "Add your first speaker and start building your community directory."}
              </p>
              {search.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-full bg-[#E5E2FF] px-4 py-2.5 text-sm font-semibold text-[#6252BD] transition hover:bg-[#D8D2FF]"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  href="/dashboard/speakers/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6252BD]"
                >
                  <Plus size={16} />
                  Add first speaker
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSpeakers.map((speaker, index) => (
                <article
                  key={speaker.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#EEE9E0] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#D8D1FA] hover:shadow-[0_12px_35px_rgba(36,35,51,0.06)]"
                >
                  <div
                    className={`relative flex min-h-28 items-start justify-between overflow-hidden p-5 ${
                      posterColors[index % posterColors.length].split(" ")[0]
                    }`}
                  >
                    <div className="pointer-events-none absolute -right-4 -top-8 h-28 w-28 rounded-full border-[18px] border-white/35" />
                    <div className="pointer-events-none absolute bottom-2 right-20 h-8 w-8 rotate-12 rounded-xl bg-white/40" />

                    <span className="relative rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#454052]">
                      {speaker.is_public ? "Public profile" : "Hidden profile"}
                    </span>

                    <span className="relative rounded-full bg-white/75 px-3 py-1.5 font-mono text-[10px] text-[#454052]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="-mt-12 mb-4 flex items-end justify-between gap-3">
                      <SpeakerAvatar speaker={speaker} />

                      <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#F3F0E9] px-3 py-1.5 text-[11px] font-medium text-[#656474]">
                        <Mic2 size={12} />
                        {speaker.talks_count ?? 0}{" "}
                        {(speaker.talks_count ?? 0) === 1 ? "session" : "sessions"}
                      </span>
                    </div>

                    <h3 className="break-words text-xl font-semibold tracking-tight">
                      {speaker.name}
                    </h3>

                    <p className="mt-1.5 min-h-10 text-sm leading-5 text-[#777586]">
                      {[speaker.designation, speaker.company]
                        .filter(Boolean)
                        .join(" · ") || "Role not added yet"}
                    </p>

                    <div className="mt-4 flex min-h-8 items-center justify-between gap-3">
                      <SocialLinks speaker={speaker} />
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          speaker.is_public
                            ? "bg-[#DDF2E5] text-[#287B56]"
                            : "bg-[#F3F0E9] text-[#777586]"
                        }`}
                      >
                        {speaker.is_public ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-[#F0EDE7] pt-4">
                      <Link
                        href={`/dashboard/speakers/${speaker.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#242333] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6252BD]"
                      >
                        Manage
                        <ArrowUpRight size={15} />
                      </Link>

                      {speaker.website_url && (
                        <a
                          href={speaker.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE6DE] text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
                          aria-label={`Open ${speaker.name}'s website`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => void deleteSpeaker(speaker.id)}
                        disabled={deletingId === speaker.id}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE6DE] text-[#898797] transition hover:border-[#F1C7BC] hover:bg-[#FFF1E9] hover:text-[#B95526] disabled:cursor-wait disabled:opacity-50"
                        aria-label={`Delete ${speaker.name}`}
                        title="Delete speaker"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "lavender" | "mint" | "peach" | "yellow";
}) {
  const colors = {
    lavender: "bg-[#E5E2FF]",
    mint: "bg-[#DDF2E5]",
    peach: "bg-[#FFDCCF]",
    yellow: "bg-[#FFE5A5]",
  };

  return (
    <div className={`rounded-[22px] p-4 sm:p-5 ${colors[color]}`}>
      <p className="text-2xl font-semibold tracking-tight text-[#242333] sm:text-3xl">
        {value}
      </p>
      <p className="mt-1.5 text-xs font-medium text-[#656474]">{label}</p>
    </div>
  );
}

function SpeakerAvatar({ speaker }: { speaker: Speaker }) {
  const initials =
    speaker.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border-4 border-white bg-[#E5E2FF] shadow-sm">
      {speaker.avatar_url ? (
        <img
          src={speaker.avatar_url}
          alt={speaker.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xl font-semibold tracking-tight text-[#6252BD]">
          {initials}
        </span>
      )}
    </div>
  );
}

function SocialLinks({ speaker }: { speaker: Speaker }) {
  const links = [
    {
      href: speaker.linkedin_url,
      label: "LinkedIn",
      text: "in",
    },
    {
      href: speaker.github_url,
      label: "GitHub",
      text: "GH",
    },
    {
      href: speaker.x_url,
      label: "X",
      text: "𝕏",
    },
  ].filter(
    (link): link is { href: string; label: string; text: string } =>
      Boolean(link.href),
  );

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${speaker.name} on ${link.label}`}
          title={link.label}
          className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#EAE6DE] px-2 text-[11px] font-semibold text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          {link.text}
        </a>
      ))}

      {speaker.website_url && (
        <a
          href={speaker.website_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${speaker.name} website`}
          title="Website"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EAE6DE] text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          <Globe size={14} />
        </a>
      )}
    </div>
  );
}