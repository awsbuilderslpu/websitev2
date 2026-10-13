import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code,
  Users,
  Globe,
  Sparkles,
} from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";

type PublicTeamMember = {
  team_id: string;
  team_slug: string;
  team_name: string;
  team_color: string | null;
  full_name: string | null;
  avatar_url: string | null;
  designation: string;
  is_lead: boolean;
  sort_order: number | null;
  joined_at: string | null;
};

type Team = {
  id: string;
  slug: string;
  name: string;
  color: string;
  members: PublicTeamMember[];
};

const accents = [
  { background: "#E5E2FF", foreground: "#6252BD" },
  { background: "#DDF2E5", foreground: "#28784D" },
  { background: "#DCEBFF", foreground: "#2878C8" },
  { background: "#FFDCCF", foreground: "#C45B35" },
  { background: "#F9DDF0", foreground: "#A6447C" },
];

function getInitials(name: string | null) {
  if (!name) return "SB";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MemberAvatar({
  member,
  color,
}: {
  member: PublicTeamMember;
  color: string;
}) {
  if (member.avatar_url) {
    return (
      <img
        src={member.avatar_url}
        alt={member.full_name || "Team member"}
        className="h-12 w-12 rounded-2xl object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {getInitials(member.full_name)}
    </div>
  );
}

async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabaseServer
    .from("team_members")
    .select(`
      team_id,
      designation,
      is_lead,
      is_active,
      teams!inner (
        id,
        name,
        slug,
        color,
        is_active,
        sort_order
      ),
      profiles!inner (
        id,
        full_name,
        avatar_url,
        role
      )
    `)
    .eq("is_active", true)
    .eq("teams.is_active", true)
    .in("profiles.role", ["core", "admin"])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load public teams:", error.message);
    return [];
  }

  const grouped = new Map<string, Team>();

  for (const row of data ?? []) {
    const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;

    if (!team || !profile) continue;

    if (!grouped.has(team.id)) {
      grouped.set(team.id, {
        id: team.id,
        slug: team.slug,
        name: team.name,
        color: team.color || "#6252BD",
        members: [],
      });
    }

    grouped.get(team.id)?.members.push({
      team_id: team.id,
      team_slug: team.slug,
      team_name: team.name,
      team_color: team.color,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      designation: row.designation,
      is_lead: row.is_lead,
      sort_order: team.sort_order,
      joined_at: null,
    });
  }

  return Array.from(grouped.values()).sort((a, b) => {
    const orderA = (data ?? []).find((row) => {
      const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
      return team?.id === a.id;
    });

    const orderB = (data ?? []).find((row) => {
      const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
      return team?.id === b.id;
    });

    const teamA = Array.isArray(orderA?.teams)
      ? orderA.teams[0]
      : orderA?.teams;
    const teamB = Array.isArray(orderB?.teams)
      ? orderB.teams[0]
      : orderB?.teams;

    return (teamA?.sort_order ?? 0) - (teamB?.sort_order ?? 0);
  });
}

