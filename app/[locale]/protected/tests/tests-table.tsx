"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface Test {
  id: string;
  test_name: string;
  cost: number;
  file_path: string;
  notes: string;
  createdAt: string;
  user: {
    name: string;
  } | null;
  user_id: string;
  type: {
    title: string;
  } | null;
}

interface TestsTableProps {
  tests: Test[];
  count: number;
  page: number;
  totalPages: number;
}

export function TestsTable({
  tests,
  count,
  page,
  totalPages,
}: TestsTableProps) {
  const searchParams = useSearchParams();
  const t = useTranslations("Tests");
  const locale = useLocale();

  // Create a helper to generate pagination links keeping existing params
  const getPageLink = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.test_type")}</TableHead>
              <TableHead>{t("table.user")}</TableHead>
              <TableHead>{t("table.cost")}</TableHead>
              <TableHead>{t("table.file")}</TableHead>
              <TableHead>{t("table.notes")}</TableHead>
              <TableHead>{t("table.date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("table.no_tests")}
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    {test.type?.title || t("table.unknown_type")}
                  </TableCell>
                  <TableCell>
                    {test.user?.name || t("table.unknown_user")}
                    <div
                      className="text-xs text-muted-foreground truncate w-24"
                      title={test.user_id}
                    >
                      {test.user_id.slice(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      ${test.cost?.toFixed(2) || "0.00"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span
                        className="text-sm text-muted-foreground truncate max-w-[150px]"
                        title={test.file_path}
                      >
                        {test.file_path?.split("/").pop() || t("table.no_file")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-sm text-muted-foreground truncate max-w-[200px]"
                      title={test.notes}
                    >
                      {test.notes || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(test.createdAt).toLocaleDateString(locale)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {t("pagination.page", { current: page, total: totalPages })}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} asChild>
              <Link href={getPageLink(page - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("pagination.previous")}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              asChild
            >
              <Link href={getPageLink(page + 1)}>
                {t("pagination.next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
