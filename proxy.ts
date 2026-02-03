import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Update Supabase session (handles auth redirects for protected routes)
  const res = await updateSession(request);

  // If it's a redirect, return it immediately
  if (res.status === 307 || res.status === 302 || res.headers.get("location")) {
    return res;
  }

  // 2. Handle Internationalization
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all request paths except:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - images - .svg, .png, .jpg, .jpeg, .gif, .webp
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
