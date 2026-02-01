import { ProtectedRoute } from "@/lib/auth/protected-route";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function UsersData() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-sm overflow-auto">
            {JSON.stringify(users, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function UsersPage() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-2">Manage all users in the system</p>
          <p className="text-sm text-muted-foreground mt-4">Your role: <span className="font-semibold">{user?.role}</span></p>
        </div>

        <Suspense fallback={<div>Loading Users...</div>}>
          <UsersData />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}