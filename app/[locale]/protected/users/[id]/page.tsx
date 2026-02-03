import { ProtectedRoute } from "@/lib/auth/protected-route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Award, FileText } from "lucide-react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;
  const t = await getTranslations("Users.profile");

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
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ProtectedRoute requiredRole="admin">
          <UserProfileContent id={id} />
        </ProtectedRoute>
      </Suspense>
    </div>
  );
}

async function UserProfileContent({ id }: { id: string }) {
  const t = await getTranslations("Users.profile");

  // Fetch user details with tier information
  const { data: user, error: userError } = await supabaseAdmin
    .from("user")
    .select(
      `
      *,
      tier:tier_id (
        title,
        description,
        pcr,
        rcr
      )
    `,
    )
    .eq("id", id)
    .single();

  if (userError || !user) {
    notFound();
  }

  // Helper to get badge color based on tier title
  const getTierBadgeVariant = (title: string) => {
    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("gold"))
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
    if (lowerTitle.includes("silver"))
      return "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200";
    if (lowerTitle.includes("diamond"))
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
  };

  const calculateConversionRate = (cr: number) => {
    return cr ? `${cr}%` : "N/A";
  };

  const tierTitle = user.tier?.title || t("no_tier");
  const badgeClass = getTierBadgeVariant(tierTitle);

  // Fetch user's test history
  const { data: tests, error: testsError } = await supabaseAdmin
    .from("test")
    .select(
      `
      *,
      type:type_id (
        title
      )
    `,
    )
    .eq("user_id", id)
    .order("createdAt", { ascending: false });

  if (testsError) {
    console.error("Error fetching tests:", testsError);
  }

  return (
    <div className="space-y-6">
      {/* User Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("personal_info")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("name")}</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("phone")}</p>
              <p className="font-medium">{user.phone || "-"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("age")}</p>
                <p className="font-medium">{user.age || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("gender")}</p>
                <p className="font-medium capitalize">{user.gender || "-"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("member_since")}
              </p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tier Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t("tier_points")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t("current_tier")}
              </p>
              <div className="flex items-center gap-2">
                <Badge className={`text-base px-3 py-1 ${badgeClass} border`}>
                  {tierTitle}
                </Badge>
              </div>
              {user.tier?.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {user.tier.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("pcr")}</p>
                <p className="text-lg font-semibold">
                  {calculateConversionRate(user.tier?.pcr)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("rcr")}</p>
                <p className="text-lg font-semibold">
                  {calculateConversionRate(user.tier?.rcr)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("total_points")}
              </p>
              <p className="text-4xl font-bold text-primary mt-1">
                {user.points || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("test_history")}
          </CardTitle>
          <CardDescription>
            {t("tests_completed", { count: tests?.length || 0 })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tests && tests.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("test_type")}</TableHead>
                    <TableHead>{t("cost")}</TableHead>
                    <TableHead>{t("notes")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test: any) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">
                        {test.type?.title || t("unknown_type")}
                      </TableCell>
                      <TableCell>${test.cost?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>
                        <span
                          className="text-sm text-muted-foreground truncate max-w-[200px] inline-block"
                          title={test.notes}
                        >
                          {test.notes || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(test.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              {t("no_tests")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
