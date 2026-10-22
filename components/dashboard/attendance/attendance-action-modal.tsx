"use client";

import {
  ArrowRight,
  CheckCircle2,
  CirclePlay,
  Clock3,
  Coffee,
  LogIn,
  LogOut,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type AttendanceAction =
  | "checkin"
  | "checkout"
  | "start_break"
  | "end_break";

export type ScanParticipant = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
};

export type ScanPreview = {
  event: {
    id: string;
    title: string;
    is_cancelled?: boolean;
  };
  participant: ScanParticipant;
  state: string;
  allowedActions: AttendanceAction[];
};

export type AttendanceActionReceipt = {
  eventTitle: string;
  participant: ScanParticipant;
  action: AttendanceAction;
  recordedAt: string;
  state: string;
};

type Props = {
  open: boolean;
  preview: ScanPreview | null;
  receipt: AttendanceActionReceipt | null;
  busyAction: AttendanceAction | null;
  error: string | null;
  onPerformAction: (action: AttendanceAction) => void;
  onClose: () => void;
  onScanNext: () => void;
};

const actionDetails: Record<
  AttendanceAction,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    className: string;
    iconClassName: string;
  }
> = {
  checkin: {
    label: "Check in",
    description: "Record the participant's arrival.",
    icon: LogIn,
    className: "bg-[#5257C8] text-white hover:bg-[#4448B6]",
    iconClassName: "bg-white/15",
  },
  start_break: {
    label: "Start break",
    description: "Record the start of a break.",
    icon: Coffee,
    className:
      "border border-[#F2D9A6] bg-[#FFF4D9] text-[#755315] hover:bg-[#FCECC6]",
    iconClassName: "bg-[#F9E5B7]",
  },
  end_break: {
    label: "End break",
    description: "Resume attendance after the break.",
    icon: CirclePlay,
    className:
      "bg-[#DFF3E5] text-[#246C42] hover:bg-[#CDEBD7]",
    iconClassName: "bg-[#C8E8D2]",
  },
  checkout: {
    label: "Check out",
    description: "Record departure from the event.",
    icon: LogOut,
    className:
      "bg-[#FCE5DD] text-[#A34327] hover:bg-[#F8D5C9]",
    iconClassName: "bg-[#F6D3C7]",
  },
};

const stateLabels: Record<string, string> = {
  "not-checked-in": "Not checked in",
  "checked-in": "Checked in",
  "on-break": "Currently on break",
  completed: "Attendance complete",
  invalid: "Attendance needs review",
};

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return "??";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function ParticipantAvatar({
  participant,
  size = "normal",
}: {
  participant: ScanParticipant;
  size?: "normal" | "large";
}) {
  const sizeClass =
    size === "large" ? "h-14 w-14" : "h-12 w-12";

  if (participant.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={participant.avatar_url}
        alt=""
        className={`${sizeClass} shrink-0 rounded-2xl object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-2xl bg-[#EFEBFF] font-semibold text-[#5257C8]`}
    >
      {getInitials(participant.full_name)}
    </div>
  );
}

