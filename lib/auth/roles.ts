export type UserRole = "user" | "admin" | "superadmin";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export const ROLE_HIERARCHY = {
  user: 0,
  admin: 1,
  superadmin: 2,
};

/**
 * Check if user has minimum required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.some((role) => hasRole(userRole, role));
}
