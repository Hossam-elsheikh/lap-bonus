import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/components/create-user-form";
import { AdminInfo } from "./admin-info";
import { Suspense } from "react";

export default async function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Administrative controls and monitoring</p>
          <Suspense fallback={<p className="text-sm text-muted-foreground mt-4">Loading...</p>}>
            <AdminInfo />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create User Section */}
          <CreateUserForm />

          {/* Admin Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Feature</p>
                <p className="font-semibold text-lg">User Management</p>
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                Use the form on the left to create new users with different roles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
