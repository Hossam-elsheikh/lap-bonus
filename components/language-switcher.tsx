"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[100px] border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder={t("label")} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="ar">{t("ar")}</SelectItem>
          <SelectItem value="en">{t("en")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
