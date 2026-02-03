"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  phone: string | null;
  age: number | null;
  gender: string | null;
  points: number | null;
  tier: {
    title: string;
  } | null;
}

interface UsersTableProps {
  users: User[];
  count: number;
  page: number;
  totalPages: number;
}

export function UsersTable({
  users,
  count,
  page,
  totalPages,
}: UsersTableProps) {
  const router = useRouter();

  const handleRowClick = (userId: string) => {
    router.push(`/protected/users/${userId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>{count} total users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleRowClick(user.id)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{user.age || "-"}</TableCell>
                    <TableCell className="capitalize">
                      {user.gender || "-"}
                    </TableCell>
                    <TableCell>{user.tier?.title || "No Tier"}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{user.points || 0}</span>
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
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                <Link href={{ query: { page: page - 1 } }}>Previous</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild
              >
                <Link href={{ query: { page: page + 1 } }}>Next</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
