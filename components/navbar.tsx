import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 bg-background border-b border-border md:pl-64">
      <div className="flex justify-between items-center h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg hidden md:block">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
