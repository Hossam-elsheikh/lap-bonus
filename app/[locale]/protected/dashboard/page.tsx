import { ProtectedRoute } from "@/lib/auth/protected-route";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import { TierCard } from "@/components/dashboard/tier-card";
import { UserDetailsCard } from "@/components/dashboard/user-details-card";
import { TestResultsTable } from "@/components/dashboard/test-results-table";
import { getTranslations } from "next-intl/server";
import { Loader2 } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  tier: {
    id: number;
    title: string;
    description: string;
    pcr: number;
    rcr: number;
  };
}

async function getUserData(userId: string): Promise<UserData | null> {
  const supabase = await createClient();

  const { data: userData, error } = await supabase
    .from("user")
    .select(
      `
      id,
      name,
      phone,
      age,
      tier:tier_id (
        id,
        title,
        description,
        pcr,
        rcr
      )
    `,
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  // Get email from auth
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  return {
    ...userData,
    email: authUser?.email || "",
    tier: Array.isArray(userData.tier) ? userData.tier[0] : userData.tier,
  };
}

async function getTestResults(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: tests,
    error,
    count,
  } = await supabase
    .from("test")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching test results:", error);
    return { tests: [], totalCount: 0 };
  }

  return {
    tests: tests || [],
    totalCount: count || 0,
  };
}

async function DashboardContent({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  const userData = await getUserData(userId);
  const { tests, totalCount } = await getTestResults(userId, page);
  const t = await getTranslations("Dashboard.loading");

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("unable_to_load")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TierCard tier={userData.tier} />
        <UserDetailsCard user={userData} />
      </div>

      {/* Test Results Table */}
      <TestResultsTable
        tests={tests}
        totalCount={totalCount}
        currentPage={page}
      />
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const searchP = await searchParams;
  const t = await getTranslations("Dashboard");
  const currentPage = parseInt(searchP.page || "1", 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            </div>
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3"></div>
              </CardHeader>
            </Card>
          </div>
        }
      >
        <DashboardWrapper page={currentPage} />
      </Suspense>
    </div>
  );
}

async function DashboardWrapper({ page }: { page: number }) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <DashboardContent userId={user.id} page={page} />
    </ProtectedRoute>
  );
}
