import { ProtectedRoute } from "@/lib/auth/protected-route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreateTestForm } from "./create-test-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function CreateTestPage() {
  const t = await getTranslations("Tests.create");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/protected/tests"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Link>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <CreateTestContent />
      </Suspense>
    </div>
  );
}

async function CreateTestContent() {
  const { data: users } = await supabaseAdmin
    .from("user")
    .select("id, name")
    .order("name");

  // Fetch test types
  const { data: types } = await supabaseAdmin.from("type").select("*");

  return (
    <ProtectedRoute requiredRole="admin">
      <CreateTestForm users={users || []} types={types || []} />
    </ProtectedRoute>
  );
}
