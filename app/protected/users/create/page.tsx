import { ProtectedRoute } from "@/lib/auth/protected-route";
import { CreateUserForm } from "@/components/create-user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CreateUserPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <Link
            href="/protected/users"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
          <h1 className="text-3xl font-bold">Add New User</h1>
          <p className="text-muted-foreground mt-2">
            Create a new user account
          </p>
        </div>

        <CreateUserForm />
      </div>
    </ProtectedRoute>
  );
}
