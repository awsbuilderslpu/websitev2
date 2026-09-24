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
  { label: "Community", href: "/community" },
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

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
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
        !profileRef.current.contains(
          event.target as Node,
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Member";

  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#111827]/95 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      <div className="mx-auto flex h-19 max-w-360 items-center px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-80"
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

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2.5 text-sm"
              >
                <span
                  className={
                    active
                      ? "text-white"
                      : "text-[#AEB4C0] transition-colors group-hover:text-white"
                  }
                >
                  {item.label}
                </span>

                <span
                  className={`absolute bottom-0 left-4 right-4 h-px origin-left bg-[#A855F7] transition-transform duration-200 ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}

          <div className="mx-4 h-6 w-px bg-white/10" />

          {loading ? (
            <div className="h-10 w-24 animate-pulse bg-white/5" />
          ) : user ? (
            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((open) => !open)
                }
                className="group flex items-center gap-2.5 border border-white/10 bg-white/3 px-2 py-1.5 transition-colors hover:border-white/20 hover:bg-white/6"
              >
                <Avatar
                  src={user.picture}
                  initials={initials}
                  name={displayName}
                />

                <div className="hidden max-w-30 text-left lg:block">
                  <p className="truncate text-xs font-medium text-white">
                    {displayName}
                  </p>

                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-[#737B8C]">
                    {user.role}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`ml-1 text-[#737B8C] transition-transform ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <ProfileMenu
                  user={user}
                  displayName={displayName}
                />
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-2 bg-[#A855F7] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF]"
            >
              <span>Sign in</span>

              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </nav>

        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-white/10 text-white transition-colors hover:border-[#A855F7] hover:bg-[#A855F7]">
              <Menu size={20} />
              <span className="sr-only">
                Open navigation
              </span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] rounded-none border-l border-white/10 bg-[#111827] p-0 text-white"
            >
              <SheetHeader className="border-b border-white/10 p-6 text-left">
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

              <div className="flex flex-col">
                {user && (
                  <div className="border-b border-white/10 p-5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.picture}
                        initials={initials}
                        name={displayName}
                        size="large"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {displayName}
                        </p>

                        <p className="mt-1 truncate text-xs text-[#737B8C]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href="/dashboard"
                        className="flex flex-1 items-center justify-center gap-2 border border-white/10 px-3 py-2.5 text-xs font-medium text-[#C7CAD2] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                      >
                        Dashboard
                        <ArrowUpRight size={14} />
                      </Link>

                      <Link
                        href="/auth/logout"
                        className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#9CA3AF] transition-colors hover:border-red-400/50 hover:bg-red-400/10 hover:text-red-300"
                        aria-label="Log out"
                      >
                        <LogOut size={16} />
                      </Link>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col p-4">
                  {navigation.map((item) => {
                    const active = isActive(
                      item.href,
                    );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center justify-between border-b border-white/[0.07] px-3 py-4 text-sm transition-colors ${
                          active
                            ? "text-white"
                            : "text-[#C7CAD2] hover:bg-white/4 hover:text-white"
                        }`}
                      >
                        <span>
                          {item.label}
                        </span>

                        <ArrowUpRight
                          size={15}
                          className={
                            active
                              ? "text-[#A855F7]"
                              : "text-[#6B7280] transition-colors group-hover:text-[#A855F7]"
                          }
                        />
                      </Link>
                    );
                  })}

                  {!user && !loading && (
                    <Link
                      href="/auth/login"
                      className="mt-5 flex items-center justify-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF]"
                    >
                      <span>Sign in</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  )}
                </nav>
              </div>
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
}: {
  user: AuthUser;
  displayName: string;
}) {
  return (
    <div className="absolute right-0 top-[calc(100%+10px)] w-70 border border-white/10 bg-[#111827] p-2 shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={user.picture}
            initials={getInitials(displayName)}
            name={displayName}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>

            <p className="truncate text-xs text-[#737B8C]">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="py-1">
        <Link
          href="/dashboard"
          className="group flex items-center justify-between px-3 py-3 text-sm text-[#C7CAD2] transition-colors hover:bg-white/5 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <UserRound size={16} />
            Dashboard
          </span>

          <ArrowUpRight
            size={15}
            className="text-[#6B7280] transition-colors group-hover:text-[#A855F7]"
          />
        </Link>

        <Link
          href="/auth/logout"
          className="group flex items-center gap-3 px-3 py-3 text-sm text-[#C7CAD2] transition-colors hover:bg-red-400/6 hover:text-red-300"
        >
          <LogOut size={16} />
          Log out
        </Link>
      </div>

      <div className="border-t border-white/10 px-3 py-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#596273]">
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
    size === "large"
      ? "h-11 w-11 text-sm"
      : "h-8 w-8 text-xs";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-[#A855F7]/15 ${dimensions}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={
            size === "large"
              ? "44px"
              : "32px"
          }
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-[#C084FC]">
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