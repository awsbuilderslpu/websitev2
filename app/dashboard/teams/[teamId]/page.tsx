"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Crown,
  LoaderCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
};

type TeamMember = {
  id: string;
  team_id: string;
  profile_id: string;
  designation: string;
  is_lead: boolean;
  is_active: boolean;
  joined_at: string;
  left_at: string | null;
  profiles: Profile | Profile[] | null;
};

type Team = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type EligibleMember = Profile;

const designations = [
  "Team Lead",
  "DevRel Manager",
  "Developer Advocate",
  "Community Manager",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Systems Architect",
  "Technical Writer",
  "Event Coordinator",
  "Designer",
  "Core Team Member",
];

const getProfile = (member: TeamMember) =>
  Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;

const getInitials = (name: string | null | undefined) =>
  (name || "Member")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const router = useRouter();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [eligibleMembers, setEligibleMembers] = useState<EligibleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEligible, setLoadingEligible] = useState(false);
  const [search, setSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [designation, setDesignation] = useState("Core Team Member");
  const [isLead, setIsLead] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [teamsResponse, membersResponse] = await Promise.all([
        fetch("/api/v1/admin/teams", { cache: "no-store" }),
        fetch(`/api/v1/admin/teams/${teamId}/members`, {
          cache: "no-store",
        }),
      ]);

      const [teamsResult, membersResult] = await Promise.all([
        teamsResponse.json(),
        membersResponse.json(),
      ]);

      if (!teamsResponse.ok) {
        throw new Error(teamsResult.error || "Unable to load teams.");
      }

      if (!membersResponse.ok) {
        throw new Error(membersResult.error || "Unable to load team members.");
      }

      const foundTeam = (teamsResult.teams || []).find(
        (item: Team) => item.id === teamId,
      );

      if (!foundTeam) {
        setTeam(null);
        setMembers([]);
        return;
      }

      setTeam(foundTeam);
      setMembers(membersResult.members || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load this team.");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void loadTeam();
  }, [loadTeam]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const loadEligibleMembers = async () => {
    setLoadingEligible(true);
    setError("");

    try {
      const response = await fetch(
        "/api/v1/admin/teams/eligible-members",
        { cache: "no-store" },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load eligible members.");
      }

      setEligibleMembers(result.members || []);
      setAddModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load eligible members.",
      );
    } finally {
      setLoadingEligible(false);
    }
  };

  const currentProfileIds = useMemo(
    () => new Set(members.map((member) => member.profile_id)),
    [members],
  );

  const availableMembers = useMemo(
    () =>
      eligibleMembers.filter(
        (member) =>
          !currentProfileIds.has(member.id) &&
          `${member.full_name || ""} ${member.email || ""} ${member.role || ""}`
            .toLowerCase()
            .includes(memberSearch.toLowerCase().trim()),
      ),
    [eligibleMembers, currentProfileIds, memberSearch],
  );

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const profile = getProfile(member);
        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          (profile?.full_name || "").toLowerCase().includes(query) ||
          (profile?.email || "").toLowerCase().includes(query) ||
          member.designation.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && member.is_active) ||
          (statusFilter === "inactive" && !member.is_active);

        return matchesSearch && matchesStatus;
      }),
    [members, search, statusFilter],
  );

  const activeMembers = members.filter((member) => member.is_active);
  const inactiveMembers = members.filter((member) => !member.is_active);
  const leads = activeMembers.filter((member) => member.is_lead);

  const addMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProfileId || !designation.trim()) {
      setError("Select a member and designation.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/v1/admin/teams/${teamId}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_id: selectedProfileId,
            designation,
            is_lead: isLead,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to add member.");
      }

      setAddModalOpen(false);
      setSelectedProfileId("");
      setDesignation("Core Team Member");
      setIsLead(false);
      setMemberSearch("");
      setNotice("Member added to the team.");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add member.");
    } finally {
      setSaving(false);
    }
  };

  const updateMember = async (
    member: TeamMember,
    updates: { designation?: string; is_lead?: boolean; is_active?: boolean },
  ) => {
    setUpdatingMemberId(member.id);
    setError("");

    try {
      const response = await fetch(
        `/api/v1/admin/teams/${teamId}/members`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: member.id, ...updates }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update member.");
      }

      setNotice("Membership updated.");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update member.");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const removeMember = async (member: TeamMember) => {
    const profile = getProfile(member);
    const confirmed = window.confirm(
      `Remove ${profile?.full_name || "this member"} from ${team?.name}?`,
    );

    if (!confirmed) return;

    setUpdatingMemberId(member.id);
    setError("");

    try {
      const response = await fetch(
        `/api/v1/admin/teams/${teamId}/members?id=${encodeURIComponent(member.id)}`,
        { method: "DELETE" },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to remove member.");
      }

      setNotice("Member removed from the team.");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove member.");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#6252BD]">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <LoaderCircle size={20} className="animate-spin" />
          Loading team...
        </div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] px-6 text-center text-[#242333]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
          <Users size={28} />
        </div>
        <h1 className="text-2xl font-black">Team not found</h1>
        <p className="mt-2 text-sm text-[#777488]">
          This team may have been removed or is no longer available.
        </p>
        <Link
          href="/dashboard/teams"
          className="mt-6 rounded-full bg-[#242333] px-5 py-3 text-sm font-bold text-white"
        >
          Back to teams
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-6 text-[#242333] sm:px-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href="/dashboard/teams"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#777488] transition hover:text-[#6252BD]"
        >
          <ArrowLeft size={16} />
          All teams
        </Link>

        <section className="relative mb-8 overflow-hidden rounded-[30px] bg-[#E5E2FF] p-6 sm:p-9">
          <div
            className="pointer-events-none absolute -right-8 -top-14 h-56 w-56 rounded-full border-[34px] border-white/30"
          />
          <div className="pointer-events-none absolute bottom-[-48px] right-[24%] h-32 w-32 rotate-12 rounded-[32px] bg-[#FFDCCF]" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-xl font-black"
                  style={{ color: team.color || "#6252BD" }}
                >
                  {team.icon || team.name.slice(0, 1).toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    team.is_active
                      ? "bg-[#DDF2E5] text-[#28694B]"
                      : "bg-white/75 text-[#777488]"
                  }`}
                >
                  {team.is_active ? "Active team" : "Inactive team"}
                </span>
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#6252BD]">
                Team workspace
              </p>
              <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                {team.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#625D7B]">
                /{team.slug}
              </p>
              {team.description && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#55516F]">
                  {team.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => void loadEligibleMembers()}
              disabled={loadingEligible}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#242333] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#403D56] disabled:opacity-60"
            >
              {loadingEligible ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Add a member
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-[#F2BDB4] bg-[#FFF0EC] px-4 py-3 text-sm text-[#A53F36]">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
              <X size={17} />
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-[#B8DEC8] bg-[#E8F7EE] px-4 py-3 text-sm font-medium text-[#28694B]">
            <Check size={17} />
            {notice}
          </div>
        )}

        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total members" value={members.length} color="bg-white" />
          <StatCard label="Active members" value={activeMembers.length} color="bg-[#DDF2E5]" />
          <StatCard label="Team leads" value={leads.length} color="bg-[#FFE5A5]" />
          <StatCard label="Former members" value={inactiveMembers.length} color="bg-[#FFDCCF]" />
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#777488]">
                The people behind the work
              </p>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Team members
                <span className="ml-3 align-middle text-base font-semibold text-[#888598]">
                  {filteredMembers.length}
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-full border border-[#E7E4DD] bg-white px-4 py-3 sm:min-w-[230px]">
                <Search size={17} className="text-[#89869A]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search members..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#AAA7B3]"
                />
              </label>

              <label className="flex items-center gap-2 rounded-full border border-[#E7E4DD] bg-white px-4 py-3">
                <Users size={16} className="text-[#89869A]" />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | "active" | "inactive")
                  }
                  className="bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="all">All members</option>
                  <option value="active">Active</option>
                  <option value="inactive">Former members</option>
                </select>
                <ChevronDown size={14} className="text-[#89869A]" />
              </label>
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#D9D5CC] bg-white/70 px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
                <Users size={25} />
              </div>
              <h3 className="text-xl font-bold">
                {members.length ? "No matching members" : "Your team starts here"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777488]">
                {members.length
                  ? "Try another search or filter."
                  : "Add core team members and assign their designations to get started."}
              </p>
              {!members.length && (
                <button
                  type="button"
                  onClick={() => void loadEligibleMembers()}
                  disabled={loadingEligible}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6252BD] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5040A5] disabled:opacity-60"
                >
                  <Plus size={17} />
                  Add the first member
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[26px] border border-[#EAE7E0] bg-white">
              <div className="hidden grid-cols-[minmax(220px,1.4fr)_minmax(180px,1fr)_130px_110px_100px] gap-4 border-b border-[#F0EEE8] bg-[#F8F7F3] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-[#89869A] lg:grid">
                <span>Member</span>
                <span>Designation</span>
                <span>Membership</span>
                <span>Leadership</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-[#F0EEE8]">
                {filteredMembers.map((member) => {
                  const profile = getProfile(member);
                  const isUpdating = updatingMemberId === member.id;

                  return (
                    <article
                      key={member.id}
                      className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(220px,1.4fr)_minmax(180px,1fr)_130px_110px_100px] lg:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#E5E2FF] text-sm font-black text-[#6252BD]">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name || "Member"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(profile?.full_name)
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {profile?.full_name || "Unnamed member"}
                          </p>
                          <p className="mt-1 truncate text-xs text-[#89869A]">
                            {profile?.email || "No email available"}
                          </p>
                          <span className="mt-1.5 inline-flex rounded-full bg-[#F1EFFB] px-2 py-0.5 text-[10px] font-bold capitalize text-[#6252BD]">
                            {profile?.role || "member"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#89869A] lg:hidden">
                          Designation
                        </label>
                        <select
                          value={member.designation}
                          disabled={isUpdating}
                          onChange={(event) =>
                            void updateMember(member, {
                              designation: event.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#EAE7E0] bg-[#FAF9F6] px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8A7DD0] disabled:opacity-60"
                        >
                          {!designations.includes(member.designation) && (
                            <option value={member.designation}>
                              {member.designation}
                            </option>
                          )}
                          {designations.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#89869A] lg:hidden">
                          Membership
                        </label>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                            member.is_active
                              ? "bg-[#E5F5E9] text-[#32754C]"
                              : "bg-[#F0EEF2] text-[#777282]"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${member.is_active ? "bg-[#48A86B]" : "bg-[#9692A1]"}`} />
                          {member.is_active ? "Active" : "Former"}
                        </span>
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#89869A] lg:hidden">
                          Leadership
                        </label>
                        <button
                          type="button"
                          disabled={isUpdating || !member.is_active}
                          onClick={() =>
                            void updateMember(member, {
                              is_lead: !member.is_lead,
                            })
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            member.is_lead
                              ? "bg-[#FFE5A5] text-[#815A12]"
                              : "border border-[#EAE7E0] text-[#89869A] hover:bg-[#FFF7E6] hover:text-[#815A12]"
                          }`}
                        >
                          <Crown size={13} />
                          {member.is_lead ? "Lead" : "Make lead"}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 lg:justify-end">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            void updateMember(member, {
                              is_active: !member.is_active,
                            })
                          }
                          title={member.is_active ? "Mark as former member" : "Reactivate membership"}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE7E0] text-[#777488] transition hover:bg-[#FFF2D9] hover:text-[#9C6A16] disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : member.is_active ? (
                            <ArrowUpRight size={15} />
                          ) : (
                            <Check size={15} />
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void removeMember(member)}
                          title="Remove from team"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE7E0] text-[#A59EAA] transition hover:border-[#F3C7C0] hover:bg-[#FFF0EC] hover:text-[#C44F45] disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-[#89869A]">
          <Sparkles size={14} className="text-[#6252BD]" />
          <span>
            Team assignments are separate from global SSO roles.
          </span>
        </div>
      </div>

      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#242333]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setAddModalOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-[28px] bg-[#FAF9F6] shadow-2xl">
            <div className="flex items-start justify-between bg-[#DDF2E5] p-6 sm:p-8">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#32856D]">
                  <UserRound size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  Bring someone in
                </h2>
                <p className="mt-1 text-sm text-[#4E7666]">
                  Only core members and admins are eligible.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#4E7666] transition hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addMember} className="space-y-5 p-6 sm:p-8">
              {error && (
                <div className="rounded-xl border border-[#F2BDB4] bg-[#FFF0EC] px-4 py-3 text-sm text-[#A53F36]">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="member-search"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                >
                  Find a person
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-[#E5E1D9] bg-white px-4">
                  <Search size={17} className="text-[#89869A]" />
                  <input
                    id="member-search"
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[#AAA7B3]"
                  />
                </div>
              </div>

              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {availableMembers.length === 0 ? (
                  <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-[#89869A]">
                    {eligibleMembers.length === 0
                      ? "No eligible core members or admins found."
                      : "No available members match your search."}
                  </div>
                ) : (
                  availableMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedProfileId(member.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        selectedProfileId === member.id
                          ? "border-[#6252BD] bg-[#F0EDFF] ring-2 ring-[#6252BD]/10"
                          : "border-[#EAE7E0] bg-white hover:border-[#C8C0EF]"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E5E2FF] text-xs font-black text-[#6252BD]">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.full_name || "Member"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(member.full_name)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {member.full_name || "Unnamed member"}
                        </p>
                        <p className="truncate text-xs text-[#89869A]">
                          {member.email || "No email"}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#F1EFFB] px-2 py-1 text-[10px] font-bold capitalize text-[#6252BD]">
                        {member.role}
                      </span>

                      {selectedProfileId === member.id && (
                        <Check size={17} className="shrink-0 text-[#6252BD]" />
                      )}
                    </button>
                  ))
                )}
              </div>

              <div>
                <label
                  htmlFor="member-designation"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                >
                  Designation
                </label>
                <div className="relative">
                  <select
                    id="member-designation"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5 pr-10 text-sm outline-none focus:border-[#8A7DD0] focus:ring-4 focus:ring-[#6252BD]/10"
                  >
                    {designations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#89869A]"
                  />
                </div>
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE5A5] text-[#815A12]">
                    <Crown size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Team lead</p>
                    <p className="mt-0.5 text-xs text-[#89869A]">
                      Assign leadership status
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isLead}
                  onChange={(event) => setIsLead(event.target.checked)}
                  className="h-5 w-5 accent-[#6252BD]"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  disabled={saving}
                  className="rounded-full border border-[#E1DDD5] px-6 py-3.5 text-sm font-bold text-[#656274] transition hover:bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !selectedProfileId}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#32856D] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#28694B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}
                  {saving ? "Adding..." : "Add to team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  color: string;
}) {
  return (
    <div className={`rounded-[24px] border border-[#EAE7E0] ${color} p-4 sm:p-5`}>
      <p className="text-xs font-semibold text-[#656274] sm:text-sm">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
        {value}
      </p>
    </div>
  );
}