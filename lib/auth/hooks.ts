"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "./roles";

interface UseAuthResult {
  role: UserRole | null;
  loading: boolean;
}

/**
 * Hook to get current user's role (client-side)
 */
export function useUserRole(): UseAuthResult {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRole() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
          const userRole =
            (data.session.user.user_metadata?.role as UserRole) || "user";
          setRole(userRole);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    }

    getRole();
  }, []);

  return { role, loading };
}
