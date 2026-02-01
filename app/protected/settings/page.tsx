import { ProtectedRoute } from "@/lib/auth/protected-route";
import { getCurrentUser } from "@/lib/auth/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute requiredRole="superadmin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-2">Configure system-wide settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Superadmin Only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Role</p>
              <p className="font-semibold text-lg">{user?.role}</p>
            </div>
            <p className="text-sm text-muted-foreground">Only superadmin users can access this page. Configure global settings here.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
