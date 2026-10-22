import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type AttendanceActionType =
  | "checkin"
  | "checkout"
  | "start_break"
  | "end_break";

type AttendanceState =
  | "not-checked-in"
  | "checked-in"
  | "on-break"
  | "completed"
  | "invalid";

const actionTypes: AttendanceActionType[] = [
  "checkin",
  "checkout",
  "start_break",
  "end_break",
];

const availableActions: Record<
  AttendanceState,
  AttendanceActionType[]
> = {
  "not-checked-in": ["checkin"],
  "checked-in": ["start_break", "checkout"],
  "on-break": ["end_break"],
  completed: [],
  invalid: [],
};

type HistoryRow = {
  id: string;
  action: string;
  recorded_at: string;
  created_at: string;
};

function evaluateAttendance(actions: HistoryRow[]) {
  let state: AttendanceState = "not-checked-in";

  for (const record of actions) {
    switch (record.action) {
      case "checkin":
        if (state !== "not-checked-in") {
          return {
            state: "invalid" as const,
            allowedActions: availableActions.invalid,
          };
        }

        state = "checked-in";
        break;

      case "start_break":
        if (state !== "checked-in") {
          return {
            state: "invalid" as const,
            allowedActions: availableActions.invalid,
          };
        }

        state = "on-break";
        break;

      case "end_break":
        if (state !== "on-break") {
          return {
            state: "invalid" as const,
            allowedActions: availableActions.invalid,
          };
        }

        state = "checked-in";
        break;

      case "checkout":
        if (state !== "checked-in") {
          return {
            state: "invalid" as const,
            allowedActions: availableActions.invalid,
          };
        }

        state = "completed";
        break;

      default:
        return {
          state: "invalid" as const,
          allowedActions: availableActions.invalid,
        };
    }
  }

  return {
    state,
    allowedActions: availableActions[state],
  };
}

async function getAuthorizedOperator() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  if (!["core", "admin"].includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "You do not have permission to manage attendance" },
        { status: 403 },
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

async function getEvent(eventId: string) {
  return supabaseServer
    .from("events")
    .select(`
      id,
      title,
      slug,
      is_cancelled
    `)
    .eq("id", eventId)
    .maybeSingle();
}

async function getParticipant(userId: string) {
  return supabaseServer
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      avatar_url,
      workspace_name,
      workspace_uid
    `)
    .eq("id", userId)
    .maybeSingle();
}

async function getAttendanceHistory(
  eventId: string,
  userId: string,
) {
  return supabaseServer
    .from("attendance")
    .select(`
      id,
      action,
      recorded_at,
      created_at
    `)
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .order("recorded_at", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const auth = await getAuthorizedOperator();

  if (!auth.user) {
    return auth.response!;
  }

  try {
    const { id: eventId } = await context.params;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id")?.trim();

    if (!userId) {
      return NextResponse.json(
        { error: "A participant profile ID is required" },
        { status: 400 },
      );
    }

    const [
      { data: event, error: eventError },
      { data: participant, error: participantError },
    ] = await Promise.all([
      getEvent(eventId),
      getParticipant(userId),
    ]);

    if (eventError) {
      throw eventError;
    }

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    if (participantError) {
      throw participantError;
    }

    if (!participant) {
      return NextResponse.json(
        { error: "No member profile matches this QR code" },
        { status: 404 },
      );
    }

    const {
      data: actions,
      error: historyError,
    } = await getAttendanceHistory(eventId, userId);

    if (historyError) {
      throw historyError;
    }

    const history = (actions ?? []) as HistoryRow[];
    const attendance = evaluateAttendance(history);

    const allowedActions = event.is_cancelled
      ? []
      : attendance.allowedActions;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        is_cancelled: event.is_cancelled,
      },
      participant,
      state: attendance.state,
      allowedActions,
      actions: history,
    });
  } catch (error) {
    console.error(
      "Failed to look up attendance participant:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to look up participant",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const auth = await getAuthorizedOperator();

  if (!auth.user) {
    return auth.response!;
  }

  try {
    const { id: eventId } = await context.params;

    const body = await request.json();

    const userId =
      typeof body.user_id === "string"
        ? body.user_id.trim()
        : "";

    const action = body.action as AttendanceActionType;

    if (!userId || !actionTypes.includes(action)) {
      return NextResponse.json(
        {
          error: "A participant ID and valid attendance action are required",
        },
        { status: 400 },
      );
    }

    const [
      { data: event, error: eventError },
      { data: participant, error: participantError },
    ] = await Promise.all([
      getEvent(eventId),
      getParticipant(userId),
    ]);

    if (eventError) {
      throw eventError;
    }

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    if (event.is_cancelled) {
      return NextResponse.json(
        { error: "Attendance cannot be recorded for a cancelled event" },
        { status: 409 },
      );
    }

    if (participantError) {
      throw participantError;
    }

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    const {
      data: actions,
      error: historyError,
    } = await getAttendanceHistory(eventId, userId);

    if (historyError) {
      throw historyError;
    }

    const history = (actions ?? []) as HistoryRow[];
    const attendance = evaluateAttendance(history);

    if (!attendance.allowedActions.includes(action)) {
      return NextResponse.json(
        {
          error:
            attendance.state === "invalid"
              ? "This participant has an inconsistent attendance history. Review their records before continuing."
              : `Cannot perform "${action}" while the participant is "${attendance.state}".`,
          state: attendance.state,
          allowedActions: attendance.allowedActions,
        },
        { status: 409 },
      );
    }

    const {
      data: recordedAction,
      error: insertError,
    } = await supabaseServer
      .from("attendance")
      .insert({
        event_id: eventId,
        user_id: userId,
        action,
      })
      .select(`
        id,
        action,
        recorded_at,
        created_at
      `)
      .single();

    if (insertError) {
      throw insertError;
    }

    const updatedHistory = [
      ...history,
      recordedAction as HistoryRow,
    ];

    const nextAttendance =
      evaluateAttendance(updatedHistory);

    return NextResponse.json(
      {
        success: true,
        event: {
          id: event.id,
          title: event.title,
        },
        participant,
        action: recordedAction,
        state: nextAttendance.state,
        allowedActions: nextAttendance.allowedActions,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Failed to record attendance action:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to record attendance action",
      },
      { status: 500 },
    );
  }
}