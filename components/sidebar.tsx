"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/lib/auth/hooks";
import { hasRole } from "@/lib/auth/roles";

interface SidebarLink {
  label: string;
  href: string;
  requiredRole?: "user" | "admin" | "superadmin";
}

const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/protected",
    requiredRole: "user",
  },
  {
    label: "Users",
    href: "/protected/users",
    requiredRole: "admin",
  },
  {
    label: "Admin Panel",
    href: "/protected/admin",
    requiredRole: "admin",
  },
  {
    label: "Settings",
    href: "/protected/settings",
    requiredRole: "superadmin",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, loading } = useUserRole();

  // Filter links based on user role
  const visibleLinks = sidebarLinks.filter((link) => {
    if (loading || !role) return false;
    if (!link.requiredRole) return true;
    return hasRole(role, link.requiredRole);
  });

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r border-border transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 border-b border-border px-4">
            <Link href="/" className="font-bold text-lg">
              Lap Bonus
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <a href="https://nojeed.me" target="_blank" className="text-xs text-muted-foreground">© 2026 Nojeed</a>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
