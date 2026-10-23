"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Perks", href: "/perks" },
  { label: "Speakers", href: "/speakers" },
  { label: "Teams", href: "/teams" },
];

type AuthUser = {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: "member" | "core" | "admin";
};

export function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    setProfileOpen(false);
    setMobileOpen(false);

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) setUser(null);
          return;
        }

        const data = await response.json();

        if (mounted) {
          setUser(data.authenticated ? data.user : null);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeNavigation = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const displayName =
    user?.name || user?.email?.split("@")[0] || "Member";

  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EAE6DE] bg-[#FAF9F6]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={closeNavigation}
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo/aws_sbg.png"
            alt="AWS Student Builder Group at LPU"
            width={150}
            height={48}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-[#EAE6DE] bg-white/90 p-1 shadow-sm shadow-[#242333]/[0.04] lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] transition-colors xl:px-4 ${
                  active
                    ? "bg-[#FFF0D8] font-semibold text-[#9A4D00]"
                    : "font-medium text-[#686676] hover:bg-[#F7F4EE] hover:text-[#242333]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-[#EEEAE2]" />
          ) : user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-2.5 py-1.5 transition-colors hover:border-[#F07832]/60"
              >
                <Avatar
                  src={user.picture}
                  initials={initials}
                  name={displayName}
                />

                <div className="hidden max-w-28 text-left xl:block">
                  <p className="truncate text-xs font-semibold text-[#242333]">
                    {displayName}
                  </p>
                  <p className="truncate text-[10px] capitalize text-[#858292]">
                    {user.role}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-[#858292] transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <ProfileMenu
                  user={user}
                  displayName={displayName}
                  onNavigate={closeNavigation}
                />
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-2 rounded-full bg-[#F07832] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D96120]"
            >
              Sign in
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>

        <div className="ml-auto lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE6DE] bg-white text-[#242333] transition-colors hover:border-[#F07832] hover:bg-[#FFF0D8]">
              <Menu size={19} />
              <span className="sr-only">Open navigation</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] rounded-none border-l border-[#EAE6DE] bg-[#FAF9F6] p-0 text-[#242333]"
            >
              <SheetHeader className="border-b border-[#EAE6DE] p-5 text-left">
                <SheetTitle>
                  <Image
                    src="/images/logo/aws_sbg.png"
                    alt="AWS Student Builder Group at LPU"
                    width={150}
                    height={48}
                    className="h-9 w-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              {user && (
                <div className="border-b border-[#EAE6DE] p-5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.picture}
                      initials={initials}
                      name={displayName}
                      size="large"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#858292]">
                        {user.email}
                      </p>
                      <p className="mt-1 text-[11px] capitalize text-[#858292]">
                        {user.role} account
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Link
                      href="/dashboard"
                      onClick={closeNavigation}
                      className="flex items-center justify-center gap-1.5 rounded-full border border-[#EAE6DE] px-2 py-2.5 text-xs font-medium transition-colors hover:border-[#F07832] hover:bg-[#FFF0D8]"
                    >
                      Dashboard
                      <ArrowUpRight size={13} />
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeNavigation}
                      aria-current={
                        isActive("/dashboard/profile") ? "page" : undefined
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-full border px-2 py-2.5 text-xs font-medium transition-colors ${
                        isActive("/dashboard/profile")
                          ? "border-[#F07832] bg-[#FFF0D8] text-[#9A4D00]"
                          : "border-[#EAE6DE] hover:border-[#F07832] hover:bg-[#FFF0D8]"
                      }`}
                    >
                      <UserRound size={13} />
                      Profile
                    </Link>

                    <form action="/auth/logout" method="POST">
                      <button
                        type="submit"
                        aria-label="Log out"
                        title="Log out"
                        className="flex h-full min-h-10 w-10 items-center justify-center rounded-full border border-[#EAE6DE] text-[#686676] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1 p-4">
                {navigation.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeNavigation}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm transition-colors ${
                        active
                          ? "bg-[#FFF0D8] font-semibold text-[#9A4D00]"
                          : "text-[#686676] hover:bg-white hover:text-[#242333]"
                      }`}
                    >
                      {item.label}
                      <ArrowUpRight
                        size={15}
                        className={
                          active ? "text-[#F07832]" : "text-[#A5A1AD]"
                        }
                      />
                    </Link>
                  );
                })}

                {!user && !loading && (
                  <Link
                    href="/auth/login"
                    onClick={closeNavigation}
                    className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#F07832] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D96120]"
                  >
                    Sign in
                    <ArrowUpRight size={15} />
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({
  user,
  displayName,
  onNavigate,
}: {
  user: AuthUser;
  displayName: string;
  onNavigate: () => void;
}) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl border border-[#EAE6DE] bg-white p-2 shadow-xl shadow-[#242333]/10">
      <div className="border-b border-[#F0EDE7] px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={user.picture}
            initials={getInitials(displayName)}
            name={displayName}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#242333]">
              {displayName}
            </p>
            <p className="truncate text-xs text-[#858292]">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="py-1">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors ${
            pathnameIsDashboard() 
              ? "bg-[#FAF7F1] text-[#242333]"
              : "text-[#555365] hover:bg-[#FAF7F1] hover:text-[#242333]"
          }`}
        >
          <span className="flex items-center gap-3">
            <ArrowUpRight size={16} />
            Dashboard
          </span>
          <ArrowUpRight
            size={15}
            className="text-[#A5A1AD] group-hover:text-[#F07832]"
          />
        </Link>

        <Link
          href="/dashboard/profile"
          onClick={onNavigate}
          className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-[#555365] transition-colors hover:bg-[#FAF7F1] hover:text-[#242333]"
        >
          <span className="flex items-center gap-3">
            <UserRound size={16} />
            Profile
          </span>
          <ArrowUpRight
            size={15}
            className="text-[#A5A1AD] group-hover:text-[#F07832]"
          />
        </Link>

        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#555365] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Log out
          </button>
        </form>
      </div>

      <div className="border-t border-[#F0EDE7] px-3 py-2">
        <p className="text-[10px] font-medium capitalize tracking-wide text-[#858292]">
          {user.role} account
        </p>
      </div>
    </div>
  );
}

function Avatar({
  src,
  initials,
  name,
  size = "normal",
}: {
  src: string | null;
  initials: string;
  name: string;
  size?: "normal" | "large";
}) {
  const dimensions =
    size === "large" ? "h-11 w-11 text-sm" : "h-8 w-8 text-xs";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-[#FFE8C5] ${dimensions}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={size === "large" ? "44px" : "32px"}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-[#A65316]">
          {initials}
        </div>
      )}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function pathnameIsDashboard() {
  if (typeof window === "undefined") return false;

  return window.location.pathname === "/dashboard";
}