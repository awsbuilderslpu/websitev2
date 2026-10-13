"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CirclePlus,
  Filter,
  Layers,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

type TeamMember = {
  id: string;
  profile_id: string;
  designation: string;
  is_lead: boolean;
  is_active: boolean;
  profiles:
    | {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
        role: string | null;
      }
    | {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
        role: string | null;
      }[]
    | null;
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
  team_members: TeamMember[];
};

type TeamForm = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
};

const initialForm: TeamForm = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  color: "#6252BD",
  sort_order: 0,
  is_active: true,
};

const colors = [
  "#6252BD",
  "#F07832",
  "#32856D",
  "#C44F68",
  "#3975BD",
  "#B17B23",
  "#8753A4",
  "#3F858D",
];

const getMemberProfile = (member: TeamMember) =>
  Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;

const getInitials = (name: string | null | undefined) =>
  (name || "Member")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form, setForm] = useState<TeamForm>(initialForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/admin/teams", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load teams.");
      }

      setTeams(result.teams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load teams.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTeams();
  }, [loadTeams]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const stats = useMemo(() => {
    const activeTeams = teams.filter((team) => team.is_active).length;
    const memberships = teams.reduce(
      (total, team) =>
        total +
        (team.team_members || []).filter((member) => member.is_active).length,
      0,
    );
    const leads = teams.reduce(
      (total, team) =>
        total +
        (team.team_members || []).filter(
          (member) => member.is_active && member.is_lead,
        ).length,
      0,
    );

    return {
      total: teams.length,
      active: activeTeams,
      memberships,
      leads,
    };
  }, [teams]);

  const filteredTeams = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesSearch =
        !normalizedSearch ||
        team.name.toLowerCase().includes(normalizedSearch) ||
        team.slug.toLowerCase().includes(normalizedSearch) ||
        (team.description || "").toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && team.is_active) ||
        (statusFilter === "inactive" && !team.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [teams, search, statusFilter]);

  const openCreate = () => {
    setEditingTeam(null);
    setForm(initialForm);
    setSlugEdited(false);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (team: Team) => {
    setEditingTeam(team);
    setForm({
      name: team.name,
      slug: team.slug,
      description: team.description || "",
      icon: team.icon || "",
      color: team.color || "#6252BD",
      sort_order: team.sort_order ?? 0,
      is_active: team.is_active,
    });
    setSlugEdited(true);
    setError("");
    setModalOpen(true);
  };

  const updateName = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: slugEdited ? current.slug : slugify(name),
    }));
  };

  const saveTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      color: form.color,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };

    try {
      const response = await fetch("/api/v1/admin/teams", {
        method: editingTeam ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingTeam ? { ...payload, id: editingTeam.id } : payload,
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save team.");
      }

      setModalOpen(false);
      setNotice(editingTeam ? "Team updated successfully." : "Team created successfully.");
      await loadTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save team.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTeam = async (team: Team) => {
    setError("");

    try {
      const response = await fetch("/api/v1/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: team.id,
          is_active: !team.is_active,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update team status.");
      }

      setNotice(
        team.is_active ? "Team deactivated." : "Team activated.",
      );
      await loadTeams();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update team status.",
      );
    }
  };

  const deleteTeam = async (team: Team) => {
    const confirmed = window.confirm(
      `Delete "${team.name}"? Its team memberships will also be deleted.`,
    );

    if (!confirmed) return;

    setDeletingId(team.id);
    setError("");

    try {
      const response = await fetch(
        `/api/v1/admin/teams?id=${encodeURIComponent(team.id)}`,
        { method: "DELETE" },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete team.");
      }

      setNotice("Team deleted successfully.");
      await loadTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete team.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-6 text-[#242333] sm:px-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1440px]">
        <section className="relative mb-8 overflow-hidden rounded-[30px] bg-[#E5E2FF] p-6 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border-[38px] border-white/30" />
          <div className="pointer-events-none absolute bottom-[-72px] right-[22%] h-40 w-40 rotate-12 rounded-[42px] bg-[#FFDCCF]" />

          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#6252BD]">
                <Sparkles size={14} />
                People & culture
              </div>

              <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Teams that
                <br />
                <span className="font-serif font-medium italic text-[#6252BD]">
                  build things.
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#55516F] sm:text-base">
                Organize the people behind AWS Student Builder Group. Manage
                teams, assign designations, and keep everyone moving together.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#242333] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#403D56]"
            >
              <Plus size={18} />
              Create a team
            </button>
          </div>
        </section>

        {error && !modalOpen && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-[#F2BDB4] bg-[#FFF0EC] px-4 py-3 text-sm text-[#A53F36]">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[#B8DEC8] bg-[#E8F7EE] px-4 py-3 text-sm font-medium text-[#28694B]">
            <Check size={17} />
            {notice}
          </div>
        )}

        <section className="mb-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="All teams"
            value={stats.total}
            detail="Across the community"
            icon={<Layers size={19} />}
            color="bg-white"
          />
          <StatCard
            label="Active teams"
            value={stats.active}
            detail="Currently operating"
            icon={<ArrowUpRight size={19} />}
            color="bg-[#DDF2E5]"
          />
          <StatCard
            label="Memberships"
            value={stats.memberships}
            detail="Active team assignments"
            icon={<Users size={19} />}
            color="bg-[#FFE5A5]"
          />
          <StatCard
            label="Team leads"
            value={stats.leads}
            detail="Across active teams"
            icon={<ShieldCheck size={19} />}
            color="bg-[#FFDCCF]"
          />
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#777488]">
                Workspace structure
              </p>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Your teams
                <span className="ml-3 align-middle text-base font-semibold text-[#888598]">
                  {filteredTeams.length}
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-full border border-[#E7E4DD] bg-white px-4 py-3 sm:min-w-[240px]">
                <Search size={17} className="shrink-0 text-[#89869A]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find a team..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#AAA7B3]"
                />
              </label>

              <label className="flex items-center gap-2 rounded-full border border-[#E7E4DD] bg-white px-4 py-3">
                <Filter size={16} className="text-[#89869A]" />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "all" | "active" | "inactive",
                    )
                  }
                  className="bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown size={14} className="text-[#89869A]" />
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-[28px] border border-[#EAE7E0] bg-white">
              <div className="flex items-center gap-3 text-sm font-medium text-[#777488]">
                <LoaderCircle size={20} className="animate-spin" />
                Getting your teams...
              </div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#D9D5CC] bg-white/70 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
                <Layers size={25} />
              </div>
              <h3 className="text-xl font-bold">
                {teams.length ? "No matching teams" : "A blank canvas"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777488]">
                {teams.length
                  ? "Try a different search or status filter."
                  : "Create your first team and start organizing your community."}
              </p>
              {!teams.length && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6252BD] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5040A5]"
                >
                  <CirclePlus size={17} />
                  Create your first team
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map((team, index) => {
                const activeMembers = (team.team_members || []).filter(
                  (member) => member.is_active,
                );
                const teamLeads = activeMembers.filter(
                  (member) => member.is_lead,
                );

                return (
                  <article
                    key={team.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#EAE7E0] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#D7D0F4] hover:shadow-[0_16px_45px_rgba(44,37,77,0.07)]"
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: team.color || colors[index % colors.length] }}
                    />

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[19px] text-xl font-black"
                          style={{
                            backgroundColor: `${team.color || "#6252BD"}18`,
                            color: team.color || "#6252BD",
                          }}
                        >
                          {team.icon || team.name.slice(0, 1).toUpperCase()}
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                            team.is_active
                              ? "bg-[#E5F5E9] text-[#32754C]"
                              : "bg-[#F0EEF2] text-[#777282]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              team.is_active ? "bg-[#48A86B]" : "bg-[#9692A1]"
                            }`}
                          />
                          {team.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <h3 className="text-xl font-black tracking-tight">
                        {team.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#8B8799]">
                        /{team.slug}
                      </p>

                      <p className="mt-3 min-h-[44px] text-sm leading-[1.6] text-[#706D7E]">
                        {team.description || "A team building the future of the community."}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-y border-[#F0EEE8] py-4">
                        <div>
                          <p className="text-2xl font-black">
                            {activeMembers.length}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-[#89869A]">
                            Active members
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black">
                            {teamLeads.length}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-[#89869A]">
                            Team leads
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center">
                        <div className="flex -space-x-2">
                          {activeMembers.slice(0, 4).map((member) => {
                            const profile = getMemberProfile(member);

                            return (
                              <div
                                key={member.id}
                                title={profile?.full_name || "Member"}
                                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#E5E2FF] text-[10px] font-bold text-[#6252BD]"
                              >
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
                            );
                          })}
                          {activeMembers.length > 4 && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#F1EFE9] text-[10px] font-bold text-[#6D697A]">
                              +{activeMembers.length - 4}
                            </div>
                          )}
                        </div>

                        <span className="ml-auto text-xs font-medium text-[#89869A]">
                          {activeMembers.length === 1
                            ? "1 person"
                            : `${activeMembers.length} people`}
                        </span>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/teams/${team.id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#242333] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#403D56]"
                        >
                          Manage team
                          <ArrowRight size={14} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEdit(team)}
                          aria-label={`Edit ${team.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE7E0] text-[#6E6A7D] transition hover:bg-[#F4F1FF] hover:text-[#6252BD]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => void toggleTeam(team)}
                          aria-label={
                            team.is_active
                              ? `Deactivate ${team.name}`
                              : `Activate ${team.name}`
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE7E0] text-[#6E6A7D] transition hover:bg-[#FFF2D9] hover:text-[#9C6A16]"
                        >
                          {team.is_active ? (
                            <ArrowDownRight size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => void deleteTeam(team)}
                          disabled={deletingId === team.id}
                          aria-label={`Delete ${team.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE7E0] text-[#A59EAA] transition hover:border-[#F3C7C0] hover:bg-[#FFF0EC] hover:text-[#C44F45] disabled:opacity-50"
                        >
                          {deletingId === team.id ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#242333]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-[28px] bg-[#FAF9F6] shadow-2xl">
            <div className="flex items-start justify-between bg-[#E5E2FF] p-6 sm:p-8">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6252BD]">
                  <Layers size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  {editingTeam ? "Shape your team" : "Create a team"}
                </h2>
                <p className="mt-1 text-sm text-[#625D7B]">
                  Give this crew its own identity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#625D7B] transition hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveTeam} className="space-y-5 p-6 sm:p-8">
              {error && (
                <div className="rounded-xl border border-[#F2BDB4] bg-[#FFF0EC] px-4 py-3 text-sm text-[#A53F36]">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="team-name"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                >
                  Team name
                </label>
                <input
                  id="team-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => updateName(event.target.value)}
                  placeholder="e.g. Developer Relations"
                  className="w-full rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#B1ADBA] focus:border-[#8A7DD0] focus:ring-4 focus:ring-[#6252BD]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="team-slug"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                >
                  URL slug
                </label>
                <div className="flex items-center rounded-2xl border border-[#E5E1D9] bg-white px-4 focus-within:border-[#8A7DD0] focus-within:ring-4 focus-within:ring-[#6252BD]/10">
                  <span className="shrink-0 text-sm text-[#A19DAA]">/teams/</span>
                  <input
                    id="team-slug"
                    required
                    maxLength={100}
                    value={form.slug}
                    onChange={(event) => {
                      setSlugEdited(true);
                      setForm((current) => ({
                        ...current,
                        slug: slugify(event.target.value),
                      }));
                    }}
                    placeholder="developer-relations"
                    className="min-w-0 flex-1 bg-transparent px-2 py-3.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="team-description"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                >
                  Description
                </label>
                <textarea
                  id="team-description"
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="What does this team work on?"
                  className="w-full resize-none rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#B1ADBA] focus:border-[#8A7DD0] focus:ring-4 focus:ring-[#6252BD]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="team-icon"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                  >
                    Icon or emoji
                  </label>
                  <input
                    id="team-icon"
                    maxLength={12}
                    value={form.icon}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        icon: event.target.value,
                      }))
                    }
                    placeholder="🚀"
                    className="w-full rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#8A7DD0] focus:ring-4 focus:ring-[#6252BD]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="team-order"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#656274]"
                  >
                    Display order
                  </label>
                  <input
                    id="team-order"
                    type="number"
                    value={form.sort_order}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sort_order: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#8A7DD0] focus:ring-4 focus:ring-[#6252BD]/10"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#656274]">
                  Team color
                </p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, color }))}
                      aria-label={`Choose ${color}`}
                      aria-pressed={form.color === color}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        form.color === color
                          ? "scale-110 ring-2 ring-[#242333] ring-offset-2"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {form.color === color && (
                        <Check size={16} className="text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {editingTeam && (
                <label className="flex items-center justify-between rounded-2xl border border-[#E5E1D9] bg-white px-4 py-3.5">
                  <div>
                    <p className="text-sm font-bold">Team visibility</p>
                    <p className="mt-0.5 text-xs text-[#89869A]">
                      {form.is_active
                        ? "This team is currently active."
                        : "This team is currently inactive."}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        is_active: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-[#6252BD]"
                  />
                </label>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-full border border-[#E1DDD5] px-6 py-3.5 text-sm font-bold text-[#656274] transition hover:bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6252BD] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5040A5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingTeam
                      ? "Save changes"
                      : "Create team"}
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
  detail,
  icon,
  color,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`rounded-[24px] border border-[#EAE7E0] ${color} p-4 sm:p-5`}>
      <div className="mb-5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#656274] sm:text-sm">
          {label}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/75 text-[#6252BD]">
          {icon}
        </span>
      </div>
      <p className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] leading-4 text-[#777488] sm:text-xs">
        {detail}
      </p>
    </div>
  );
}