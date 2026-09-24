import { supabaseServer } from "@/lib/supabase/server";
import type { AuthUser } from "@/lib/sso";

export async function getProfileId(user: AuthUser) {
  const { data: bySub, error: subError } = await supabaseServer
    .from("profiles")
    .select("id")
    .eq("sso_sub", user.sub)
    .maybeSingle();

  if (subError) {
    throw new Error("Failed to lookup user profile");
  }

  if (bySub) {
    return bySub.id as string;
  }

  if (!user.email) {
    throw new Error("Authenticated user has no email");
  }

  const { data: byEmail, error: emailError } = await supabaseServer
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();

  if (emailError) {
    throw new Error("Failed to lookup user profile");
  }

  if (!byEmail) {
    throw new Error("User profile not found");
  }

  const { error: updateError } = await supabaseServer
    .from("profiles")
    .update({
      sso_sub: user.sub,
    })
    .eq("id", byEmail.id);

  if (updateError) {
    throw new Error("Failed to link SSO profile");
  }

  return byEmail.id as string;
}