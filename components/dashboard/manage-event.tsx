"use client";

import {
  ArrowLeft,
  GripVertical,
  Plus,
  Save,
  Trash2,
  Users,
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
  {
    value: "keynote",
    label: "Keynote",
  },
  {
    value: "session",
    label: "Session",
  },
  {
    value: "workshop",
    label: "Workshop",
  },
  {
    value: "panel",
    label: "Panel",
  },
  {
    value: "fireside_chat",
    label: "Fireside Chat",
  },
  {
    value: "demo",
    label: "Demo",
  },
  {
    value: "other",
    label: "Other",
  },
];

export function ManageEvent({
  event,
  speakers,
}: ManageEventProps) {
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
  });

  const [sessions, setSessions] = useState<Session[]>(
    event.talks.map((talk) => ({
      ...talk,
      talk_speakers: talk.talk_speakers ?? [],
    })),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateEventField(
    field: keyof typeof eventData,
    value: string | boolean,
  ) {
    setEventData((current) => ({
      ...current,
      [field]: value,
    }));
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
  }

  function updateSession(
    id: string,
    field: keyof Session,
    value: string | null | number,
  ) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? {
              ...session,
              [field]: value,
            }
          : session,
      ),
    );
  }

  function removeSession(id: string) {
    setSessions((current) =>
      current
        .filter((session) => session.id !== id)
        .map((session, index) => ({
          ...session,
          sort_order: index,
        })),
    );
  }

  function toggleSpeaker(
    sessionId: string,
    speakerId: string,
  ) {
    setSessions((current) =>
      current.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        const exists = session.talk_speakers.some(
          (item) => item.speaker_id === speakerId,
        );

        if (exists) {
          return {
            ...session,
            talk_speakers:
              session.talk_speakers.filter(
                (item) =>
                  item.speaker_id !== speakerId,
              ),
          };
        }

        return {
          ...session,
          talk_speakers: [
            ...session.talk_speakers,
            {
              speaker_id: speakerId,
              sort_order:
                session.talk_speakers.length,
            },
          ],
        };
      }),
    );
  }

  async function saveEvent(
    eventObject?: React.FormEvent<HTMLFormElement>,
  ) {
    eventObject?.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/v1/admin/events/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: eventData,
            sessions,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save event",
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save event",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 text-sm text-[#737B8C] transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Events
        </Link>

        <div className="mt-10 flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              <span className="h-px w-8 bg-[#A855F7]" />
              Event management
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
              Manage Event.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8F96A5]">
              Manage the event details, programme, speakers,
              and publication state from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
                eventData.is_published
                  ? "border-emerald-400/30 text-emerald-300"
                  : "border-white/10 text-[#737B8C]"
              }`}
            >
              {eventData.is_published
                ? "Published"
                : "Draft"}
            </span>

            <button
              type="button"
              onClick={() => saveEvent()}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </div>

        <form
          onSubmit={saveEvent}
          className="mt-12"
        >
          <section className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[0.4fr_1fr]">
            <SectionIntro
              label="01"
              title="Event details"
              description="The information visitors see when they discover this event."
            />

            <div className="space-y-6">
              <Field
                label="Title"
                required
                value={eventData.title}
                onChange={(value) =>
                  updateEventField("title", value)
                }
              />

              <Field
                label="Slug"
                required
                value={eventData.slug}
                onChange={(value) =>
                  updateEventField("slug", value)
                }
              />

              <TextareaField
                label="Description"
                value={eventData.description}
                onChange={(value) =>
                  updateEventField(
                    "description",
                    value,
                  )
                }
              />

              <Field
                label="Cover image URL"
                value={eventData.cover_image_url}
                onChange={(value) =>
                  updateEventField(
                    "cover_image_url",
                    value,
                  )
                }
              />
            </div>
          </section>

          <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[0.4fr_1fr]">
            <SectionIntro
              label="02"
              title="Schedule"
              description="When and where the event happens."
            />

            <div className="space-y-6">
              <SelectField
                label="Event type"
                value={eventData.event_type}
                options={[
                  {
                    value: "offline",
                    label: "Offline",
                  },
                  {
                    value: "online",
                    label: "Online",
                  },
                  {
                    value: "hybrid",
                    label: "Hybrid",
                  },
                ]}
                onChange={(value) =>
                  updateEventField(
                    "event_type",
                    value,
                  )
                }
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <DateField
                  label="Starts"
                  value={eventData.start_at}
                  onChange={(value) =>
                    updateEventField(
                      "start_at",
                      value,
                    )
                  }
                />

                <DateField
                  label="Ends"
                  value={eventData.end_at}
                  onChange={(value) =>
                    updateEventField(
                      "end_at",
                      value,
                    )
                  }
                />
              </div>

              <DateField
                label="Registration deadline"
                value={
                  eventData.registration_deadline
                }
                onChange={(value) =>
                  updateEventField(
                    "registration_deadline",
                    value,
                  )
                }
              />

              <Field
                label="Location"
                value={eventData.location}
                onChange={(value) =>
                  updateEventField(
                    "location",
                    value,
                  )
                }
              />

              <Field
                label="Online URL"
                value={eventData.online_url}
                onChange={(value) =>
                  updateEventField(
                    "online_url",
                    value,
                  )
                }
              />
            </div>
          </section>

          <section className="border-b border-white/10 py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionIntro
                label="03"
                title="Programme"
                description="Build the event schedule. Each session can have multiple speakers."
              />

              <button
                type="button"
                onClick={addSession}
                className="inline-flex w-fit items-center gap-2 border border-white/10 px-4 py-2.5 text-sm text-[#C7CAD2] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
              >
                <Plus size={16} />
                Add Session
              </button>
            </div>

            <div className="mt-10 border-t border-white/10">
              {sessions.length === 0 ? (
                <div className="border-b border-white/10 py-16 text-center">
                  <p className="text-base font-medium">
                    No sessions yet.
                  </p>

                  <p className="mt-2 text-sm text-[#737B8C]">
                    Add a session to start building the
                    programme.
                  </p>
                </div>
              ) : (
                sessions.map((session, index) => (
                  <SessionEditor
                    key={session.id}
                    session={session}
                    index={index}
                    speakers={speakers}
                    onUpdate={updateSession}
                    onRemove={removeSession}
                    onToggleSpeaker={
                      toggleSpeaker
                    }
                  />
                ))
              )}
            </div>
          </section>

          <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[0.4fr_1fr]">
            <SectionIntro
              label="04"
              title="Publishing"
              description="Control how this event appears publicly."
            />

            <div className="space-y-5">
              <label className="flex items-center gap-3 text-sm text-[#C7CAD2]">
                <input
                  type="checkbox"
                  checked={eventData.is_paid}
                  onChange={(event) =>
                    updateEventField(
                      "is_paid",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#A855F7]"
                />

                Paid event
              </label>

              <label className="flex items-center gap-3 text-sm text-[#C7CAD2]">
                <input
                  type="checkbox"
                  checked={eventData.is_published}
                  onChange={(event) =>
                    updateEventField(
                      "is_published",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#A855F7]"
                />

                Publish event publicly
              </label>
            </div>
          </section>

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
              {saving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </main>
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
  onToggleSpeaker: (
    sessionId: string,
    speakerId: string,
  ) => void;
}) {
  const selectedSpeakerIds = new Set(
    session.talk_speakers.map(
      (item) => item.speaker_id,
    ),
  );

  return (
    <article className="border-b border-white/10 py-10 last:border-b-0">
      <div className="grid gap-8 lg:grid-cols-[60px_1fr_auto]">
        <div className="flex items-start gap-3">
          <GripVertical
            size={17}
            className="mt-1 text-[#596273]"
          />

          <span className="font-mono text-xs text-[#596273]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="space-y-7">
          <div className="grid gap-6 sm:grid-cols-[1fr_220px]">
            <Field
              label="Session title"
              required
              value={session.title}
              onChange={(value) =>
                onUpdate(
                  session.id,
                  "title",
                  value,
                )
              }
            />

            <SelectField
              label="Session type"
              value={session.talk_type}
              options={sessionTypes}
              onChange={(value) =>
                onUpdate(
                  session.id,
                  "talk_type",
                  value,
                )
              }
            />
          </div>

          <TextareaField
            label="Description"
            value={session.description ?? ""}
            onChange={(value) =>
              onUpdate(
                session.id,
                "description",
                value || null,
              )
            }
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <DateField
              label="Starts"
              value={toInputDateTime(
                session.starts_at,
              )}
              onChange={(value) =>
                onUpdate(
                  session.id,
                  "starts_at",
                  value
                    ? new Date(
                        value,
                      ).toISOString()
                    : null,
                )
              }
            />

            <DateField
              label="Ends"
              value={toInputDateTime(
                session.ends_at,
              )}
              onChange={(value) =>
                onUpdate(
                  session.id,
                  "ends_at",
                  value
                    ? new Date(
                        value,
                      ).toISOString()
                    : null,
                )
              }
            />
          </div>

          <Field
            label="Session location"
            value={session.location ?? ""}
            onChange={(value) =>
              onUpdate(
                session.id,
                "location",
                value || null,
              )
            }
          />

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Users
                size={15}
                className="text-[#A855F7]"
              />

              <span className="text-xs text-[#8F96A5]">
                Speakers
              </span>
            </div>

            {speakers.length === 0 ? (
              <div className="border border-white/10 bg-[#0D1421] p-4 text-sm text-[#737B8C]">
                No speakers available. Add speakers first.
              </div>
            ) : (
              <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {speakers.map((speaker) => {
                  const selected =
                    selectedSpeakerIds.has(
                      speaker.id,
                    );

                  return (
                    <button
                      key={speaker.id}
                      type="button"
                      onClick={() =>
                        onToggleSpeaker(
                          session.id,
                          speaker.id,
                        )
                      }
                      className={`flex items-center gap-3 bg-[#0D1421] p-4 text-left transition-colors ${
                        selected
                          ? "bg-[#A855F7]/10"
                          : "hover:bg-[#172033]"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                          selected
                            ? "border-[#A855F7] bg-[#A855F7]"
                            : "border-white/20"
                        }`}
                      >
                        {selected && (
                          <span className="h-1.5 w-1.5 bg-white" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {speaker.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[#737B8C]">
                          {[
                            speaker.designation,
                            speaker.company,
                          ]
                            .filter(Boolean)
                            .join(" · ") ||
                            "Speaker"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(session.id)}
          className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#737B8C] transition-colors hover:border-red-400 hover:bg-red-400 hover:text-white"
          aria-label={`Remove session ${index + 1}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

function SectionIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A855F7]">
        {label}
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
        {title}
      </h2>

      <p className="mt-3 max-w-sm text-sm leading-6 text-[#737B8C]">
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
          <span className="ml-1 text-[#A855F7]">
            *
          </span>
        )}
      </span>

      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#A855F7]"
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
        rows={5}
        className="w-full resize-y border border-white/10 bg-[#0D1421] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors focus:border-[#A855F7]"
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
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-[#8F96A5]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full appearance-none border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#A855F7]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
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
    <label className="block">
      <span className="mb-2 block text-xs text-[#8F96A5]">
        {label}
      </span>

      <input
        type="datetime-local"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#A855F7]"
      />
    </label>
  );
}

function toInputDateTime(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const local = new Date(
    date.getTime() -
      date.getTimezoneOffset() * 60000,
  );

  return local.toISOString().slice(0, 16);
}