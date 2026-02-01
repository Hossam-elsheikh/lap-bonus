import { getCurrentUser } from "@/lib/auth/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function AdminInfo() {
  const user = await getCurrentUser();

  return (
    <>
      <p className="text-sm text-muted-foreground mt-4">Your role: <span className="font-semibold">{user?.role}</span></p>

      {/* Admin Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Your Role</p>
            <p className="font-semibold text-lg">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            Use the form on the left to create new users with different roles.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export { AdminInfo };
