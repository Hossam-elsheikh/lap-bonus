import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

export function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 bg-background border-b border-border md:ps-64">
      <div className="flex justify-between items-center h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg hidden md:block">
            {t("dashboard")}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Suspense fallback={null}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
