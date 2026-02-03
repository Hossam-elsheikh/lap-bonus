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
import Link from "next/link";
import { TestFilters } from "./test-filters";
import { TestsTable } from "./tests-table";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    page?: string;
    test_name?: string;
    user_id?: string;
    date?: string;
  };
}

interface TestsDataProps {
  searchParams: PageProps["searchParams"];
}

async function TestsData({ searchParams }: TestsDataProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build query for tests
  let query = supabaseAdmin
    .from("test")
    .select(
      `
      *,
      user:user_id (
        name
      ),
      type:type_id (
        title
      )
    `,
      { count: "exact" },
    )
    .order("createdAt", { ascending: false })
    .range(from, to);

  // Apply filters
  if (searchParams.test_name) {
    query = query.ilike("test_name", `%${searchParams.test_name}%`);
  }

  if (searchParams.user_id && searchParams.user_id !== "all") {
    query = query.eq("user_id", searchParams.user_id);
  }

  if (searchParams.date) {
    const startDate = new Date(searchParams.date);
    const endDate = new Date(searchParams.date);
    endDate.setDate(startDate.getDate() + 1);

    query = query
      .gte("createdAt", startDate.toISOString())
      .lt("createdAt", endDate.toISOString());
  }

  const { data: tests, error, count } = await query;

  if (error) {
    console.error("Error fetching tests:", error);
  }

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <TestsTable
      tests={tests || []}
      count={count || 0}
      page={page}
      totalPages={totalPages}
    />
  );
}

export default async function AdminTestsPage({ searchParams }: PageProps) {
  const searchP = await searchParams;

  // Fetch users for filter dropdown (fast enough to be awaited directly, or could be separate too)
  const { data: users } = await supabaseAdmin
    .from("user")
    .select("id, name")
    .order("name");

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Test Management</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all user test results
            </p>
          </div>
          <Link href="/protected/tests/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Test
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tests</CardTitle>
            <CardDescription>Manage and view test results</CardDescription>
          </CardHeader>
          <CardContent>
            <TestFilters users={users || []} />

            <Suspense
              fallback={
                <div className="py-8 text-center text-muted-foreground">
                  Loading tests...
                </div>
              }
            >
              <TestsData searchParams={searchP} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
