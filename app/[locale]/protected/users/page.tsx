import { ProtectedRoute } from "@/lib/auth/protected-route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Suspense } from "react";
import { UsersTable } from "./users-table";
import { getTranslations } from "next-intl/server";

interface UsersDataProps {
  page: number;
}

async function UsersData({ page }: UsersDataProps) {
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch users with tier information
  const {
    data: users,
    error,
    count,
  } = await supabaseAdmin
    .from("user")
    .select(
      `
      *,
      tier:tier_id (
        title
      )
    `,
      { count: "exact" },
    )
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching users:", error);
  }

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <UsersTable
      users={users || []}
      count={count || 0}
      page={page}
      totalPages={totalPages}
    />
  );
}

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const searchP = await searchParams;
  const page = parseInt(searchP.page || "1");
  const t = await getTranslations("Users");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
        <Link href="/protected/users/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("add_new")}
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>{t("table.title")}</CardTitle>
              <CardDescription>{t("loading")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {t("loading")}
              </div>
            </CardContent>
          </Card>
        }
      >
        <ProtectedRoute requiredRole="admin">
          <UsersData page={page} />
        </ProtectedRoute>
      </Suspense>
    </div>
  );
}
