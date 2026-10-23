"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  ShieldCheck,
  Code2,
  Users,
  Sparkles,
  LoaderCircle,
  Eye,
  EyeOff,
} from "lucide-react";

type LoginMethod = "google" | "password" | null;

function getSafeNextPath(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/dashboard";
  }

  try {
    const base = new URL("https://internal.invalid");
    const target = new URL(value, base);

    if (target.origin !== base.origin) {
      return "/dashboard";
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/dashboard";
  }
}

function getAuthError(value: string | null): string | null {
  switch (value) {
    case "oauth_start_failed":
      return "We couldn't start Google sign-in. Please try again.";
    case "oauth_callback_failed":
      return "Google sign-in couldn't be completed. Please try again.";
    case "profile_lookup_failed":
      return "We couldn't verify your account. Please try again later.";
    case "logout_failed":
      return "Sign-out failed. Please try again.";
    default:
      return null;
  }
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20.4 20.4 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.6a12.2 12.2 0 0 1 0-7.2v-5.3H5.8a20.1 20.1 0 0 0 0 17.8l6.8-5.3Z"
      />
      <path
        fill="#EA4335"
        d="M24 12c3 0 5.6 1 7.7 3.1l5.8-5.8C34 5.9 29.5 4 24 4A20.4 20.4 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
      />
    </svg>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<LoginMethod>(null);
  const [error, setError] = useState<string | null>(
    getAuthError(searchParams.get("error")),
  );

  const next = getSafeNextPath(searchParams.get("next"));
  const isLoading = loadingMethod !== null;

  function handleGoogleLogin() {
    if (isLoading) return;

    setLoadingMethod("google");
    setError(null);

    const params = new URLSearchParams({ next });

    window.location.assign(`/auth/login/start?${params.toString()}`);
  }

  async function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Enter both your email address and password.");
      return;
    }

    setLoadingMethod("password");
    setError(null);

    try {
      const response = await fetch("/auth/login/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const result: {
        ok?: boolean;
        error?: string;
        message?: string;
        redirect?: string;
      } = await response.json().catch(() => ({}));

      if (
        response.status === 403 &&
        result.error === "account_not_approved" &&
        result.redirect === "https://sso.awslpu.in/"
      ) {
        window.location.assign(result.redirect);
        return;
      }

      if (!response.ok || !result.ok) {
        if (result.error === "profile_lookup_failed") {
          throw new Error(
            "We couldn't verify your account. Please try again later.",
          );
        }

        if (result.error === "invalid_request" ||
            result.error === "invalid_credentials_format") {
          throw new Error("Enter a valid email address and password.");
        }

        throw new Error("Invalid email or password.");
      }

      window.location.assign(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
      setLoadingMethod(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f6] text-[#161616]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl"
      />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232f3e] text-white">
            <Cloud size={23} strokeWidth={2} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight">
              AWS Student Builder Group
            </p>
            <p className="text-xs text-neutral-500">
              Lovely Professional University
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="hidden items-center gap-2 text-sm text-neutral-600 transition hover:text-black sm:flex"
        >
          Back to home
          <ArrowRight size={15} />
        </Link>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-orange-800">
            <Sparkles size={14} />
            Build. Learn. Ship.
          </div>

          <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Your next idea
            <br />
            starts <span className="text-orange-600">here.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-neutral-600 sm:text-lg">
            Sign in to access your community dashboard, manage your profile,
            and stay connected with the AWS Student Builder Group at LPU.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <Users size={19} className="text-neutral-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  Your builder community
                </h2>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Keep up with community activities, events, and opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <Code2 size={19} className="text-neutral-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  Tools for student builders
                </h2>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Access the platforms and resources available to your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <ShieldCheck size={19} className="text-neutral-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Secure sign-in</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Sign in with Google or your registered email and password.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.18)] sm:p-10">
            <div className="mb-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <Cloud size={25} />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Sign in to continue to your account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  maxLength={320}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 disabled:bg-neutral-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    maxLength={1024}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 disabled:bg-neutral-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#232f3e] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#34465a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMethod === "password" ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in with email
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs text-neutral-400">OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-semibold transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMethod === "google" ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Redirecting to Google...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            <div className="mt-6 rounded-xl bg-[#faf9f6] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-neutral-600"
                />
                <p className="text-xs leading-5 text-neutral-600">
                  Access is available to approved accounts. If your account
                  isn't registered with the community, you'll be redirected
                  to the account access portal.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-neutral-400">
              By continuing, you agree to use community resources responsibly.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Need help accessing your account?{" "}
            <a
              href="https://sso.awslpu.in/"
              className="font-medium text-neutral-800 underline underline-offset-4 hover:text-orange-700"
            >
              Visit the access portal
            </a>
          </p>
        </div>
      </section>

      <footer className="relative border-t border-neutral-200/70 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>AWS Student Builder Group · LPU</p>
          <p>Built for the builders of tomorrow.</p>
        </div>
      </footer>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
          <LoaderCircle
            size={28}
            className="animate-spin text-orange-600"
          />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}