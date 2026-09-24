import { NextResponse } from "next/server";
import { getPublicSpeaker } from "@/lib/speakers";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const speaker = await getPublicSpeaker(id);

    if (!speaker) {
      return NextResponse.json(
        {
          error: "Speaker not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      speaker,
    });
  } catch (error) {
    console.error("Failed to fetch speaker:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch speaker",
      },
      {
        status: 500,
      },
    );
  }
}