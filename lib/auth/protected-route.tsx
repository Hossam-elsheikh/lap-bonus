import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth/server";
import { UserRole, hasRole } from "@/lib/auth/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

/**
 * Server-side wrapper to protect routes by role
 * Usage: <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
 */
export async function ProtectedRoute({
  children,
  requiredRole = "user",
}: ProtectedRouteProps) {
  const userRole = await getCurrentUserRole();

  if (!userRole || !hasRole(userRole, requiredRole)) {
    redirect("/auth/error?error=Unauthorized");
  }

  return <>{children}</>;
}

/**
 * Client-side component to show content only to users with required role
 */
export function RoleGate({
  children,
  requiredRole = "user",
  fallback = null,
}: ProtectedRouteProps & { fallback?: ReactNode }) {
  const { role, loading } = require("@/lib/auth/hooks").useUserRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!role || !hasRole(role, requiredRole)) {
    return fallback;
  }

  return <>{children}</>;
}
