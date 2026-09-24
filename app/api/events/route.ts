import { NextResponse } from "next/server";
import { getPublicEvents } from "@/lib/events";

export async function GET() {
  try {
    const events = await getPublicEvents();

    return NextResponse.json(
      {
        events,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch events:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch events",
      },
      {
        status: 500,
      },
    );
  }
}