import { ProtectedRoute } from "@/lib/auth/protected-route";
import { getCurrentUser } from "@/lib/auth/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Administrative controls and monitoring</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Role</p>
              <p className="font-semibold text-lg">{user?.role}</p>
            </div>
            <p className="text-sm text-muted-foreground">Manage users, view analytics, and system settings.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
