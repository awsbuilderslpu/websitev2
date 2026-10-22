import { notFound } from "next/navigation";

import { AttendanceScanner } from "@/components/dashboard/attendance/attendance-scanner";
import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function AttendanceScannerPage({
  params,
}: PageProps) {
  const { eventId } = await params;

  await requireRole(
    ["core", "admin"],
    `/dashboard/attendance/manage/${eventId}/scanner`,
  );

  const { data: event, error } = await supabaseServer
    .from("events")
    .select(`
      id,
      title,
      slug,
      event_type,
      location,
      start_at,
      end_at,
      is_cancelled
    `)
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load scanner event:", error);
    throw new Error("Failed to load event.");
  }

  if (!event) {
    notFound();
  }

  return <AttendanceScanner event={event} />;
}