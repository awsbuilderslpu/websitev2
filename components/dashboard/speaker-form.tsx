"use client";

import {
  ArrowLeft,
  Check,
  Eye,
  Globe,
  Save,
  UserRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SpeakerFormData = {
  name: string;
  bio: string;
  designation: string;
  company: string;
  avatar_url: string;
  linkedin_url: string;
  github_url: string;
  x_url: string;
  website_url: string;
  is_public: boolean;
};

type SpeakerFormProps = {
  mode: "create" | "edit";
  speakerId?: string;
  initialData?: Partial<SpeakerFormData>;
};

export function SpeakerForm({
  mode,
  speakerId,
  initialData,
}: SpeakerFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<SpeakerFormData>({
    name: initialData?.name ?? "",
    bio: initialData?.bio ?? "",
    designation: initialData?.designation ?? "",
    company: initialData?.company ?? "",
    avatar_url: initialData?.avatar_url ?? "",
    linkedin_url: initialData?.linkedin_url ?? "",
    github_url: initialData?.github_url ?? "",
    x_url: initialData?.x_url ?? "",
    website_url: initialData?.website_url ?? "",
    is_public: initialData?.is_public ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [form.avatar_url]);

  function updateField<K extends keyof SpeakerFormData>(
    field: K,
    value: SpeakerFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        mode === "create"
          ? "/api/v1/admin/speakers"
          : `/api/v1/admin/speakers/${speakerId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save speaker");
      }

      router.push("/dashboard/speakers");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save speaker",
      );
    } finally {
      setSaving(false);
    }
  }

  const initials =
    form.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <Link
          href="/dashboard/speakers"
          className="group inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-4 py-2.5 text-sm font-medium text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-1"
          />
          All speakers
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[30px] border border-[#EEE9E0] bg-white p-6 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#E5E2FF]" />
          <div className="pointer-events-none absolute right-40 top-24 h-16 w-16 rotate-12 rounded-[22px] bg-[#FFE5A5]" />
          <div className="pointer-events-none absolute bottom-0 right-24 h-14 w-14 rounded-full bg-[#DDF2E5]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF1E9] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B95526]">
                <UserRound size={13} />
                {mode === "create" ? "A new community voice" : "Speaker studio"}
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {mode === "create" ? (
                  <>
                    Give great ideas a{" "}
                    <span className="text-[#6252BD]">face.</span>
                  </>
                ) : (
                  <>
                    Make their story{" "}
                    <span className="text-[#6252BD]">shine.</span>
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#777586] sm:text-base">
                Add the person behind the ideas. Their profile can be reused
                across events, talks, workshops, and panels.
              </p>
            </div>

            <div className="relative flex items-center gap-4 rounded-[24px] border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-[#E5E2FF] text-xl font-semibold text-[#6252BD]">
                {form.avatar_url.trim() && !avatarFailed ? (
                  <img
                    src={form.avatar_url}
                    alt={form.name || "Speaker preview"}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0">
                <p className="max-w-44 truncate font-semibold">
                  {form.name || "Your speaker"}
                </p>
                <p className="mt-1 max-w-44 truncate text-xs text-[#777586]">
                  {form.designation || "Their designation"}
                </p>
                <p className="mt-1 max-w-44 truncate text-xs text-[#777586]">
                  {form.company || "Their company"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <section className="rounded-[28px] border border-[#EEE9E0] bg-white p-5 sm:p-7">
                <SectionHeading
                  number="01"
                  title="Meet the person"
                  description="Start with the details people will recognize."
                  color="lavender"
                />

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={form.name}
                    required
                    placeholder="e.g. Alex Morgan"
                    onChange={(value) => updateField("name", value)}
                  />

                  <Field
                    label="Designation"
                    value={form.designation}
                    placeholder="e.g. Cloud Architect"
                    onChange={(value) => updateField("designation", value)}
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Company or organization"
                      value={form.company}
                      placeholder="e.g. Amazon Web Services"
                      onChange={(value) => updateField("company", value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <TextareaField
                      label="Biography"
                      value={form.bio}
                      placeholder="Share their background, expertise, and what they love building..."
                      onChange={(value) => updateField("bio", value)}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#EEE9E0] bg-white p-5 sm:p-7">
                <SectionHeading
                  number="02"
                  title="Around the internet"
                  description="Help attendees discover more of their work."
                  color="peach"
                />

                <div className="mt-7 space-y-5">
                  <Field
                    label="Profile image URL"
                    value={form.avatar_url}
                    placeholder="https://example.com/avatar.jpg"
                    onChange={(value) => updateField("avatar_url", value)}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <SocialField
                        label="LinkedIn"
                        value={form.linkedin_url}
                        placeholder="https://linkedin.com/in/..."
                        icon={<span className="text-xs font-bold">in</span>}
                        onChange={(value) => updateField("linkedin_url", value)}
                      />

                      <SocialField
                        label="GitHub"
                        value={form.github_url}
                        placeholder="https://github.com/..."
                        icon={<span className="text-xs font-bold">GH</span>}
                        onChange={(value) => updateField("github_url", value)}
                      />

                    <SocialField
                      label="X"
                      value={form.x_url}
                      placeholder="https://x.com/..."
                      icon={<X size={15} />}
                      onChange={(value) => updateField("x_url", value)}
                    />

                    <SocialField
                      label="Personal website"
                      value={form.website_url}
                      placeholder="https://example.com"
                      icon={<Globe size={15} />}
                      onChange={(value) => updateField("website_url", value)}
                    />
                  </div>
                </div>
              </section>

              {error && (
                <div
                  role="alert"
                  className="rounded-[20px] border border-[#F1C7BC] bg-[#FFF1E9] p-4 text-sm text-[#963F2A]"
                >
                  <p className="font-semibold">Couldn't save this speaker.</p>
                  <p className="mt-1 leading-6">{error}</p>
                </div>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <section className="overflow-hidden rounded-[28px] border border-[#EEE9E0] bg-white">
                <div className="bg-[#DDF2E5] px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#287B56]">
                    <Eye size={14} />
                    Public profile
                  </div>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#244A39]">
                    Ready for the spotlight?
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-[#487460]">
                    Choose whether this profile should be publicly visible.
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.is_public}
                    onClick={() => updateField("is_public", !form.is_public)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {form.is_public ? "Visible to everyone" : "Hidden from public"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#777586]">
                        {form.is_public
                          ? "The profile can appear on public speaker pages."
                          : "The profile is marked as private."}
                      </p>
                    </div>

                    <span
                      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                        form.is_public ? "bg-[#287B56]" : "bg-[#D7D3CC]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          form.is_public ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </button>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#FAF9F6] p-3.5">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        form.is_public
                          ? "bg-[#DDF2E5] text-[#287B56]"
                          : "bg-[#F3F0E9] text-[#777586]"
                      }`}
                    >
                      {form.is_public ? <Check size={14} /> : <Eye size={14} />}
                    </div>
                    <p className="text-xs leading-5 text-[#777586]">
                      {form.is_public
                        ? "This profile is set to public. Save your changes to apply the setting."
                        : "This profile is set to hidden. Save your changes to apply the setting."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#EEE9E0] bg-[#E5E2FF] p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6252BD]">
                  Before you save
                </p>
                <ul className="mt-4 space-y-3 text-xs leading-5 text-[#51458F]">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0" />
                    <span>Make sure the speaker's name is correct.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0" />
                    <span>Use a publicly accessible image URL.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0" />
                    <span>Double-check social profile links.</span>
                  </li>
                </ul>
              </section>

              <div className="rounded-[28px] border border-[#EEE9E0] bg-white p-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#242333] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#6252BD] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving
                    ? "Saving speaker..."
                    : mode === "create"
                      ? "Create speaker"
                      : "Save changes"}
                </button>

                <Link
                  href="/dashboard/speakers"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[#656474] transition hover:bg-[#F3F0E9]"
                >
                  Cancel
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

function SectionHeading({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: "lavender" | "peach";
}) {
  const styles = {
    lavender: "bg-[#E5E2FF] text-[#6252BD]",
    peach: "bg-[#FFDCCF] text-[#B95526]",
  };

  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${styles[color]}`}
      >
        {number}
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1.5 text-sm leading-6 text-[#777586]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  required,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">
        {label}
        {required && <span className="ml-1 text-[#F07832]">*</span>}
      </span>
      <input
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[#EAE6DE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#242333] outline-none transition placeholder:text-[#AAA7B3] focus:border-[#B9B0F5] focus:bg-white focus:ring-2 focus:ring-[#E5E2FF]"
      />
    </label>
  );
}

function SocialField({
  label,
  value,
  placeholder,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#656474]">
        <span className="text-[#6252BD]">{icon}</span>
        {label}
      </span>
      <input
        type="url"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[#EAE6DE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#242333] outline-none transition placeholder:text-[#AAA7B3] focus:border-[#B9B0F5] focus:bg-white focus:ring-2 focus:ring-[#E5E2FF]"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">
        {label}
      </span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="w-full resize-y rounded-2xl border border-[#EAE6DE] bg-[#FAF9F6] px-4 py-3.5 text-sm leading-6 text-[#242333] outline-none transition placeholder:text-[#AAA7B3] focus:border-[#B9B0F5] focus:bg-white focus:ring-2 focus:ring-[#E5E2FF]"
      />
    </label>
  );
}