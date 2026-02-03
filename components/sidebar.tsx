"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/lib/auth/hooks";
import { hasRole } from "@/lib/auth/roles";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

interface SidebarLink {
  labelKey: string;
  href: string;
  requiredRole?: "user" | "admin" | "superadmin";
}

const sidebarLinks: SidebarLink[] = [
  {
    labelKey: "home",
    href: "/protected",
    requiredRole: "superadmin",
  },
  {
    labelKey: "dashboard",
    href: "/protected/dashboard",
    requiredRole: "user",
  },
  {
    labelKey: "users",
    href: "/protected/users",
    requiredRole: "admin",
  },
  {
    labelKey: "tests",
    href: "/protected/tests",
    requiredRole: "admin",
  },
  {
    labelKey: "settings",
    href: "/protected/settings",
    requiredRole: "superadmin",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, loading } = useUserRole();
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const locale = useLocale();

  // Filter links based on user role
  const visibleLinks = sidebarLinks.filter((link) => {
    if (loading || !role) return false;
    if (!link.requiredRole) return true;
    return hasRole(role, link.requiredRole);
  });

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === "/protected") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 start-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed start-0 top-0 z-40 h-screen w-64 bg-background border-e border-border transition-transform duration-300 md:translate-x-0 rtl:md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center  border-b border-border px-4">
            <Link href="/" className="font-bold text-lg py-6">
              <Image
                src={`/logo/logo-${locale}.svg`}
                alt={t("logo_alt")}
                width={150}
                height={150}
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-2 rounded-md transition-colors",
                      isActive(link.href)
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "hover:bg-accent/50",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <a
              href="https://nojeed.me"
              target="_blank"
              className="text-xs text-muted-foreground"
            >
              © 2026 Nojeed
            </a>
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
