
"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  GripVertical,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Speaker = {
  id: string;
  name: string;
  designation: string | null;
  company: string | null;
  avatar_url: string | null;
  is_public: boolean;
};

type Session = {
  id: string;
  title: string;
  description: string | null;
  talk_type: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  sort_order: number;
  talk_speakers: {
    speaker_id: string;
    sort_order: number;
  }[];
};

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  event_type: string;
  location: string | null;
  online_url: string | null;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  is_paid: boolean;
  is_published: boolean;
  is_cancelled: boolean;
  talks: Session[];
};

type ManageEventProps = {
  event: Event;
  speakers: Speaker[];
};

const sessionTypes = [
  { value: "keynote", label: "Keynote" },
  { value: "session", label: "Session" },
  { value: "workshop", label: "Workshop" },
  { value: "panel", label: "Panel" },
  { value: "fireside_chat", label: "Fireside Chat" },
  { value: "demo", label: "Demo" },
  { value: "other", label: "Other" },
];

const palettes = [
  { bg: "#E5E2FF", ink: "#6252BD", shape: "#C8BFFF" },
  { bg: "#FFE5A5", ink: "#875A00", shape: "#FFD36B" },
  { bg: "#DDF2E5", ink: "#287B56", shape: "#B5E3C9" },
  { bg: "#FFDCCF", ink: "#B84F28", shape: "#FFBEA7" },
  { bg: "#DCEBFF", ink: "#365CA8", shape: "#B9D3FF" },
];

