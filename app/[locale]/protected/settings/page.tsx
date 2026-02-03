import { ProtectedRoute } from "@/lib/auth/protected-route";
import { getCurrentUser } from "@/lib/auth/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function SettingsPage() {
  const t = await getTranslations("Settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ProtectedRoute requiredRole="superadmin">
          <SettingsContent />
        </ProtectedRoute>
      </Suspense>
    </div>
  );
}

async function SettingsContent() {
  const user = await getCurrentUser();
  const t = await getTranslations("Settings");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("card_title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("your_role")}</p>
          <p className="font-semibold text-lg">{user?.role}</p>
        </div>
        <p className="text-sm text-muted-foreground">{t("only_superadmin")}</p>
      </CardContent>
    </Card>
  );
}
