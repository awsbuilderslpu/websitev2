"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Camera,
  CameraOff,
  CheckCircle2,
  Keyboard,
  MapPin,
  ScanLine,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";

import {
  AttendanceActionModal,
  type AttendanceAction,
  type AttendanceActionReceipt,
  type ScanPreview,
} from "@/components/dashboard/attendance/attendance-action-modal";

type AttendanceEvent = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  location: string | null;
  start_at: string;
  end_at: string;
  is_cancelled: boolean;
};

type CameraState = "idle" | "starting" | "scanning";

type ScannerControls = {
  stop: () => void;
};

type ScanApiResponse = Partial<ScanPreview> & {
  error?: string;
  success?: boolean;
  state?: string;
  recorded?: {
    recorded_at?: string;
  } | null;
  attendance?: {
    recorded_at?: string;
  } | null;
  recorded_at?: string;
};

type Props = {
  event: AttendanceEvent;
};

function formatEventDate(value: string | null | undefined) {
  if (!value) return "Date not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not specified";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function AttendanceScanner({ event }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<ScannerControls | null>(null);
  const scanHandledRef = useRef(false);
  const cameraRequestedRef = useRef(false);

  const [cameraState, setCameraState] =
    useState<CameraState>("idle");

  const [cameraError, setCameraError] =
    useState<string | null>(null);

  const [manualProfileId, setManualProfileId] =
    useState("");

  const [lookupBusy, setLookupBusy] = useState(false);

  const [preview, setPreview] =
    useState<ScanPreview | null>(null);

  const [actionReceipt, setActionReceipt] =
    useState<AttendanceActionReceipt | null>(null);

  const [actionModalOpen, setActionModalOpen] =
    useState(false);

  const [busyAction, setBusyAction] =
    useState<AttendanceAction | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  useEffect(() => {
    return () => {
      cameraRequestedRef.current = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, []);

  async function lookupParticipant(rawProfileId: string) {
    const profileId = rawProfileId.trim();

    if (!profileId) {
      setCameraError("Enter a participant profile ID.");
      return;
    }

    setLookupBusy(true);
    setCameraError(null);
    setActionError(null);

    try {
      const response = await fetch(
        `/api/v1/admin/events/${event.id}/attendance/scan?user_id=${encodeURIComponent(profileId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = (await response
        .json()
        .catch(() => ({}))) as ScanApiResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Could not find this participant."
        );
      }

      if (
        !data.event ||
        !data.participant ||
        !Array.isArray(data.allowedActions)
      ) {
        throw new Error(
          "The server returned an invalid participant response."
        );
      }

      setPreview(data as ScanPreview);
      setActionReceipt(null);
      setActionError(null);
      setActionModalOpen(true);
      setManualProfileId("");
    } catch (error) {
      setCameraError(
        error instanceof Error
          ? error.message
          : "Could not look up this participant."
      );
    } finally {
      setLookupBusy(false);
      scanHandledRef.current = false;
    }
  }

  function stopCamera() {
    cameraRequestedRef.current = false;
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCameraState("idle");
  }

  async function startCamera() {
    if (
      event.is_cancelled ||
      cameraState === "starting" ||
      cameraState === "scanning"
    ) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      setCameraError(
        "The camera preview is not available. Please try again."
      );
      return;
    }

    setCameraError(null);
    setCameraState("starting");
    scanHandledRef.current = false;
    cameraRequestedRef.current = true;

    try {
      const { BrowserQRCodeReader } = await import(
        "@zxing/browser"
      );

      const reader = new BrowserQRCodeReader();

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        video,
        (result) => {
          if (!result || scanHandledRef.current) {
            return;
          }

          const profileId = result.getText().trim();

          if (!profileId) {
            return;
          }

          scanHandledRef.current = true;

          controlsRef.current?.stop();
          controlsRef.current = null;

          setCameraState("idle");
          setCameraError(null);

          void lookupParticipant(profileId);
        }
      );

      if (
        scanHandledRef.current ||
        !cameraRequestedRef.current
      ) {
        controls.stop();
        return;
      }

      controlsRef.current = controls;
      setCameraState("scanning");
    } catch (error) {
      cameraRequestedRef.current = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
      setCameraState("idle");

      setCameraError(
        error instanceof Error
          ? `Unable to start the camera: ${error.message}`
          : "Unable to start the camera. Check your browser permissions."
      );
    }
  }

  function handleManualSubmit(
    eventObject: FormEvent<HTMLFormElement>
  ) {
    eventObject.preventDefault();

    if (lookupBusy || event.is_cancelled) {
      return;
    }

    stopCamera();
    void lookupParticipant(manualProfileId);
  }

  async function performAttendanceAction(
    action: AttendanceAction
  ) {
    if (!preview || busyAction) {
      return;
    }

    const currentPreview = preview;

    setBusyAction(action);
    setActionError(null);

    try {
      const response = await fetch(
        `/api/v1/admin/events/${event.id}/attendance/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentPreview.participant.id,
            action,
          }),
        }
      );

      const data = (await response
        .json()
        .catch(() => ({}))) as ScanApiResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to record this attendance action."
        );
      }

      const recordedAt =
        (data.recorded &&
        typeof data.recorded === "object"
          ? data.recorded.recorded_at
          : undefined) ??
        data.attendance?.recorded_at ??
        data.recorded_at ??
        new Date().toISOString();

      setActionReceipt({
        eventTitle: event.title,
        participant: currentPreview.participant,
        action,
        recordedAt,
        state: data.state ?? "",
      });

      setPreview(null);
      setActionError(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusyAction(null);
    }
  }

  function closeActionModal() {
    if (busyAction) {
      return;
    }

    setActionModalOpen(false);
    setPreview(null);
    setActionReceipt(null);
    setActionError(null);
  }

  function scanNextParticipant() {
    if (busyAction) {
      return;
    }

    const shouldRestartCamera =
      cameraRequestedRef.current && !event.is_cancelled;

    setActionModalOpen(false);
    setPreview(null);
    setActionReceipt(null);
    setActionError(null);
    setCameraError(null);
    setManualProfileId("");
    scanHandledRef.current = false;

    if (shouldRestartCamera) {
      window.setTimeout(() => {
        void startCamera();
      }, 200);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-6 text-[#242333] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <a
          href={`/dashboard/attendance/manage/${event.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#777584] transition hover:text-[#5257C8]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event attendance
        </a>

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-[#EAE7E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5257C8]">
              <ScanLine className="h-3.5 w-3.5" />
              ATTENDANCE SCANNER
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Scan and manage attendance
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777584] sm:text-base">
              Scan a member QR code to see their current attendance
              state and available actions.
            </p>
          </div>

          <div
            className={`flex w-fit shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ${
              event.is_cancelled
                ? "bg-[#FCE5DD] text-[#A34327]"
                : "bg-[#DFF3E5] text-[#246C42]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                event.is_cancelled
                  ? "bg-[#C45536]"
                  : "bg-[#36965D]"
              }`}
            />

            {event.is_cancelled
              ? "Event cancelled"
              : "Attendance enabled"}
          </div>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#EAE7E0] bg-white shadow-sm">
          <div className="border-b border-[#F0EEE9] px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFEBFF] text-[#5257C8]">
                <TicketCheck className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words text-lg font-bold">
                  {event.title}
                </p>

                <div className="mt-2 flex flex-col gap-2 text-sm text-[#777584] sm:flex-row sm:flex-wrap sm:gap-4">
                  {event.start_at && (
                    <span className="inline-flex items-center gap-1.5">
                      <Activity className="h-4 w-4 shrink-0" />
                      {formatEventDate(event.start_at)}
                    </span>
                  )}

                  {event.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="break-words">
                        {event.location}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {event.is_cancelled && (
            <div className="mx-5 mt-5 rounded-2xl border border-[#F1C7BC] bg-[#FFF0EB] p-4 text-sm text-[#A34327] sm:mx-7">
              This event has been cancelled. Scanning and
              attendance recording are disabled.
            </div>
          )}

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-bold">Scan a QR code</h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    cameraState === "scanning"
                      ? "bg-[#DFF3E5] text-[#246C42]"
                      : cameraState === "starting"
                        ? "bg-[#FFF4D9] text-[#755315]"
                        : "bg-[#F0EEE9] text-[#777584]"
                  }`}
                >
                  {cameraState === "scanning"
                    ? "Camera active"
                    : cameraState === "starting"
                      ? "Starting camera..."
                      : "Camera inactive"}
                </span>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-[#EAE7E0] bg-[#222130]">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  autoPlay
                  playsInline
                />

                {cameraState !== "scanning" && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#222130]/85 px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white">
                      {cameraState === "starting" ? (
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Camera className="h-7 w-7" />
                      )}
                    </div>

                    <p className="mt-4 font-semibold text-white">
                      {cameraState === "starting"
                        ? "Opening your camera"
                        : "Ready when you are"}
                    </p>

                    <p className="mt-2 max-w-xs text-sm leading-5 text-white/65">
                      {cameraState === "starting"
                        ? "Allow camera access in your browser if prompted."
                        : "Start your camera and point it at the member's QR code."}
                    </p>
                  </div>
                )}

                {cameraState === "scanning" && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative aspect-square w-[58%] max-w-64 rounded-3xl border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.18)]">
                      <span className="absolute -left-0.5 -top-0.5 h-7 w-7 rounded-tl-2xl border-l-4 border-t-4 border-[#F07832]" />
                      <span className="absolute -right-0.5 -top-0.5 h-7 w-7 rounded-tr-2xl border-r-4 border-t-4 border-[#F07832]" />
                      <span className="absolute -bottom-0.5 -left-0.5 h-7 w-7 rounded-bl-2xl border-b-4 border-l-4 border-[#F07832]" />
                      <span className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-br-2xl border-b-4 border-r-4 border-[#F07832]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {cameraState === "scanning" ||
                cameraState === "starting" ? (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#EAE7E0] bg-white px-4 py-3 font-semibold transition hover:bg-[#F5F3EE]"
                  >
                    <CameraOff className="h-4 w-4" />
                    Stop camera
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={event.is_cancelled}
                    onClick={() => void startCamera()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#5257C8] px-4 py-3 font-semibold text-white transition hover:bg-[#4448B6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                    Start camera
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs leading-5 text-[#898795]">
                Camera access requires browser permission and a
                secure context, such as HTTPS or localhost.
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E6] text-[#C7652E]">
                  <Keyboard className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Enter profile ID manually
                  </h2>
                  <p className="text-xs text-[#898795]">
                    Use this if the camera isn't available.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleManualSubmit}
                className="rounded-[24px] border border-[#EAE7E0] bg-[#FAF9F6] p-4 sm:p-5"
              >
                <label
                  htmlFor="participant-profile-id"
                  className="mb-2 block text-sm font-semibold"
                >
                  Participant profile ID
                </label>

                <input
                  id="participant-profile-id"
                  name="participant-profile-id"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={manualProfileId}
                  onChange={(eventObject) =>
                    setManualProfileId(eventObject.target.value)
                  }
                  placeholder="Paste the participant ID"
                  disabled={lookupBusy || event.is_cancelled}
                  className="w-full rounded-2xl border border-[#E5E2DA] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-[#AAA7B2] focus:border-[#777BE0] focus:ring-4 focus:ring-[#5257C8]/10 disabled:cursor-not-allowed disabled:bg-[#F0EEE9]"
                />

                <p className="mt-2 text-xs leading-5 text-[#898795]">
                  Enter the profile ID contained in the member's
                  QR code. This is the profile's ID, not the
                  event ID.
                </p>

                <button
                  type="submit"
                  disabled={
                    lookupBusy ||
                    event.is_cancelled ||
                    !manualProfileId.trim()
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E2DA] bg-white px-4 py-3 font-semibold transition hover:border-[#C8C5EF] hover:bg-[#F4F2FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lookupBusy ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#5257C8] border-t-transparent" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-[#5257C8]" />
                  )}

                  {lookupBusy
                    ? "Looking up participant..."
                    : "Find participant"}
                </button>
              </form>

              {cameraError && (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl border border-[#F1C7BC] bg-[#FFF0EB] p-3.5 text-sm leading-5 text-[#A34327]"
                >
                  {cameraError}
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-[#EAE7E0] bg-white p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[#36965D]" />
                  How it works
                </p>

                <div className="mt-3 space-y-3 text-sm text-[#777584]">
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 font-semibold text-[#5257C8]">
                      01
                    </span>
                    Scan the participant's QR code.
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 font-semibold text-[#5257C8]">
                      02
                    </span>
                    Choose from the actions allowed by their
                    current attendance state.
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 font-semibold text-[#5257C8]">
                      03
                    </span>
                    Record the action and view the success receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-[#898795]">
          Attendance records are associated with the selected event
          and the participant's profile ID.
        </p>
      </div>

      <AttendanceActionModal
        open={actionModalOpen}
        preview={preview}
        receipt={actionReceipt}
        busyAction={busyAction}
        error={actionError}
        onPerformAction={performAttendanceAction}
        onClose={closeActionModal}
        onScanNext={scanNextParticipant}
      />
    </div>
  );
}