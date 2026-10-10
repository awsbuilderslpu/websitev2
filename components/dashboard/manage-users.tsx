
"use client";

import {
  ArrowDownUp,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type UserRole = "member" | "core" | "admin";

type User = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
  created_at: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type RoleCounts = {
  member: number;
  core: number;
  admin: number;
};

type RoleFilter = "all" | UserRole;

const roleOptions: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "member", label: "Members" },
  { value: "core", label: "Core team" },
  { value: "admin", label: "Admins" },
];

const pageSizeOptions = [10, 20, 50];

const roleStyles: Record<
  UserRole,
  { bg: string; ink: string; label: string }
> = {
  member: { bg: "#DCEBFF", ink: "#365CA8", label: "Member" },
  core: { bg: "#DDF2E5", ink: "#287B56", label: "Core team" },
  admin: { bg: "#E5E2FF", ink: "#6252BD", label: "Admin" },
};

export function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
  const [roleCounts, setRoleCounts] = useState<RoleCounts>({
    member: 0,
    core: 0,
    admin: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(
    async (
      page = 1,
      pageSize = pagination.pageSize,
      currentSearch = search,
      currentRole = role,
    ) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });

        if (currentSearch) params.set("search", currentSearch);
        if (currentRole !== "all") params.set("role", currentRole);

        const response = await fetch(
          `/api/v1/admin/users?${params.toString()}`,
          { cache: "no-store" },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch users");
        }

        setUsers(data.users ?? []);
        setPagination(data.pagination);

        if (data.roleCounts) {
          setRoleCounts(data.roleCounts);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch users",
        );
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize, search, role],
  );

  useEffect(() => {
    void loadUsers(1, 20, "", "all");
  }, []);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearch(nextSearch);
    void loadUsers(1, pagination.pageSize, nextSearch, role);
  }

  function changeRole(nextRole: RoleFilter) {
    setRole(nextRole);
    void loadUsers(1, pagination.pageSize, search, nextRole);
  }

  function changePageSize(nextPageSize: number) {
    void loadUsers(1, nextPageSize, search, role);
  }

  async function updateRole(userId: string, nextRole: UserRole) {
    const previousUser = users.find((user) => user.id === userId);
    if (!previousUser || previousUser.role === nextRole) return;

    try {
      setUpdatingUserId(userId);
      setError("");

      const response = await fetch(`/api/v1/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, role: nextRole } : user,
        ),
      );

      setRoleCounts((current) => ({
        ...current,
        [previousUser.role]: Math.max(0, current[previousUser.role] - 1),
        [nextRole]: current[nextRole] + 1,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update user",
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  const visiblePages = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.page;

    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }
    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }
    return [current - 2, current - 1, current, current + 1, current + 2];
  }, [pagination.page, pagination.totalPages]);

  const rangeStart =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;
  const rangeEnd = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total,
  );

  const roleCards: {
    value: RoleFilter;
    label: string;
    count: number;
    caption: string;
    bg: string;
    ink: string;
    shape: string;
  }[] = [
    {
      value: "all",
      label: "Our people",
      count: pagination.total,
      caption: "The whole community",
      bg: "#E5E2FF",
      ink: "#6252BD",
      shape: "#C8BFFF",
    },
    {
      value: "member",
      label: "Members",
      count: roleCounts.member,
      caption: "Here to build",
      bg: "#DCEBFF",
      ink: "#365CA8",
      shape: "#B9D3FF",
    },
    {
      value: "core",
      label: "Core team",
      count: roleCounts.core,
      caption: "Making things happen",
      bg: "#DDF2E5",
      ink: "#287B56",
      shape: "#B5E3C9",
    },
    {
      value: "admin",
      label: "Admins",
      count: roleCounts.admin,
      caption: "Keeping things running",
      bg: "#FFE5A5",
      ink: "#875A00",
      shape: "#FFD36B",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#E5E2FF]/55 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-[45rem] h-80 w-80 rounded-full bg-[#FFE5A5]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
        <header>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#777584]">
            <span className="rounded-full border border-[#EAE6DE] bg-white px-3 py-1.5">
              AWS Student Builder Group
            </span>
            <span className="text-[#D1CBC1]">/</span>
            <span>Community directory</span>
          </div>

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.94] tracking-[-0.085em]">
                People make
                <br />
                the <span className="font-serif font-medium italic text-[#6252BD]">community.</span>
                <span className="text-[#F07832]">✳</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-[#777584] sm:text-base">
                Meet the builders behind the community. Find people, manage
                workspace identities, and keep access where it belongs.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#EAE6DE] bg-white p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE5A5] text-[#875A00]">
                <Users size={20} />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-[-0.06em]">
                  {pagination.total.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9693A1]">
                  Community accounts
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {roleCards.map((card) => {
            const active = role === card.value;

            return (
              <button
                key={card.value}
                type="button"
                onClick={() => changeRole(card.value)}
                className={`group relative min-h-[135px] overflow-hidden rounded-[1.5rem] border p-4 text-left transition duration-200 hover:-translate-y-1 sm:min-h-[155px] sm:p-5 ${
                  active
                    ? "border-transparent shadow-[0_8px_24px_rgba(36,35,51,0.07)]"
                    : "border-[#EAE6DE] bg-white/75 hover:border-transparent hover:shadow-[0_8px_24px_rgba(36,35,51,0.05)]"
                }`}
                style={active ? { backgroundColor: card.bg } : undefined}
              >
                <span
                  className="absolute -right-5 -top-7 h-24 w-24 rounded-full opacity-70 transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: card.shape }}
                />
                <span className="relative flex items-start justify-between">
                  <span
                    className="text-3xl font-semibold tracking-[-0.08em] sm:text-4xl"
                    style={{ color: active ? card.ink : "#242333" }}
                  >
                    {card.count.toLocaleString("en-IN")}
                  </span>
                  {active && (
                    <Check size={16} className="mt-1" style={{ color: card.ink }} />
                  )}
                </span>
                <span className="relative mt-4 block text-xs font-semibold sm:text-sm">
                  {card.label}
                </span>
                <span
                  className="relative mt-1 block text-[10px] sm:text-xs"
                  style={{ color: active ? card.ink : "#9693A1" }}
                >
                  {card.caption}
                </span>
              </button>
            );
          })}
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F07832]">
                The people directory
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] sm:text-3xl">
                Everyone in the room<span className="text-[#6252BD]">.</span>
              </h2>
              <p className="mt-1.5 text-xs text-[#9693A1]">
                Search people and manage their community roles.
              </p>
            </div>

            <form
              onSubmit={submitSearch}
              className="flex w-full items-center gap-2 sm:max-w-lg"
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[#EAE6DE] bg-white px-4 py-3 transition focus-within:border-[#BDB3F0] focus-within:ring-4 focus-within:ring-[#E5E2FF]/50">
                <Search size={17} className="shrink-0 text-[#9693A1]" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Name, email, or workspace UID..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A5A2AD]"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                    className="text-[#9693A1] transition hover:text-[#242333]"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
              <button
                type="submit"
                className="rounded-full bg-[#242333] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#6252BD]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {roleOptions.map((option) => {
              const active = role === option.value;
              const counts: Record<RoleFilter, number> = {
                all: pagination.total,
                member: roleCounts.member,
                core: roleCounts.core,
                admin: roleCounts.admin,
              };

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeRole(option.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-[#D3CCFF] bg-[#E5E2FF] text-[#6252BD]"
                      : "border-[#EAE6DE] bg-white text-[#777584] hover:bg-[#FCFBF8] hover:text-[#242333]"
                  }`}
                >
                  {option.label}
                  <span className="text-[10px] opacity-70">
                    {counts[option.value].toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-[#F2C7BA] bg-[#FFF0EA] p-4 text-sm text-[#A43F2A]"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#EAE6DE] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE6DE] bg-[#FCFBF8] px-4 py-4 sm:px-5">
              <div>
                <h3 className="text-sm font-semibold">Community members</h3>
                <p className="mt-1 text-[11px] text-[#9693A1]">
                  {loading
                    ? "Finding your people..."
                    : `${users.length} shown on this page`}
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-3 py-2 text-[11px] text-[#777584]">
                <ArrowDownUp size={13} />
                <span>Rows</span>
                <select
                  value={pagination.pageSize}
                  onChange={(event) => changePageSize(Number(event.target.value))}
                  className="bg-transparent font-semibold text-[#242333] outline-none"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <LoadingState />
            ) : users.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-[#F0EEE9]">
                {users.map((user, index) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    index={(pagination.page - 1) * pagination.pageSize + index + 1}
                    updating={updatingUserId === user.id}
                    onRoleChange={updateRole}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-[#EAE6DE] bg-[#FCFBF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-[#9693A1]">
                Showing{" "}
                <span className="font-semibold text-[#242333]">{rangeStart}</span>
                {" – "}
                <span className="font-semibold text-[#242333]">{rangeEnd}</span>
                {" of "}
                <span className="font-semibold text-[#242333]">
                  {pagination.total.toLocaleString("en-IN")}
                </span>
              </p>

              <PaginationControls
                page={pagination.page}
                totalPages={pagination.totalPages}
                pages={visiblePages}
                onPageChange={(nextPage) =>
                  loadUsers(nextPage, pagination.pageSize, search, role)
                }
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function UserRow({
  user,
  index,
  updating,
  onRoleChange,
}: {
  user: User;
  index: number;
  updating: boolean;
  onRoleChange: (userId: string, role: UserRole) => void;
}) {
  const style = roleStyles[user.role];

  return (
    <article className="group flex flex-col gap-4 p-4 transition-colors hover:bg-[#FCFBF8] sm:p-5 lg:flex-row lg:items-center">
      <span className="hidden w-8 shrink-0 font-mono text-[10px] text-[#B0ACB5] lg:block">
        {String(index).padStart(3, "0")}
      </span>

      <Link
        href={`/dashboard/users/${user.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Avatar user={user} />

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-[#242333] transition-colors group-hover:text-[#6252BD]">
              {user.full_name || "Unnamed user"}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold sm:hidden"
              style={{ backgroundColor: style.bg, color: style.ink }}
            >
              {user.role === "admin" && <Shield size={10} />}
              {style.label}
            </span>
          </span>
          <span className="mt-1 block truncate text-xs text-[#777584]">
            {user.email || "No email"}
          </span>
          <span className="mt-1.5 block truncate font-mono text-[9px] text-[#A5A2AD] sm:hidden">
            {user.workspace_name || user.workspace_uid || "No workspace linked"}
          </span>
        </span>

        <ArrowUpRight
          size={15}
          className="shrink-0 text-[#B0ACB5] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#6252BD]"
        />
      </Link>

      <div className="grid grid-cols-2 gap-3 pl-[52px] sm:grid-cols-[minmax(0,1fr)_150px] sm:gap-5 lg:w-[340px] lg:pl-0">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#B0ACB5] lg:hidden">
            Workspace
          </p>
          <p className="mt-1 truncate text-xs font-medium text-[#656474]">
            {user.workspace_name || "—"}
          </p>
          <p className="mt-1 truncate font-mono text-[9px] text-[#A5A2AD]">
            {user.workspace_uid || "No UID"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#B0ACB5] lg:hidden">
            Joined
          </p>
          <p className="mt-1 text-xs text-[#777584]">
            {formatDate(user.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pl-[52px] sm:pl-0 lg:w-[170px] lg:justify-end">
        <span
          className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold sm:inline-flex"
          style={{ backgroundColor: style.bg, color: style.ink }}
        >
          {user.role === "admin" && <Shield size={12} />}
          {style.label}
        </span>

        <RoleSelector
          value={user.role}
          disabled={updating}
          onChange={(nextRole) => onRoleChange(user.id, nextRole)}
        />
      </div>
    </article>
  );
}

function RoleSelector({
  value,
  disabled,
  onChange,
}: {
  value: UserRole;
  disabled: boolean;
  onChange: (role: UserRole) => void;
}) {
  const style = roleStyles[value];

  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as UserRole)}
        aria-label="Change user role"
        className="max-w-[125px] appearance-none rounded-full border py-2 pl-3 pr-8 text-[10px] font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: style.bg,
          borderColor: style.bg,
          color: style.ink,
        }}
      >
        <option value="member">Member</option>
        <option value="core">Core team</option>
        <option value="admin">Admin</option>
      </select>
      <ChevronRight
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90"
        style={{ color: style.ink }}
      />
    </div>
  );
}

function Avatar({ user }: { user: User }) {
  const initials =
    user.full_name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  const paletteIndex = user.id
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0) % 5;
  const palette = [
    { bg: "#E5E2FF", ink: "#6252BD" },
    { bg: "#DCEBFF", ink: "#365CA8" },
    { bg: "#DDF2E5", ink: "#287B56" },
    { bg: "#FFE5A5", ink: "#875A00" },
    { bg: "#FFDCCF", ink: "#B84F28" },
  ][paletteIndex];

  return (
    <span
      className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-sm font-bold"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={user.full_name || "User"}
          fill
          sizes="44px"
          className="object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}

function PaginationControls({
  page,
  totalPages,
  pages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  pages: number[];
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE6DE] bg-white text-[#777584] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD] disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`hidden h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold transition sm:flex ${
            pageNumber === page
              ? "bg-[#242333] text-white"
              : "text-[#777584] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <span className="px-2 text-xs text-[#777584] sm:hidden">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE6DE] bg-white text-[#777584] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD] disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-[#777584]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E2FF] border-t-[#6252BD]" />
      Finding your people...
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden px-5 py-16 text-center">
      <span className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-[#FFE5A5]/60" />
      <span className="absolute -bottom-8 -left-5 h-24 w-24 rounded-full bg-[#E5E2FF]/70" />
      <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
        <Users size={24} />
      </span>
      <h3 className="relative mt-4 text-xl font-semibold tracking-[-0.05em]">
        No one here just yet.
      </h3>
      <p className="relative mt-2 text-sm text-[#777584]">
        Try a different search or switch up the role filter.
      </p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
