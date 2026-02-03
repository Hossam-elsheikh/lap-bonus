import { createNavigation } from "next-intl/navigation";

export const routing = {
  locales: ["en", "ar"],
  defaultLocale: "ar",
} as const;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
