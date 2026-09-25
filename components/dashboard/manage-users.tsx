"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type UserRole =
  | "member"
  | "core"
  | "admin";

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

const roleOptions: {
  value: "all" | UserRole;
  label: string;
}[] = [
  {
    value: "all",
    label: "All roles",
  },
  {
    value: "member",
    label: "Member",
  },
  {
    value: "core",
    label: "Core",
  },
  {
    value: "admin",
    label: "Admin",
  },
];

const pageSizeOptions = [10, 20, 50];

export function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 1,
    });

  const [roleCounts, setRoleCounts] =
    useState<RoleCounts>({
      member: 0,
      core: 0,
      admin: 0,
    });

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [role, setRole] = useState<
    "all" | UserRole
  >("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingUserId, setUpdatingUserId] =
    useState<string | null>(null);

  async function loadUsers(
    page = pagination.page,
    pageSize = pagination.pageSize,
    currentSearch = search,
    currentRole = role,
  ) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set(
        "page",
        String(page),
      );

      params.set(
        "pageSize",
        String(pageSize),
      );

      if (currentSearch) {
        params.set(
          "search",
          currentSearch,
        );
      }

      if (currentRole !== "all") {
        params.set(
          "role",
          currentRole,
        );
      }

      const response = await fetch(
        `/api/v1/admin/users?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to fetch users",
        );
      }

      setUsers(data.users ?? []);
      setPagination(data.pagination);

      if (data.roleCounts) {
        setRoleCounts(
          data.roleCounts,
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch users",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(
      1,
      pagination.pageSize,
      "",
      "all",
    );
  }, []);

  function submitSearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextSearch =
      searchInput.trim();

    setSearch(nextSearch);

    loadUsers(
      1,
      pagination.pageSize,
      nextSearch,
      role,
    );
  }

  function changeRole(
    nextRole: "all" | UserRole,
  ) {
    setRole(nextRole);

    loadUsers(
      1,
      pagination.pageSize,
      search,
      nextRole,
    );
  }

  function changePageSize(
    nextPageSize: number,
  ) {
    loadUsers(
      1,
      nextPageSize,
      search,
      role,
    );
  }

  async function updateRole(
    userId: string,
    nextRole: UserRole,
  ) {
    try {
      setUpdatingUserId(userId);
      setError("");

      const response = await fetch(
        `/api/v1/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            role: nextRole,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update user",
        );
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: nextRole,
              }
            : user,
        ),
      );

      setRoleCounts((current) => {
        const previousUser =
          users.find(
            (user) =>
              user.id === userId,
          );

        if (
          !previousUser ||
          previousUser.role === nextRole
        ) {
          return current;
        }

        return {
          ...current,
          [previousUser.role]:
            Math.max(
              0,
              current[
                previousUser.role
              ] - 1,
            ),
          [nextRole]:
            current[nextRole] + 1,
        };
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update user",
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  const visiblePages = useMemo(() => {
    const totalPages =
      pagination.totalPages;

    if (totalPages <= 5) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    const current =
      pagination.page;

    if (current <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (
      current >=
      totalPages - 2
    ) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      current - 2,
      current - 1,
      current,
      current + 1,
      current + 2,
    ];
  }, [pagination]);

  const rangeStart =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) *
          pagination.pageSize +
        1;

  const rangeEnd = Math.min(
    pagination.page *
      pagination.pageSize,
    pagination.total,
  );

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-360 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                Administration
              </div>

              <h1 className="text-5xl font-semibold tracking-tighter sm:text-6xl">
                Manage Users.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#8F96A5]">
                Manage community accounts,
                workspace identities, and
                access roles.
              </p>
            </div>

            <div className="flex gap-8">
              <Stat
                value={pagination.total}
                label={
                  pagination.total === 1
                    ? "User"
                    : "Users"
                }
              />

              <div className="h-10 w-px bg-white/10" />

              <Stat
                value={roleCounts.admin}
                label="Admins"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-center xl:justify-between">
          <form
            onSubmit={submitSearch}
            className="flex w-full max-w-xl"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#596273]"
              />

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search name, email, or workspace UID..."
                className="w-full border border-white/10 bg-[#0D1421] py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7]"
              />
            </div>

            <button
              type="submit"
              className="border border-l-0 border-white/10 bg-[#172033] px-5 text-sm font-medium text-[#C7CAD2] transition-colors hover:bg-[#A855F7] hover:text-white"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {roleOptions.map(
              (option) => {
                const active =
                  role ===
                  option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      changeRole(
                        option.value,
                      )
                    }
                    className={`border px-4 py-2.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-[#A855F7] bg-[#A855F7] text-white"
                        : "border-white/10 text-[#8F96A5] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="hidden border-y border-white/10 bg-[#0D1421] lg:grid lg:grid-cols-[56px_1fr_220px_180px_150px_52px] lg:items-center">
            <div className="px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
              #
            </div>

            <div className="px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
              User
            </div>

            <div className="px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
              Workspace
            </div>

            <div className="px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
              Role
            </div>

            <div className="px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
              Joined
            </div>

            <div />
          </div>

          {loading ? (
            <LoadingState />
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="border-t border-white/10">
              {users.map(
                (user, index) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    index={
                      (pagination.page - 1) *
                        pagination.pageSize +
                      index +
                      1
                    }
                    updating={
                      updatingUserId ===
                      user.id
                    }
                    onRoleChange={
                      updateRole
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <p className="text-xs text-[#596273]">
              Showing{" "}
              <span className="text-[#C7CAD2]">
                {rangeStart}
              </span>{" "}
              –{" "}
              <span className="text-[#C7CAD2]">
                {rangeEnd}
              </span>{" "}
              of{" "}
              <span className="text-[#C7CAD2]">
                {pagination.total}
              </span>
            </p>

            <select
              value={
                pagination.pageSize
              }
              onChange={(event) =>
                changePageSize(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="border border-white/10 bg-[#0D1421] px-3 py-2 text-xs text-[#C7CAD2] outline-none focus:border-[#A855F7]"
            >
              {pageSizeOptions.map(
                (size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    {size} / page
                  </option>
                ),
              )}
            </select>
          </div>

          <PaginationControls
            page={pagination.page}
            totalPages={
              pagination.totalPages
            }
            pages={visiblePages}
            onPageChange={(nextPage) =>
              loadUsers(
                nextPage,
                pagination.pageSize,
                search,
                role,
              )
            }
          />
        </div>
      </section>
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
  onRoleChange: (
    userId: string,
    role: UserRole,
  ) => void;
}) {
  return (
    <article className="group border-b border-white/10 transition-colors hover:bg-white/2 lg:grid lg:grid-cols-[56px_1fr_220px_180px_150px_52px] lg:items-center">
      <div className="hidden px-4 lg:block">
        <span className="font-mono text-[10px] text-[#596273]">
          {String(index).padStart(
            3,
            "0",
          )}
        </span>
      </div>

      <Link
        href={`/dashboard/users/${user.id}`}
        className="block px-4 py-6"
      >
        <div className="flex items-center gap-4">
          <Avatar user={user} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#B45CFF]">
                {user.full_name ||
                  "Unnamed user"}
              </p>

              <ArrowUpRight
                size={14}
                className="shrink-0 text-[#596273] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#A855F7]"
              />
            </div>

            <p className="mt-1 truncate text-xs text-[#737B8C]">
              {user.email ||
                "No email"}
            </p>

            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#596273] lg:hidden">
              {user.workspace_name ||
                user.workspace_uid ||
                "No workspace"}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-5 lg:py-6">
        <p className="text-sm text-[#C7CAD2]">
          {user.workspace_name ||
            "—"}
        </p>

        <p className="mt-1 font-mono text-[9px] text-[#596273]">
          {user.workspace_uid ||
            "No workspace UID"}
        </p>
      </div>

      <div className="px-4 pb-5 lg:py-6">
        <div className="relative inline-flex">
          <RoleSelector
            value={user.role}
            disabled={updating}
            onChange={(role) =>
              onRoleChange(
                user.id,
                role,
              )
            }
          />
        </div>
      </div>

      <div className="px-4 pb-5 lg:py-6">
        <p className="text-xs text-[#737B8C]">
          {formatDate(
            user.created_at,
          )}
        </p>
      </div>

      <div className="hidden px-4 lg:flex lg:justify-center">
        <Link
          href={`/dashboard/users/${user.id}`}
          className="flex h-9 w-9 items-center justify-center border border-white/10 text-[#596273] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
          aria-label={`View ${user.full_name || "user"}`}
        >
          <ArrowUpRight size={15} />
        </Link>
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
  onChange: (
    role: UserRole,
  ) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target
              .value as UserRole,
          )
        }
        className={`appearance-none border bg-[#0D1421] py-2 pl-8 pr-9 text-xs font-medium uppercase tracking-[0.08em] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          value === "admin"
            ? "border-[#A855F7]/40 text-[#C084FC]"
            : value === "core"
              ? "border-blue-400/20 text-blue-300"
              : "border-white/10 text-[#8F96A5]"
        }`}
      >
        <option value="member">
          Member
        </option>

        <option value="core">
          Core
        </option>

        <option value="admin">
          Admin
        </option>
      </select>

      {value === "admin" ? (
        <Shield
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A855F7]"
        />
      ) : (
        <UserRound
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#596273]"
        />
      )}
    </div>
  );
}

function Avatar({
  user,
}: {
  user: User;
}) {
  const initials =
    user.full_name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase(),
      )
      .join("") || "?";

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#172033]">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={
            user.full_name ||
            "User"
          }
          fill
          sizes="44px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#A855F7]">
          {initials}
        </div>
      )}
    </div>
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
  onPageChange: (
    page: number,
  ) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="flex h-9 w-9 items-center justify-center border border-white/10 text-[#737B8C] transition-colors hover:border-[#A855F7] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map(
        (pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onPageChange(
                pageNumber,
              )
            }
            className={`hidden h-9 min-w-9 items-center justify-center border px-2 text-xs sm:flex ${
              pageNumber === page
                ? "border-[#A855F7] bg-[#A855F7] text-white"
                : "border-white/10 text-[#737B8C] hover:border-white/20 hover:text-white"
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <span className="px-2 text-xs text-[#596273] sm:hidden">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={
          page >= totalPages
        }
        onClick={() =>
          onPageChange(page + 1)
        }
        className="flex h-9 w-9 items-center justify-center border border-white/10 text-[#737B8C] transition-colors hover:border-[#A855F7] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#596273]">
        {label}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="border-b border-white/10 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#596273]">
        Loading users...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-b border-white/10 py-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B45CFF]">
        No users
      </p>

      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
        No users match the current filters.
      </h2>

      <p className="mt-3 text-sm text-[#737B8C]">
        Try another search or role filter.
      </p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}