export function AttendanceActionModal({
  open,
  preview,
  receipt,
  busyAction,
  error,
  onPerformAction,
  onClose,
  onScanNext,
}: Props) {
  const participant =
    receipt?.participant ?? preview?.participant;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto rounded-[28px] border border-[#EAE7E0] bg-[#FAF9F6] p-0 text-[#242333] shadow-2xl sm:rounded-[30px]">
        {receipt && participant ? (
          <div className="p-6 sm:p-7">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DFF3E5] text-[#246C42]">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Action recorded!
              </DialogTitle>

              <DialogDescription className="text-sm leading-6 text-[#777584]">
                {actionDetails[receipt.action].label} was
                recorded successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 rounded-2xl border border-[#EAE7E0] bg-white p-4">
              <div className="flex items-center gap-3">
                <ParticipantAvatar participant={participant} />

                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold">
                    {participant.full_name ||
                      "Unnamed participant"}
                  </p>

                  <p className="truncate text-sm text-[#777584]">
                    {participant.email ||
                      "No email available"}
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#36965D]" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#F0EEE9] pt-4">
                <div>
                  <p className="text-xs font-medium text-[#898795]">
                    Workspace UID
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold">
                    {participant.workspace_uid || "Not linked"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#898795]">
                    Action
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {actionDetails[receipt.action].label}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-medium text-[#898795]">
                    Event
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold">
                    {receipt.eventTitle}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-medium text-[#898795]">
                    Recorded at
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 shrink-0 text-[#898795]" />
                    {formatTimestamp(receipt.recordedAt)}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onScanNext}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5257C8] px-4 py-3.5 font-semibold text-white transition hover:bg-[#4448B6]"
            >
              Scan next participant
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-[#777584] transition hover:bg-[#F0EEE9]"
            >
              Close
            </button>
          </div>
        ) : preview && participant ? (
          <div className="p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFEBFF] text-[#5257C8]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <span className="rounded-full border border-[#EAE7E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#777584]">
                Attendance desk
              </span>
            </div>

            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Participant identified
              </DialogTitle>

              <DialogDescription className="text-sm leading-6 text-[#777584]">
                Review the participant and select an available
                attendance action.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 rounded-2xl border border-[#EAE7E0] bg-white p-4">
              <div className="flex items-center gap-3">
                <ParticipantAvatar
                  participant={participant}
                  size="large"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold">
                    {participant.full_name ||
                      "Unnamed participant"}
                  </p>

                  <p className="mt-0.5 break-all text-sm text-[#777584]">
                    {participant.email ||
                      "No email available"}
                  </p>

                  <p className="mt-2 text-xs text-[#777584]">
                    Workspace UID{" "}
                    <span className="break-all font-semibold text-[#242333]">
                      {participant.workspace_uid || "Not linked"}
                    </span>
                  </p>
                </div>
              </div>

              {participant.workspace_name && (
                <div className="mt-3 flex items-start gap-2 text-sm text-[#777584]">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0" />

                  <span className="break-words">
                    {participant.workspace_name}
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-[#F0EEE9] pt-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    preview.state === "completed"
                      ? "bg-[#898795]"
                      : preview.state === "on-break"
                        ? "bg-[#E3A338]"
                        : "bg-[#36965D]"
                  }`}
                />

                <span className="text-sm font-medium">
                  {stateLabels[preview.state] ??
                    "Current attendance state"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">
                Available actions
              </p>

              {preview.event.is_cancelled ? (
                <div className="rounded-2xl border border-[#F1C7BC] bg-[#FFF0EB] px-4 py-4">
                  <p className="font-semibold text-[#A34327]">
                    Event cancelled
                  </p>

                  <p className="mt-1 text-sm leading-5 text-[#A34327]">
                    Attendance actions are disabled for this event.
                  </p>
                </div>
              ) : preview.allowedActions.length > 0 ? (
                <div className="space-y-2.5">
                  {preview.allowedActions.map((action) => {
                    const details = actionDetails[action];
                    const Icon = details.icon;

                    const isBusy = busyAction === action;
                    const isDisabled = busyAction !== null;

                    return (
                      <button
                        key={action}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => onPerformAction(action)}
                        className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${details.className}`}
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${details.iconClassName}`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">
                            {isBusy
                              ? "Recording..."
                              : details.label}
                          </span>

                          <span className="mt-0.5 block text-xs opacity-75">
                            {details.description}
                          </span>
                        </span>

                        {isBusy ? (
                          <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <ArrowRight className="h-4 w-4 shrink-0 opacity-70" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#EAE7E0] bg-white px-4 py-5 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-[#36965D]" />

                  <p className="mt-2 font-semibold">
                    {preview.state === "completed"
                      ? "Attendance complete"
                      : "No actions available"}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-[#777584]">
                    {preview.state === "completed"
                      ? "This participant has already checked out."
                      : "No valid actions are available for the current attendance state."}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-[#F1C7BC] bg-[#FFF0EB] px-3.5 py-3 text-sm text-[#A34327]"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={busyAction !== null}
              className="mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-[#777584] transition hover:bg-[#F0EEE9] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFEBFF] text-[#5257C8]">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <DialogHeader className="mt-4">
              <DialogTitle>Attendance action</DialogTitle>

              <DialogDescription>
                Scan a participant to view available actions.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}