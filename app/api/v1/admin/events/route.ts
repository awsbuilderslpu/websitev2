import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { getProfileId } from "@/lib/supabase/profiles";

const nullableUrl = z.preprocess(
  (value) => {
    if (value === "" || value === undefined) {
      return null;
    }

    return value;
  },
  z.string().url().nullable(),
);

const nullableString = z.preprocess(
  (value) => {
    if (value === "" || value === undefined) {
      return null;
    }

    return value;
  },
  z.string().trim().nullable(),
);

const createEventSchema = z.object({
  title: z.string().trim().min(1).max(200),

  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and hyphens only",
    ),

  description: nullableString,

  cover_image_url: nullableUrl,

  event_type: z.enum(["offline", "online", "hybrid"]),

  location: nullableString,

  online_url: nullableUrl,

  start_at: z.string().datetime(),

  end_at: z.string().datetime(),

  registration_deadline: z.string().datetime(),

  is_paid: z.boolean().default(false),

  is_published: z.boolean().default(false),

  is_cancelled: z.boolean().default(false),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin permissions required" },
        { status: 403 },
      );
    }

    const { data, error } = await supabaseServer
      .from("events")
      .select("*")
      .order("start_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch admin events:", error);

      return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      events: data ?? [],
    });
  } catch (error) {
    console.error("GET /api/v1/admin/events:", error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin permissions required" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid event data",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const event = parsed.data;

    const startAt = new Date(event.start_at);
    const endAt = new Date(event.end_at);
    const registrationDeadline = new Date(
      event.registration_deadline,
    );

    if (endAt <= startAt) {
      return NextResponse.json(
        {
          error: "end_at must be after start_at",
        },
        { status: 400 },
      );
    }

    if (registrationDeadline > startAt) {
      return NextResponse.json(
        {
          error:
            "registration_deadline must be before or equal to start_at",
        },
        { status: 400 },
      );
    }

    let profileId: string;

    try {
        profileId = await getProfileId(user);
        } catch (error) {
        return NextResponse.json(
            {
            error:
                error instanceof Error
                ? error.message
                : "User profile not found",
            },
            { status: 404 },
        );
    }

    const { data, error } = await supabaseServer
      .from("events")
      .insert({
        title: event.title,
        slug: event.slug,
        description: event.description,
        cover_image_url: event.cover_image_url,
        event_type: event.event_type,
        location: event.location,
        online_url: event.online_url,
        start_at: event.start_at,
        end_at: event.end_at,
        registration_deadline: event.registration_deadline,
        is_paid: event.is_paid,
        is_published: event.is_published,
        is_cancelled: event.is_cancelled,
        cancelled_at: event.is_cancelled
          ? new Date().toISOString()
          : null,
        created_by: profileId,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to create event:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "An event with this slug already exists",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { event: data },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/v1/admin/events:", error);

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}