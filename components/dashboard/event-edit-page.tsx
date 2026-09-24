"use client";

import { useEffect, useState } from "react";

import { EventForm } from "@/components/dashboard/event-form";

type EventData = {
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  event_type: "offline" | "online" | "hybrid";
  location: string | null;
  online_url: string | null;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  is_paid: boolean;
  is_published: boolean;
  is_cancelled: boolean;
};

type EventResponse = {
  event: EventData;
};

type ErrorResponse = {
  error: string;
};

type EventEditPageProps = {
  eventId: string;
};

export function EventEditPage({
  eventId,
}: EventEditPageProps) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/v1/admin/events/${eventId}`,
          {
            cache: "no-store",
          },
        );

        const data: EventResponse | ErrorResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "error" in data
              ? data.error
              : "Failed to fetch event",
          );
        }

        if (!("event" in data)) {
          throw new Error("Invalid event response");
        }

        setEvent(data.event);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch event",
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111827] px-5 py-24 text-center text-sm text-[#737B8C]">
        Loading event...
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#111827] px-5 py-24 text-center text-sm text-red-300">
        {error || "Event not found"}
      </main>
    );
  }

  return (
    <EventForm
      mode="edit"
      eventId={eventId}
      initialData={{
        title: event.title,
        slug: event.slug,
        description: event.description ?? "",
        cover_image_url: event.cover_image_url ?? "",
        event_type: event.event_type,
        location: event.location ?? "",
        online_url: event.online_url ?? "",
        start_at: toDateTimeLocal(event.start_at),
        end_at: toDateTimeLocal(event.end_at),
        registration_deadline: toDateTimeLocal(
          event.registration_deadline,
        ),
        is_paid: event.is_paid,
        is_published: event.is_published,
        is_cancelled: event.is_cancelled,
      }}
    />
  );
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}