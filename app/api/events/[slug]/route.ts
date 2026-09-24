import { NextResponse } from "next/server";
import { getPublicEvent } from "@/lib/events";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const event = await getPublicEvent(slug);

    if (!event) {
      return NextResponse.json(
        {
          error: "Event not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        event,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch event",
      },
      {
        status: 500,
      },
    );
  }
}