export function ManageEvent({ event, speakers }: ManageEventProps) {
  const router = useRouter();

  const [eventData, setEventData] = useState({
    title: event.title,
    slug: event.slug,
    description: event.description ?? "",
    cover_image_url: event.cover_image_url ?? "",
    event_type: event.event_type,
    location: event.location ?? "",
    online_url: event.online_url ?? "",
    start_at: toInputDateTime(event.start_at),
    end_at: toInputDateTime(event.end_at),
    registration_deadline: toInputDateTime(
      event.registration_deadline,
    ),
    is_paid: event.is_paid,
    is_published: event.is_published,
    is_cancelled: event.is_cancelled,
  });

  const [sessions, setSessions] = useState<Session[]>(
    event.talks.map((talk) => ({
      ...talk,
      talk_speakers: talk.talk_speakers ?? [],
    })),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function updateEventField(
    field: keyof typeof eventData,
    value: string | boolean,
  ) {
    setEventData((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function addSession() {
    setSessions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: "",
        description: null,
        talk_type: "session",
        starts_at: null,
        ends_at: null,
        location: null,
        sort_order: current.length,
        talk_speakers: [],
      },
    ]);
    setSaved(false);
  }

  function updateSession(
    id: string,
    field: keyof Session,
    value: string | null | number,
  ) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, [field]: value } : session,
      ),
    );
    setSaved(false);
  }

  function removeSession(id: string) {
    setSessions((current) =>
      current
        .filter((session) => session.id !== id)
        .map((session, index) => ({ ...session, sort_order: index })),
    );
    setSaved(false);
  }

  function toggleSpeaker(sessionId: string, speakerId: string) {
    setSessions((current) =>
      current.map((session) => {
        if (session.id !== sessionId) return session;

        const exists = session.talk_speakers.some(
          (item) => item.speaker_id === speakerId,
        );

        return {
          ...session,
          talk_speakers: exists
            ? session.talk_speakers.filter(
                (item) => item.speaker_id !== speakerId,
              )
            : [
                ...session.talk_speakers,
                {
                  speaker_id: speakerId,
                  sort_order: session.talk_speakers.length,
                },
              ],
        };
      }),
    );
    setSaved(false);
  }

  async function saveEvent(
    eventObject?: React.FormEvent<HTMLFormElement>,
  ) {
    eventObject?.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response = await fetch(
        `/api/v1/admin/events/${event.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: eventData,
            sessions,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save event");
      }

      setSaved(true);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save event",
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedSessionCount = sessions.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#E5E2FF]/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-[52rem] h-80 w-80 rounded-full bg-[#FFE5A5]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-6 sm:px-8 sm:py-9 lg:px-12">
        <Link
          href="/dashboard/events"
          className="group inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-4 py-2.5 text-xs font-semibold text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          All events
        </Link>

        <header className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#E5E2FF] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <span className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-[#C8BFFF] sm:h-64 sm:w-64" />
          <span className="pointer-events-none absolute -bottom-16 right-[22%] h-36 w-36 rotate-12 rounded-[2.5rem] bg-[#FFE5A5] sm:h-44 sm:w-44" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6252BD]">
                <Sparkles size={13} />
                The event studio
              </span>

              <h1 className="mt-6 break-words text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.085em]">
                Let's make
                <br />
                <span className="font-serif font-medium italic text-[#6252BD]">
                  it happen.
                </span>
                <span className="text-[#F07832]">✳</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-[#57516F] sm:text-base">
                Fine-tune the details, shape the programme, and get your
                community ready for something good.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3.5 py-2 text-xs font-semibold ${
                  eventData.is_cancelled
                    ? "text-[#B84F28]"
                    : eventData.is_published
                      ? "text-[#287B56]"
                      : "text-[#777584]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    eventData.is_cancelled
                      ? "bg-[#F07832]"
                      : eventData.is_published
                        ? "bg-[#43A878]"
                        : "bg-[#B4B0BC]"
                  }`}
                />
                {eventData.is_cancelled
                  ? "Cancelled"
                  : eventData.is_published
                    ? "Published"
                    : "Draft"}
              </span>

              <button
                type="button"
                onClick={() => saveEvent()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#F07832] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#DB6524] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save changes"}
                {!saving && <ArrowUpRight size={15} />}
              </button>
            </div>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <QuickFact
            icon={<CalendarDays size={17} />}
            label="Event dates"
            value={formatShortDate(eventData.start_at)}
            color="#FFE5A5"
            ink="#875A00"
          />
          <QuickFact
            icon={<Users size={17} />}
            label="Programme"
            value={`${selectedSessionCount} ${selectedSessionCount === 1 ? "session" : "sessions"}`}
            color="#DDF2E5"
            ink="#287B56"
          />
          <QuickFact
            icon={<Video size={17} />}
            label="Format"
            value={capitalize(eventData.event_type)}
            color="#DCEBFF"
            ink="#365CA8"
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <form onSubmit={saveEvent} className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
          <div className="min-w-0 space-y-7">
            <FormSection
              number="01"
              title="The big idea"
              description="The details people see when they discover your event."
              color="#E5E2FF"
              ink="#6252BD"
            >
              <Field
                label="Event title"
                required
                value={eventData.title}
                onChange={(value) => updateEventField("title", value)}
                placeholder="AWS Student Community Day"
              />

              <Field
                label="Event URL slug"
                required
                value={eventData.slug}
                onChange={(value) => updateEventField("slug", value)}
                placeholder="aws-student-community-day"
                hint={`/events/${eventData.slug}`}
              />

              <TextArea
                label="Description"
                value={eventData.description}
                onChange={(value) => updateEventField("description", value)}
                placeholder="What's happening? What will people learn, build, or take away?"
              />

              <Field
                label="Cover image URL"
                type="url"
                value={eventData.cover_image_url}
                onChange={(value) => updateEventField("cover_image_url", value)}
                placeholder="https://..."
              />

              {eventData.cover_image_url && (
                <div className="overflow-hidden rounded-2xl border border-[#EAE6DE] bg-[#F5F2EC] p-2">
                  <img
                    src={eventData.cover_image_url}
                    alt="Event cover preview"
                    className="max-h-72 w-full rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </FormSection>

            <FormSection
              number="02"
              title="Set the scene"
              description="Where people will meet, learn, and build together."
              color="#DDF2E5"
              ink="#287B56"
            >
              <div>
                <label className="mb-3 block text-xs font-semibold text-[#656474]">
                  Event format
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {([
                    ["offline", "In person", "Meet face to face"],
                    ["online", "Online", "Meet on the web"],
                    ["hybrid", "Hybrid", "A bit of both"],
                  ] as const).map(([value, label, description]) => {
                    const active = eventData.event_type === value;
                    const palette =
                      value === "offline"
                        ? { bg: "#DDF2E5", ink: "#287B56" }
                        : value === "online"
                          ? { bg: "#DCEBFF", ink: "#365CA8" }
                          : { bg: "#E5E2FF", ink: "#6252BD" };

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateEventField("event_type", value)}
                        className={`rounded-2xl border p-3 text-left transition sm:p-4 ${
                          active
                            ? "border-transparent shadow-[0_4px_14px_rgba(36,35,51,0.07)]"
                            : "border-[#EAE6DE] bg-white hover:border-[#D8D3CA]"
                        }`}
                        style={active ? { backgroundColor: palette.bg } : undefined}
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: active ? "#FFFFFFB8" : "#F5F2EC",
                            color: palette.ink,
                          }}
                        >
                          {value === "offline" ? (
                            <MapPin size={16} />
                          ) : value === "online" ? (
                            <Video size={16} />
                          ) : (
                            <CalendarDays size={16} />
                          )}
                        </span>
                        <span className="mt-3 block text-xs font-semibold leading-4 sm:text-sm">
                          {label}
                        </span>
                        <span className="mt-1 hidden text-[10px] leading-4 text-[#777584] sm:block">
                          {description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(eventData.event_type === "offline" ||
                eventData.event_type === "hybrid") && (
                <Field
                  label="Venue or location"
                  value={eventData.location}
                  onChange={(value) => updateEventField("location", value)}
                  placeholder="Lovely Professional University"
                />
              )}

              {(eventData.event_type === "online" ||
                eventData.event_type === "hybrid") && (
                <Field
                  label="Online meeting URL"
                  type="url"
                  value={eventData.online_url}
                  onChange={(value) => updateEventField("online_url", value)}
                  placeholder="https://..."
                />
              )}
            </FormSection>

            <FormSection
              number="03"
              title="Pick the moment"
              description="Get the timings right so everyone knows when to show up."
              color="#FFE5A5"
              ink="#875A00"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  label="Starts at"
                  value={eventData.start_at}
                  onChange={(value) => updateEventField("start_at", value)}
                />
                <DateField
                  label="Ends at"
                  value={eventData.end_at}
                  onChange={(value) => updateEventField("end_at", value)}
                />
              </div>

              <DateField
                label="Registration deadline"
                value={eventData.registration_deadline}
                onChange={(value) =>
                  updateEventField("registration_deadline", value)
                }
              />

              <div className="flex items-start gap-3 rounded-2xl bg-[#FFF5D9] p-4">
                <Clock3 size={17} className="mt-0.5 shrink-0 text-[#A56A00]" />
                <p className="text-xs leading-5 text-[#875A00]">
                  Times are entered in your local timezone and converted to UTC
                  when you save.
                </p>
              </div>
            </FormSection>

            <section className="overflow-hidden rounded-[1.75rem] border border-[#EAE6DE] bg-white">
              <div className="flex flex-col gap-5 bg-[#DCEBFF] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#365CA8]">
                    <Users size={13} />
                    The lineup
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.065em] text-[#263F77] sm:text-4xl">
                    Make room for ideas.
                  </h2>
                  <p className="mt-2 max-w-lg text-xs leading-5 text-[#365CA8] sm:text-sm">
                    Build the programme and bring the right people into every
                    session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSession}
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#365CA8] px-4 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#294984]"
                >
                  <Plus size={16} />
                  Add a session
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {sessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#D8D3CA] bg-[#FCFBF8] px-5 py-12 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE5A5] text-[#875A00]">
                      <Sparkles size={22} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">
                      The stage is yours.
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#777584]">
                      Add your first keynote, workshop, panel, or session to
                      start shaping the programme.
                    </p>
                    <button
                      type="button"
                      onClick={addSession}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#6252BD]"
                    >
                      <Plus size={15} />
                      Add first session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {sessions.map((session, index) => (
                      <SessionEditor
                        key={session.id}
                        session={session}
                        index={index}
                        speakers={speakers}
                        onUpdate={updateSession}
                        onRemove={removeSession}
                        onToggleSpeaker={toggleSpeaker}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-[#EAE6DE] bg-white">
              <div className="bg-[#FFDCCF] px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B84F28]">
                    Final touches
                  </span>
                  <Sparkles size={19} className="text-[#B84F28]" />
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-[#8E3D25]">
                  Ready for the world?
                </h2>
                <p className="mt-2 text-xs leading-5 text-[#9D5137]">
                  A few switches, then you're good to go.
                </p>
              </div>

              <div className="space-y-1 p-4 sm:p-5">
                <Toggle
                  label="Paid event"
                  description="Attendees need to pay to join."
                  checked={eventData.is_paid}
                  onChange={(value) => updateEventField("is_paid", value)}
                  color="#FFE5A5"
                  ink="#875A00"
                />
                <div className="h-px bg-[#F0EEE9]" />
                <Toggle
                  label="Publish event"
                  description="Make this event visible publicly."
                  checked={eventData.is_published}
                  onChange={(value) => updateEventField("is_published", value)}
                  color="#DDF2E5"
                  ink="#287B56"
                />
                <div className="h-px bg-[#F0EEE9]" />
                <Toggle
                  label="Cancel event"
                  description="Mark this event as cancelled."
                  checked={eventData.is_cancelled}
                  onChange={(value) => updateEventField("is_cancelled", value)}
                  color="#FFDCCF"
                  ink="#B84F28"
                />
              </div>

              <div className="px-4 pb-5 sm:px-5">
                {error && (
                  <div
                    role="alert"
                    className="mb-3 flex items-start gap-2 rounded-xl border border-[#F2C7BA] bg-[#FFF0EA] p-3 text-xs leading-5 text-[#A43F2A]"
                  >
                    <X size={15} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                {saved && (
                  <div
                    role="status"
                    className="mb-3 flex items-center gap-2 rounded-xl border border-[#B5E3C9] bg-[#DDF2E5] p-3 text-xs text-[#287B56]"
                  >
                    <Check size={15} />
                    Changes saved successfully.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#F07832] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#DB6524] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving your event..." : "Save all changes"}
                  {!saving && (
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  )}
                </button>

                <Link
                  href="/dashboard/events"
                  className="mt-2 flex w-full items-center justify-center rounded-full px-4 py-2.5 text-xs font-semibold text-[#777584] transition hover:bg-[#F5F2EC] hover:text-[#242333]"
                >
                  Back to events
                </Link>
              </div>
            </section>

            {eventData.cover_image_url ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-[#EAE6DE] bg-white p-3">
                <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9693A1]">
                  Cover artwork
                </p>
                <img
                  src={eventData.cover_image_url}
                  alt="Event cover artwork"
                  className="max-h-52 w-full rounded-xl object-cover"
                  onError={(imageEvent) => {
                    imageEvent.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#FFE5A5] p-5">
                <Sparkles size={18} className="text-[#875A00]" />
                <p className="mt-3 text-sm font-semibold text-[#875A00]">
                  Every great event starts with an idea.
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[#875A00]">
                  Add some cover artwork to give yours a face.
                </p>
              </div>
            )}

            <div className="rounded-[1.5rem] bg-[#F9DDF0] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A03F79]">
                Event identity
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-[#7F3260]">
                /{eventData.slug}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#A03F79]">
                Keep the URL readable and easy to share.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function QuickFact({
  icon,
  label,
  value,
  color,
  ink,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  ink: string;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-2xl border border-[#EAE6DE] bg-white/80 p-3.5 sm:p-4 ${className}`}>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: color, color: ink }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-[#9693A1]">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-[#242333]">{value}</p>
      </div>
    </div>
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
    <section className="rounded-[1.75rem] border border-[#EAE6DE] bg-white/90 p-5 sm:p-7">
      <div className="mb-7 flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] text-xs font-bold"
          style={{ backgroundColor: color, color: ink }}
        >
          {number}
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-xl font-semibold tracking-[-0.055em] sm:text-2xl">{title}</h2>
          <p className="mt-1.5 text-xs leading-5 text-[#777584] sm:text-sm">{description}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SessionEditor({
  session,
  index,
  speakers,
  onUpdate,
  onRemove,
  onToggleSpeaker,
}: {
  session: Session;
  index: number;
  speakers: Speaker[];
  onUpdate: (
    id: string,
    field: keyof Session,
    value: string | number | null,
  ) => void;
  onRemove: (id: string) => void;
  onToggleSpeaker: (sessionId: string, speakerId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const selectedSpeakerIds = new Set(
    session.talk_speakers.map((item) => item.speaker_id),
  );
  const palette = palettes[index % palettes.length];

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[#EAE6DE] bg-white">
      <div
        className="relative overflow-hidden px-4 py-4 sm:px-5"
        style={{ backgroundColor: palette.bg }}
      >
        <span
          className="pointer-events-none absolute -right-5 -top-8 h-24 w-24 rounded-full"
          style={{ backgroundColor: palette.shape }}
        />
        <div className="relative flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/70"
            style={{ color: palette.ink }}
          >
            <GripVertical size={17} />
          </span>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="min-w-0 flex-1 text-left"
            aria-expanded={expanded}
          >
            <span
              className="block text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: palette.ink }}
            >
              Session {String(index + 1).padStart(2, "0")} · {capitalize(session.talk_type)}
            </span>
            <span className="mt-1 block truncate text-sm font-semibold text-[#242333] sm:text-base">
              {session.title || "Untitled session"}
            </span>
          </button>
          <span
            className="hidden rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold sm:inline-flex"
            style={{ color: palette.ink }}
          >
            {session.talk_speakers.length} {session.talk_speakers.length === 1 ? "speaker" : "speakers"}
          </span>
          <button
            type="button"
            onClick={() => onRemove(session.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#777584] transition hover:border-[#F2C7BA] hover:bg-[#FFF0EA] hover:text-[#B84F28]"
            aria-label={`Remove session ${index + 1}`}
            title="Remove session"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-6 p-4 sm:p-5">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_190px]">
            <Field
              label="Session title"
              required
              value={session.title}
              onChange={(value) => onUpdate(session.id, "title", value)}
              placeholder="Building with cloud technology"
            />
            <SelectField
              label="Session type"
              value={session.talk_type}
              options={sessionTypes}
              onChange={(value) => onUpdate(session.id, "talk_type", value)}
            />
          </div>

          <TextArea
            label="Session description"
            value={session.description ?? ""}
            onChange={(value) => onUpdate(session.id, "description", value || null)}
            placeholder="What will this session cover?"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <DateField
              label="Starts at"
              value={toInputDateTime(session.starts_at)}
              onChange={(value) =>
                onUpdate(
                  session.id,
                  "starts_at",
                  value ? new Date(value).toISOString() : null,
                )
              }
            />
            <DateField
              label="Ends at"
              value={toInputDateTime(session.ends_at)}
              onChange={(value) =>
                onUpdate(
                  session.id,
                  "ends_at",
                  value ? new Date(value).toISOString() : null,
                )
              }
            />
          </div>

          <Field
            label="Session location"
            value={session.location ?? ""}
            onChange={(value) => onUpdate(session.id, "location", value || null)}
            placeholder="Room or venue"
          />

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold">Who's taking the stage?</h4>
                <p className="mt-1 text-xs text-[#9693A1]">Select everyone speaking in this session.</p>
              </div>
              <span className="rounded-full bg-[#E5E2FF] px-3 py-1.5 text-[10px] font-semibold text-[#6252BD]">
                {selectedSpeakerIds.size} selected
              </span>
            </div>

            {speakers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#D8D3CA] bg-[#FCFBF8] p-5 text-sm text-[#777584]">
                No speakers available yet. Add speakers first.
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {speakers.map((speaker, speakerIndex) => {
                  const selected = selectedSpeakerIds.has(speaker.id);
                  const speakerPalette = palettes[speakerIndex % palettes.length];

                  return (
                    <button
                      key={speaker.id}
                      type="button"
                      onClick={() => onToggleSpeaker(session.id, speaker.id)}
                      aria-pressed={selected}
                      className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        selected
                          ? "border-[#C8BFFF] bg-[#F5F3FF]"
                          : "border-[#EAE6DE] bg-[#FCFBF8] hover:border-[#D8D3CA] hover:bg-white"
                      }`}
                    >
                      {speaker.avatar_url ? (
                        <img
                          src={speaker.avatar_url}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                          style={{
                            backgroundColor: speakerPalette.bg,
                            color: speakerPalette.ink,
                          }}
                        >
                          {speaker.name.trim().charAt(0).toUpperCase() || "S"}
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-[#242333]">
                          {speaker.name}
                        </span>
                        <span className="mt-1 block truncate text-[10px] text-[#9693A1]">
                          {[speaker.designation, speaker.company].filter(Boolean).join(" · ") || "Speaker"}
                        </span>
                      </span>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          selected ? "bg-[#6252BD] text-white" : "border border-[#D8D3CA] bg-white text-transparent"
                        }`}
                      >
                        <Check size={12} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
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
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">
        {label}
        {required && <span className="ml-1 text-[#F07832]">*</span>}
      </span>
      <input
        type={type}
        required={required}
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
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] px-4 py-3 text-sm leading-6 text-[#242333] outline-none transition placeholder:text-[#B0ACB5] hover:border-[#D8D3CA] focus:border-[#BDB3F0] focus:bg-white focus:ring-4 focus:ring-[#E5E2FF]/50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] px-4 py-3 text-sm text-[#242333] outline-none transition hover:border-[#D8D3CA] focus:border-[#BDB3F0] focus:bg-white focus:ring-4 focus:ring-[#E5E2FF]/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-[#656474]">{label}</span>
      <input
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
        className={`relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? "" : "bg-[#E5E2DA]"
        }`}
        style={checked ? { backgroundColor: ink } : undefined}
      >
        <span
          className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
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

function toInputDateTime(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function formatShortDate(value: string) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function capitalize(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
