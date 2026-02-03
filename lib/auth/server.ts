import { createClient } from "@/lib/supabase/server";
import { UserRole } from "./roles";

/**
 * Get the current user's role from their JWT claims
 * Make sure your Supabase user has a 'role' custom claim set
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session?.user) {
    return null;
  }

  // Get role from user's custom claims (if set in Supabase)
  const role = (data.session.user.user_metadata?.role as UserRole) || "user";
  return role;
}

/**
 * Get current user with role
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session?.user) {
    return null;
  }

  const role = (data.session.user.user_metadata?.role as UserRole) || "user";

  return {
    id: data.session.user.id,
    email: data.session.user.email || "",
    role,
  };
}
