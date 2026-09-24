"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

  function updateField<K extends keyof SpeakerFormData>(
    field: K,
    value: SpeakerFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
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
        throw new Error(
          data.error || "Failed to save speaker",
        );
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

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <Link
          href="/dashboard/speakers"
          className="inline-flex items-center gap-2 text-sm text-[#737B8C] transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Speakers
        </Link>

        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
            <span className="h-px w-8 bg-[#A855F7]" />
            {mode === "create"
              ? "New speaker"
              : "Edit speaker"}
          </div>

          <h1 className="text-5xl font-bold tracking-[-0.055em]">
            {mode === "create"
              ? "Add Speaker."
              : "Edit Speaker."}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8F96A5]">
            Speaker information is reused across events and
            sessions.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 border-t border-white/10"
        >
          <div className="grid gap-10 border-b border-white/10 py-10 lg:grid-cols-[0.45fr_1fr]">
            <FieldIntro
              title="Identity"
              description="The basic public information for this speaker."
            />

            <div className="space-y-6">
              <Field
                label="Name"
                value={form.name}
                required
                onChange={(value) =>
                  updateField("name", value)
                }
              />

              <Field
                label="Designation"
                value={form.designation}
                onChange={(value) =>
                  updateField("designation", value)
                }
              />

              <Field
                label="Company"
                value={form.company}
                onChange={(value) =>
                  updateField("company", value)
                }
              />

              <TextareaField
                label="Bio"
                value={form.bio}
                onChange={(value) =>
                  updateField("bio", value)
                }
              />
            </div>
          </div>

          <div className="grid gap-10 border-b border-white/10 py-10 lg:grid-cols-[0.45fr_1fr]">
            <FieldIntro
              title="Profile"
              description="Avatar and public social links."
            />

            <div className="space-y-6">
              <Field
                label="Avatar URL"
                value={form.avatar_url}
                onChange={(value) =>
                  updateField("avatar_url", value)
                }
              />

              <Field
                label="LinkedIn URL"
                value={form.linkedin_url}
                onChange={(value) =>
                  updateField("linkedin_url", value)
                }
              />

              <Field
                label="GitHub URL"
                value={form.github_url}
                onChange={(value) =>
                  updateField("github_url", value)
                }
              />

              <Field
                label="X URL"
                value={form.x_url}
                onChange={(value) =>
                  updateField("x_url", value)
                }
              />

              <Field
                label="Website URL"
                value={form.website_url}
                onChange={(value) =>
                  updateField("website_url", value)
                }
              />
            </div>
          </div>

          <div className="grid gap-10 border-b border-white/10 py-10 lg:grid-cols-[0.45fr_1fr]">
            <FieldIntro
              title="Visibility"
              description="Control whether this speaker appears publicly."
            />

            <label className="flex items-center gap-3 text-sm text-[#C7CAD2]">
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(event) =>
                  updateField(
                    "is_public",
                    event.target.checked,
                  )
                }
                className="h-4 w-4 accent-[#A855F7]"
              />

              Publicly visible
            </label>
          </div>

          {error && (
            <div className="mt-8 border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#A855F7] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {saving
                ? "Saving..."
                : mode === "create"
                  ? "Create Speaker"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FieldIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-2 max-w-xs text-sm leading-6 text-[#737B8C]">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-[#8F96A5]">
        {label}
        {required && (
          <span className="ml-1 text-[#A855F7]">*</span>
        )}
      </span>

      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7]"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-[#8F96A5]">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={6}
        className="w-full resize-y border border-white/10 bg-[#0D1421] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7]"
      />
    </label>
  );
}