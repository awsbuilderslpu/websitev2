"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type EventFormData = {
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  event_type: "offline" | "online" | "hybrid";
  location: string;
  online_url: string;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  is_paid: boolean;
  is_published: boolean;
  is_cancelled: boolean;
};

type EventFormProps = {
  mode: "create" | "edit";
  eventId?: string;
  initialData?: EventFormData;
};

const emptyForm: EventFormData = {
  title: "",
  slug: "",
  description: "",
  cover_image_url: "",
  event_type: "offline",
  location: "",
  online_url: "",
  start_at: "",
  end_at: "",
  registration_deadline: "",
  is_paid: false,
  is_published: false,
  is_cancelled: false,
};

export function EventForm({
  mode,
  eventId,
  initialData,
}: EventFormProps) {
  const [form, setForm] = useState<EventFormData>(
    initialData ?? emptyForm,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  function update<K extends keyof EventFormData>(
    key: K,
    value: EventFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      ...(mode === "create" && !current.slug
        ? {
            slug: generateSlug(value),
          }
        : {}),
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        cover_image_url:
          form.cover_image_url || null,
        event_type: form.event_type,
        location: form.location || null,
        online_url: form.online_url || null,
        start_at: new Date(form.start_at).toISOString(),
        end_at: new Date(form.end_at).toISOString(),
        registration_deadline: new Date(
          form.registration_deadline,
        ).toISOString(),
        is_paid: form.is_paid,
        is_published: form.is_published,
        is_cancelled: form.is_cancelled,
      };

      const response = await fetch(
        mode === "create"
          ? "/api/v1/admin/events"
          : `/api/v1/admin/events/${eventId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save event",
        );
      }

      setSuccess(true);

      if (mode === "create") {
        window.location.href = `/dashboard/events/${data.event.id}`;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save event",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-300 px-5 py-14 sm:px-8 lg:px-10">
          <Link
            href="/dashboard/events"
            className="mb-8 inline-flex items-center gap-2 text-xs text-[#7F8797] transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to events
          </Link>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              {mode === "create"
                ? "New Event"
                : "Edit Event"}
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
              {mode === "create"
                ? "Create Event."
                : "Edit Event."}
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <form
          onSubmit={submit}
          className="grid gap-12 lg:grid-cols-[1fr_300px]"
        >
          <div className="space-y-12">
            <FormSection
              title="Event details"
              description="The basic information displayed throughout the site."
            >
              <Field
                label="Title"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="AWS Student Community Day 2026"
              />

              <Field
                label="Slug"
                required
                value={form.slug}
                onChange={(value) =>
                  update("slug", generateSlug(value))
                }
                placeholder="aws-student-community-day-2026"
              />

              <TextArea
                label="Description"
                value={form.description}
                onChange={(value) =>
                  update("description", value)
                }
                placeholder="Describe the event..."
              />
            </FormSection>

            <FormSection
              title="Format & location"
              description="Tell attendees how and where the event happens."
            >
              <Select
                label="Event type"
                value={form.event_type}
                onChange={(value) =>
                  update(
                    "event_type",
                    value as EventFormData["event_type"],
                  )
                }
                options={[
                  ["offline", "Offline"],
                  ["online", "Online"],
                  ["hybrid", "Hybrid"],
                ]}
              />

              {(form.event_type === "offline" ||
                form.event_type === "hybrid") && (
                <Field
                  label="Location"
                  value={form.location}
                  onChange={(value) =>
                    update("location", value)
                  }
                  placeholder="Lovely Professional University"
                />
              )}

              {(form.event_type === "online" ||
                form.event_type === "hybrid") && (
                <Field
                  label="Online URL"
                  type="url"
                  value={form.online_url}
                  onChange={(value) =>
                    update("online_url", value)
                  }
                  placeholder="https://..."
                />
              )}

              <Field
                label="Cover image URL"
                type="url"
                value={form.cover_image_url}
                onChange={(value) =>
                  update("cover_image_url", value)
                }
                placeholder="https://..."
              />
            </FormSection>

            <FormSection
              title="Schedule"
              description="Use your local event time. It will be converted to UTC for the API."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <DateField
                  label="Starts at"
                  value={form.start_at}
                  onChange={(value) =>
                    update("start_at", value)
                  }
                  required
                />

                <DateField
                  label="Ends at"
                  value={form.end_at}
                  onChange={(value) =>
                    update("end_at", value)
                  }
                  required
                />
              </div>

              <DateField
                label="Registration deadline"
                value={form.registration_deadline}
                onChange={(value) =>
                  update(
                    "registration_deadline",
                    value,
                  )
                }
                required
              />
            </FormSection>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-white/10 bg-[#0D1421] p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B45CFF]">
                Publishing
              </p>

              <div className="mt-6 space-y-5">
                <Toggle
                  label="Paid event"
                  description="The event requires payment."
                  checked={form.is_paid}
                  onChange={(value) =>
                    update("is_paid", value)
                  }
                />

                <Toggle
                  label="Published"
                  description="Make the event visible publicly."
                  checked={form.is_published}
                  onChange={(value) =>
                    update("is_published", value)
                  }
                />

                <Toggle
                  label="Cancelled"
                  description="Mark the event as cancelled."
                  checked={form.is_cancelled}
                  onChange={(value) =>
                    update("is_cancelled", value)
                  }
                />
              </div>

              {error && (
                <div className="mt-6 border border-red-400/20 bg-red-400/5 p-4 text-xs leading-5 text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-6 border border-emerald-400/20 bg-emerald-400/5 p-4 text-xs leading-5 text-emerald-300">
                  Event saved successfully.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />

                {loading
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Event"
                    : "Save Changes"}
              </button>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#737B8C]">
          {description}
        </p>
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#C7CAD2]">
        {label}
        {required && (
          <span className="ml-1 text-[#A855F7]">*</span>
        )}
      </span>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#C7CAD2]">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={6}
        className="w-full resize-y border border-white/10 bg-[#0D1421] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#C7CAD2]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none focus:border-[#A855F7]"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#C7CAD2]">
        {label}
        {required && (
          <span className="ml-1 text-[#A855F7]">*</span>
        )}
      </span>

      <input
        required={required}
        type="datetime-local"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none focus:border-[#A855F7]"
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="mt-1 h-4 w-4 accent-[#A855F7]"
      />

      <span>
        <span className="block text-sm font-medium text-white">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-[#737B8C]">
          {description}
        </span>
      </span>
    </label>
  );
}