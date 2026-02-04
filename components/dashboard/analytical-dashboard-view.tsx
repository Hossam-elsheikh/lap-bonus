"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  FileTextIcon,
  TrophyIcon,
  DollarSignIcon,
  TrendingUpIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { DashboardStats } from "@/lib/dashboard/actions";
import { useTranslations, useLocale } from "next-intl";

interface DashboardViewProps {
  stats: DashboardStats;
}

export function AnalyticalDashboardView({ stats }: DashboardViewProps) {
  const t = useTranslations("AnalyticalDashboard");
  const locale = useLocale();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(
      num,
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Top Stats Rows */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Count */}
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.total_users")}
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.usersCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("stats.active_users")}
            </p>
          </CardContent>
        </Card>

        {/* Tests Count */}
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.tests_performed")}
            </CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.testsCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("stats.total_tests")}
            </p>
          </CardContent>
        </Card>

        {/* Points Earned */}
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.points_distributed")}
            </CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.pointsEarned)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("stats.total_rewards")}
            </p>
          </CardContent>
        </Card>

        {/* Financials */}
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-emerald-500 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.total_revenue")}
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalProfits)}
            </div>
            <div className="flex items-center text-xs text-emerald-500 mt-1">
              <TrendingUpIcon className="h-3 w-3 mr-1" />
              <span className="font-semibold">
                {formatCurrency(stats.lastMonthProfits)}
              </span>
              <span className="text-muted-foreground ml-1">
                {t("stats.last_30_days")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Top 5 Tests */}
        <Card className="col-span-4 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{t("top_tests.title")}</CardTitle>
            <CardDescription>{t("top_tests.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topTests.map((test, index) => (
                <div key={test.name} className="flex items-center">
                  <div className="w-8 font-medium text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="ml-4 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {test.name}
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(test.count / Math.max(...stats.topTests.map((t) => t.count))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 font-medium text-sm">{test.count}</div>
                </div>
              ))}
              {stats.topTests.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t("top_tests.no_tests")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card className="col-span-3 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{t("user_tiers.title")}</CardTitle>
            <CardDescription>{t("user_tiers.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.tierDistribution.map((tier) => (
                <div
                  key={tier.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className={getTierColor(tier.name)}
                    >
                      {tier.name}
                    </Badge>
                  </div>
                  <span className="font-bold">{tier.count}</span>
                </div>
              ))}
              {stats.tierDistribution.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t("user_tiers.no_users")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2">
        <h3 className="col-span-full text-lg font-semibold mb-2">
          {t("quick_access.title")}
        </h3>

        <Link href="/protected/users" className="group">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group-hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                {t("quick_access.manage_users.title")}
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("quick_access.manage_users.description")}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/protected/tests" className="group">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group-hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                {t("quick_access.all_tests.title")}
              </CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("quick_access.all_tests.description")}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/protected/settings" className="group">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group-hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                {t("quick_access.platform_settings.title")}
              </CardTitle>
              <SettingsIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("quick_access.platform_settings.description")}
              </p>
            </CardContent>
          </Card>
        </Link>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-0.5 group cursor-not-allowed opacity-80">
          <Card className="h-full bg-background border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none text-[10px]">
                {t("quick_access.advanced_reports.coming_soon")}
              </Badge>
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                {t("quick_access.advanced_reports.title")}
              </CardTitle>
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("quick_access.advanced_reports.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getTierColor(tierName: string) {
  const name = tierName.toLowerCase();
  if (name.includes("gold"))
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-700";
  if (name.includes("silver"))
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  if (name.includes("bronze"))
    return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-500 dark:border-orange-700";
  if (name.includes("diamond"))
    return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-700";
  if (name.includes("platinum"))
    return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700";
  return "";
}
