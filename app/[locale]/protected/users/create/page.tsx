import { ProtectedRoute } from "@/lib/auth/protected-route";
import { CreateUserForm } from "@/components/create-user-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function CreateUserPage() {
  const t = await getTranslations("Users.create");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/protected/users"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Link>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ProtectedRoute requiredRole="admin">
          <CreateUserForm />
        </ProtectedRoute>
      </Suspense>
    </div>
  );
}
