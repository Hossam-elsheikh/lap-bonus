"use client";

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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface TestResult {
  id: string;
  test_name: string;
  score: number;
  max_score: number;
  status: "passed" | "failed" | "pending";
  createdAt: string;
  duration_minutes: number;
}

interface TestResultsTableProps {
  tests: TestResult[];
  totalCount: number;
  currentPage: number;
}

export function TestResultsTable({
  tests,
  totalCount,
  currentPage,
}: TestResultsTableProps) {
  const t = useTranslations("Dashboard.test_results");
  const locale = useLocale();
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
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
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
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>{t("no_results")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("showing", { count: tests.length, total: totalCount })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.test_name")}</TableHead>
                <TableHead>{t("table.score")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.duration")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
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
                  <TableCell>
                    {test.duration_minutes} {t("table.min")}
                  </TableCell>
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
              {t("pagination.page", {
                current: currentPage,
                total: totalPages,
              })}
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
                  {t("pagination.previous")}
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                asChild
              >
                <a href={`?page=${currentPage + 1}`}>
                  {t("pagination.next")}
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
