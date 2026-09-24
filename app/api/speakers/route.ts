import { NextResponse } from "next/server";
import { getPublicSpeakers } from "@/lib/speakers";

export async function GET() {
  try {
    const speakers = await getPublicSpeakers();

    return NextResponse.json({
      speakers,
    });
  } catch (error) {
    console.error("Failed to fetch speakers:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch speakers",
      },
      {
        status: 500,
      },
    );
  }
}