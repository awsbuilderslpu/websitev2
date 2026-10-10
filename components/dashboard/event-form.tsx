
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Clock3, ImagePlus, MapPin, Save, Sparkles, Video, X } from "lucide-react";
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

export function EventForm({ mode, eventId, initialData }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>(initialData ?? emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function update<K extends keyof EventFormData>(key: K, value: EventFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
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
        ? { slug: generateSlug(value) }
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
        cover_image_url: form.cover_image_url || null,
        event_type: form.event_type,
        location: form.location || null,
        online_url: form.online_url || null,
        start_at: new Date(form.start_at).toISOString(),
        end_at: new Date(form.end_at).toISOString(),
        registration_deadline: new Date(form.registration_deadline).toISOString(),
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save event");
      }

      setSuccess(true);

      if (mode === "create") {
        window.location.href = `/dashboard/events/${data.event.id}`;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#E5E2FF]/55 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-[48rem] h-80 w-80 rounded-full bg-[#FFE5A5]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-6 sm:px-8 sm:py-9 lg:px-12">
        <Link
          href="/dashboard/events"
          className="group inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-4 py-2.5 text-xs font-semibold text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          All events
        </Link>

        <header className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#E5E2FF] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute -right-8 -top-14 h-48 w-48 rounded-full bg-[#C8BFFF] sm:h-64 sm:w-64" />
          <div className="pointer-events-none absolute -bottom-20 right-[22%] h-40 w-40 rotate-12 rounded-[3rem] bg-[#FFE5A5] sm:h-48 sm:w-48" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6252BD]">
              <Sparkles size={13} />
              The event studio
            </span>

            <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.085em]">
              {mode === "create" ? (
                <>
                  Let's make
                  <br />
                  <span className="font-serif font-medium italic text-[#6252BD]">something happen.</span>
                </>
              ) : (
                <>
                  Make it
                  <br />
                  <span className="font-serif font-medium italic text-[#6252BD]">even better.</span>
                </>
              )}
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-[#57516F] sm:text-base">
              {mode === "create"
                ? "A workshop, a meetup, a room full of builders. Start with the details and bring your next community moment to life."
                : "Every little detail counts. Give your event a refresh and keep the community in the loop."}
            </p>
          </div>

          <span className="absolute bottom-5 right-6 hidden rotate-12 font-serif text-5xl text-[#6252BD]/70 sm:block">
            ✳
          </span>
        </header>

        <form onSubmit={submit} className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 space-y-7">
            <FormSection
              number="01"
              title="The big idea"
              description="Give your event a name and a little personality."
              color="#E5E2FF"
              ink="#6252BD"
            >
              <Field
                label="Event title"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="AWS Student Community Day"
              />

              <Field
                label="Event URL slug"
                required
                value={form.slug}
                onChange={(value) => update("slug", generateSlug(value))}
                placeholder="aws-student-community-day"
                hint={`Your event URL will end in /events/${form.slug || "your-event-slug"}`}
              />

              <TextArea
                label="The description"
                value={form.description}
                onChange={(value) => update("description", value)}
                placeholder="What's the plan? What will people learn, build, or take away?"
              />
            </FormSection>

            <FormSection
              number="02"
              title="Set the scene"
              description="Where the magic happens, online or in person."
              color="#DDF2E5"
              ink="#287B56"
            >
              <div>
                <label className="mb-3 block text-xs font-semibold text-[#656474]">
                  How are we meeting?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ["offline", "In person", "Meet face to face"],
                    ["online", "Online", "Meet on the web"],
                    ["hybrid", "A bit of both", "Both worlds"],
                  ] as const).map(([value, label, description]) => {
                    const selected = form.event_type === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update("event_type", value)}
                        className={`rounded-2xl border p-3 text-left transition sm:p-4 ${
                          selected
                            ? "border-[#A6D7B8] bg-[#DDF2E5] shadow-[0_4px_14px_rgba(40,123,86,0.06)]"
                            : "border-[#EAE6DE] bg-white hover:border-[#B5E3C9]"
                        }`}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${selected ? "bg-white text-[#287B56]" : "bg-[#F5F2EC] text-[#777584]"}`}>
                          {value === "offline" ? <MapPin size={16} /> : value === "online" ? <Video size={16} /> : <CalendarDays size={16} />}
                        </span>
                        <span className="mt-3 block text-xs font-semibold leading-4 sm:text-sm">{label}</span>
                        <span className="mt-1 hidden text-[10px] leading-4 text-[#777584] sm:block">{description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(form.event_type === "offline" || form.event_type === "hybrid") && (
                <Field
                  label="Venue or location"
                  value={form.location}
                  onChange={(value) => update("location", value)}
                  placeholder="Lovely Professional University"
                />
              )}

              {(form.event_type === "online" || form.event_type === "hybrid") && (
                <Field
                  label="Online meeting URL"
                  type="url"
                  value={form.online_url}
                  onChange={(value) => update("online_url", value)}
                  placeholder="https://..."
                />
              )}

              <Field
                label="Cover image URL"
                type="url"
                value={form.cover_image_url}
                onChange={(value) => update("cover_image_url", value)}
                placeholder="https://..."
              />

              {form.cover_image_url && (
                <div className="overflow-hidden rounded-2xl border border-[#EAE6DE] bg-white p-2">
                  <img
                    src={form.cover_image_url}
                    alt="Event cover preview"
                    className="max-h-64 w-full rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {!form.cover_image_url && (
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#D8D3CA] bg-white/60 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE5A5] text-[#875A00]">
                    <ImagePlus size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Give it a cover</p>
                    <p className="mt-1 text-[11px] leading-4 text-[#777584]">
                      Add an image URL to preview your event artwork here.
                    </p>
                  </div>
                </div>
              )}
            </FormSection>

            <FormSection
              number="03"
              title="Pick the moment"
              description="Set your timings. Attendees need to know when to show up."
              color="#FFE5A5"
              ink="#875A00"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  label="Starts at"
                  value={form.start_at}
                  onChange={(value) => update("start_at", value)}
                  required
                />
                <DateField
                  label="Ends at"
                  value={form.end_at}
                  onChange={(value) => update("end_at", value)}
                  required
                />
              </div>

              <DateField
                label="Registration deadline"
                value={form.registration_deadline}
                onChange={(value) => update("registration_deadline", value)}
                required
              />

              <div className="flex items-start gap-3 rounded-2xl bg-[#FFF5D9] p-4">
                <Clock3 size={17} className="mt-0.5 shrink-0 text-[#A56A00]" />
                <p className="text-xs leading-5 text-[#875A00]">
                  Times are entered in your local timezone and converted to UTC when you save.
                </p>
              </div>
            </FormSection>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-[#EAE6DE] bg-white">
              <div className="bg-[#FFDCCF] px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B84F28]">
                    Before the world sees it
                  </span>
                  <span className="text-2xl text-[#B84F28]">✳</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-[#8E3D25]">
                  The final touches.
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#9D5137]">
                  Set the rules for your event.
                </p>
              </div>

              <div className="space-y-1 p-5 sm:p-6">
                <Toggle
                  label="Paid event"
                  description="Attendees need to pay to join."
                  checked={form.is_paid}
                  onChange={(value) => update("is_paid", value)}
                  color="#FFE5A5"
                  ink="#875A00"
                />
                <div className="h-px bg-[#F0EEE9]" />
                <Toggle
                  label="Publish event"
                  description="Make it visible to everyone."
                  checked={form.is_published}
                  onChange={(value) => update("is_published", value)}
                  color="#DDF2E5"
                  ink="#287B56"
                />
                <div className="h-px bg-[#F0EEE9]" />
                <Toggle
                  label="Cancel event"
                  description="Mark this event as cancelled."
                  checked={form.is_cancelled}
                  onChange={(value) => update("is_cancelled", value)}
                  color="#FFDCCF"
                  ink="#B84F28"
                />
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                {error && (
                  <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[#F2C7BA] bg-[#FFF0EA] p-3 text-xs leading-5 text-[#A43F2A]">
                    <X size={15} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-[#B5E3C9] bg-[#DDF2E5] p-3 text-xs leading-5 text-[#287B56]">
                    <Check size={15} className="mt-0.5 shrink-0" />
                    Event saved successfully.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#F07832] px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#DB6524] hover:shadow-[0_8px_20px_rgba(240,120,50,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading
                    ? "Saving your event..."
                    : mode === "create"
                      ? "Create event"
                      : "Save changes"}
                  {!loading && <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                </button>

                <Link
                  href="/dashboard/events"
                  className="mt-3 flex w-full items-center justify-center rounded-full px-4 py-2.5 text-xs font-semibold text-[#777584] transition hover:bg-[#F5F2EC] hover:text-[#242333]"
                >
                  Cancel and go back
                </Link>
              </div>
            </section>

            <div className="rounded-[1.5rem] bg-[#DCEBFF] p-5">
              <div className="flex items-center gap-2 text-[#365CA8]">
                <Sparkles size={16} />
                <span className="text-xs font-bold">A tiny reminder</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#365CA8]">
                Good events bring people together. Clear details help them show up.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function FormSection({
  number,
  title,
  description,
  color,
  ink,
  children,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
  ink: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-[#EAE6DE] bg-white/85 p-5 sm:p-7 lg:p-8">
      <div className="mb-7 flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] text-xs font-bold"
          style={{ backgroundColor: color, color: ink }}
        >
          {number}
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-xl font-semibold tracking-[-0.055em] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-[#777584] sm:text-sm">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
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
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">
        {label}
        {required && <span className="ml-1 text-[#F07832]">*</span>}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] px-4 py-3 text-sm text-[#242333] outline-none transition placeholder:text-[#B0ACB5] hover:border-[#D8D3CA] focus:border-[#BDB3F0] focus:bg-white focus:ring-4 focus:ring-[#E5E2FF]/50"
      />
      {hint && <span className="mt-2 block break-all text-[10px] leading-4 text-[#9693A1]">{hint}</span>}
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
      <span className="mb-2 block text-xs font-semibold text-[#656474]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-y rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] px-4 py-3 text-sm leading-6 text-[#242333] outline-none transition placeholder:text-[#B0ACB5] hover:border-[#D8D3CA] focus:border-[#BDB3F0] focus:bg-white focus:ring-4 focus:ring-[#E5E2FF]/50"
      />
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
      <span className="mb-2 block text-xs font-semibold text-[#656474]">
        {label}
        {required && <span className="ml-1 text-[#F07832]">*</span>}
      </span>
      <input
        required={required}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0 rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] px-3 py-3 text-sm text-[#242333] outline-none transition hover:border-[#D8D3CA] focus:border-[#BDB3F0] focus:bg-white focus:ring-4 focus:ring-[#E5E2FF]/50"
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  color,
  ink,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  color: string;
  ink: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-4 transition hover:bg-[#FCFBF8]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "" : "bg-[#E5E2DA]"}`}
        style={checked ? { backgroundColor: ink } : undefined}
      >
        <span className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#242333]">
          {label}
          {checked && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{ backgroundColor: color, color: ink }}
            >
              ON
            </span>
          )}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[#9693A1]">{description}</span>
      </span>
    </label>
  );
}