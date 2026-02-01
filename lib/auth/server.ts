import { createClient } from "@/lib/supabase/server";
import { UserRole } from "./roles";

/**
 * Get the current user's role from their JWT claims
 * Make sure your Supabase user has a 'role' custom claim set
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session?.user) {
      return null;
    }

    // Get role from user's custom claims (if set in Supabase)
    const role = (data.session.user.user_metadata?.role as UserRole) || "user";
    return role;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Get current user with role
 */
export async function getCurrentUser() {
  try {
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
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
