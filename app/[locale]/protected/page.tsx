import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/dashboard/actions";
import { AnalyticalDashboardView } from "@/components/dashboard/analytical-dashboard-view";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getCurrentUserRole } from "@/lib/auth/server";

export default async function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <AnalyticalDashboardContent />
      </Suspense>
    </div>
  );
}

async function AnalyticalDashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Only allow superadmin to access this page
  const role = await getCurrentUserRole();
  if (role !== "superadmin") {
    // Redirect non-superadmin users to their dashboard
    redirect("/protected/dashboard");
  }

  const stats = await getDashboardStats();

  return <AnalyticalDashboardView stats={stats} />;
}