function TeamCard({
  team,
  index,
}: {
  team: Team;
  index: number;
}) {
  const accent = accents[index % accents.length];
  const leads = team.members.filter((member) => member.is_lead);
  const members = team.members.filter((member) => !member.is_lead);

  return (
    <article
      id={team.slug}
      className="group scroll-mt-28 overflow-hidden rounded-[30px] border border-[#242333]/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#242333]/20 hover:shadow-[0_18px_55px_rgba(36,35,51,0.07)]"
    >
      <div
        className="relative overflow-hidden px-6 pb-7 pt-6 sm:px-8 sm:pt-8"
        style={{ backgroundColor: accent.background }}
      >
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border-[24px] border-white/30" />
        <div className="absolute -bottom-12 right-24 h-24 w-24 rounded-full bg-white/30" />

        <div className="relative flex items-start justify-between gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-2xl shadow-sm"
            style={{ color: team.color }}
          >
            <Users width={27} height={27} strokeWidth={1.8} />
          </div>

          <span className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold text-[#242333]/70">
            {team.members.length}{" "}
            {team.members.length === 1 ? "member" : "members"}
          </span>
        </div>

        <div className="relative mt-7">
          <p
            className="text-xs font-extrabold uppercase tracking-[0.2em]"
            style={{ color: accent.foreground }}
          >
            Team {String(index + 1).padStart(2, "0")}
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#242333] sm:text-4xl">
            {team.name}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#242333]/70">
            {team.slug === "devrel"
              ? "Connecting builders, growing our developer community, and bringing people together through technology."
              : team.slug === "platform"
                ? "Building the tools, platforms, and infrastructure that power our community and its projects."
                : `Meet the people behind ${team.name} and the work they do for AWS SBG LPU.`}
          </p>
        </div>

        <a
          href={`#${team.slug}-members`}
          className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#242333] transition hover:gap-3"
        >
          Meet the team
          <ArrowRight width={16} height={16} />
        </a>
      </div>

      <div
        id={`${team.slug}-members`}
        className="scroll-mt-28 px-6 py-6 sm:px-8 sm:py-7"
      >
        {leads.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                width={16}
                height={16}
                style={{ color: team.color }}
              />
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#656474]">
                Team leadership
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {leads.map((member) => (
                <div
                  key={member.team_id + member.full_name + member.designation}
                  className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#242333]/10 p-3"
                >
                  <MemberAvatar member={member} color={team.color} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-[#242333]">
                      {member.full_name || "Community Member"}
                    </p>
                    <p
                      className="mt-1 truncate text-xs font-semibold"
                      style={{ color: team.color }}
                    >
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {members.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Users
                width={16}
                height={16}
                style={{ color: team.color }}
              />
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#656474]">
                The people behind the work
              </h3>
            </div>

            <div className="divide-y divide-[#242333]/8">
              {members.map((member) => (
                <div
                  key={member.team_id + member.full_name + member.designation}
                  className="flex items-center gap-3 py-3"
                >
                  <MemberAvatar member={member} color={team.color} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#242333]">
                      {member.full_name || "Community Member"}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#656474]">
                      {member.designation}
                    </p>
                  </div>

                  <ArrowUpRight
                    width={17}
                    height={17}
                    className="shrink-0 text-[#656474]/60"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl bg-[#FAF9F6] px-5 py-7 text-center">
            <p className="text-sm font-bold text-[#242333]">
              More introductions coming soon
            </p>
            <p className="mt-1 text-xs leading-5 text-[#656474]">
              We&apos;re getting the team ready. Stay tuned!
            </p>
          </div>
        ) : null}

        <div className="mt-5 border-t border-[#242333]/8 pt-4">
          <p className="text-xs font-medium text-[#656474]">
            Different skills. One community. Building together.
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function TeamsPage() {
  const teams = await getTeams();
  const totalMembers = teams.reduce(
    (total, team) => total + team.members.length,
    0
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="relative px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#E5E2FF] opacity-70 blur-[1px]" />
        <div className="pointer-events-none absolute -left-20 top-64 h-56 w-56 rounded-full bg-[#FFE5A5] opacity-60 blur-[1px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#242333]/10 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.13em]">
                <span className="h-2 w-2 rounded-full bg-[#F07832]" />
                Meet our people
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
                Good people.
                <br />
                <span className="relative inline-block">
                  Big ideas.
                  <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full -rotate-1 rounded-full bg-[#FFE5A5] sm:h-5" />
                </span>
                <br />
                <span className="text-[#6252BD]">Real impact.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
                We&apos;re the people behind AWS Student Builder Group at
                LPU — developers, community builders, and problem-solvers
                working together to make technology more accessible.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#our-teams"
                  className="inline-flex items-center gap-2 rounded-full bg-[#242333] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#6252BD]"
                >
                  Explore our teams
                  <ArrowRight width={17} height={17} />
                </a>

                <a
                  href="https://join.awslpu.in"
                  className="inline-flex items-center gap-2 rounded-full border border-[#242333]/15 bg-white px-6 py-3.5 text-sm font-bold transition hover:border-[#6252BD] hover:text-[#6252BD]"
                >
                  Be part of it
                  <ArrowUpRight width={17} height={17} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:max-w-md lg:w-[340px] lg:shrink-0">
              <div className="rounded-[26px] bg-[#E5E2FF] p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-[#6252BD]">
                  <Users width={22} height={22} />
                </div>
                <p className="mt-6 text-4xl font-black tracking-tight">
                  {teams.length}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#6252BD]">
                  Active teams
                </p>
              </div>

              <div className="mt-8 rounded-[26px] bg-[#DDF2E5] p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-[#28784D]">
                  <Users width={22} height={22} />
                </div>
                <p className="mt-6 text-4xl font-black tracking-tight">
                  {totalMembers}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#28784D]">
                  Team assignments
                </p>
              </div>

              <div className="col-span-2 flex items-center gap-4 rounded-[26px] bg-[#242333] p-5 text-white sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Globe width={25} height={25} />
                </div>
                <div>
                  <p className="font-extrabold">Built by the community</p>
                  <p className="mt-1 text-sm leading-5 text-white/65">
                    Learning, shipping, and growing together at LPU.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="our-teams"
        className="scroll-mt-24 px-5 pb-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6252BD]">
                How we build
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Meet the teams.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-[#656474]">
              Every team has its own mission. Together, we make the community
              happen.
            </p>
          </div>

          {teams.length > 0 ? (
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {teams.map((team, index) => (
                <TeamCard key={team.id} team={team} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-[#242333]/10 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
                <Code width={27} height={27} />
              </div>
              <h3 className="mt-5 text-xl font-black">
                Our teams are getting ready.
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#656474]">
                We&apos;re putting the finishing touches on our team
                directory. Check back soon to meet the people behind AWS SBG
                LPU.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="join-us" className="scroll-mt-24 px-5 pb-20 sm:px-8 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#242333] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-20 right-56 h-48 w-48 rounded-full bg-[#6252BD]/30 blur-2xl" />

          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#FFE5A5]">
                <Sparkles width={14} height={14} />
                Your next chapter starts here
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Have something
                <br className="hidden sm:block" /> to build?
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                Bring your curiosity, your ideas, and your willingness to
                learn. There&apos;s room to build something meaningful
                together.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#FFE5A5] px-6 py-3.5 text-sm font-extrabold text-[#242333] transition hover:bg-white sm:self-center"
            >
              Explore AWS SBG
              <ArrowUpRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}