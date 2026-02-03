import { ProtectedRoute } from "@/lib/auth/protected-route";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface TestResult {
  id: string;
  test_name: string;
  score: number;
  max_score: number;
  status: "passed" | "failed" | "pending";
  createdAt: string;
  duration_minutes: number;
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

function TierCard({ tier }: { tier: UserData["tier"] }) {
  const tierColors: Record<
    number,
    { bg: string; text: string; border: string }
  > = {
    1: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
    2: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    3: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    4: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    5: {
      bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
    },
  };

  const colors = tierColors[tier.id] || tierColors[1];

  return (
    <Card className={`${colors.border} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Tier</span>
          <Badge
            className={`${colors.bg} ${colors.text} text-lg px-4 py-1`}
            variant="outline"
          >
            {tier.title}
          </Badge>
        </CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Personal Conversion Rate
            </p>
            <p className="text-2xl font-bold">{tier.pcr}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Referral Conversion Rate
            </p>
            <p className="text-2xl font-bold">{tier.rcr}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserDetailsCard({ user }: { user: UserData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-sm">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-medium">{user.age}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestResultsTable({
  tests,
  totalCount,
  currentPage,
}: {
  tests: TestResult[];
  totalCount: number;
  currentPage: number;
}) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      passed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <Badge variant="outline" className={statusColors[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Results History</CardTitle>
          <CardDescription>Your test results will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No test results found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results History</CardTitle>
        <CardDescription>
          Showing {tests.length} of {totalCount} total results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    {test.test_name}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {test.score}/{test.max_score}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      ({Math.round((test.score / test.max_score) * 100)}%)
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>{test.duration_minutes} min</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(test.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                asChild
              >
                <a href={`?page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                asChild
              >
                <a href={`?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
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

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load user data</p>
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
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const currentPage = parseInt(searchParams.page || "1", 10);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            View your tier level, details, and test results history
          </p>
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
          <DashboardContent userId={user.id} page={currentPage} />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
