import { ProtectedRoute } from "@/lib/auth/protected-route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreateTestForm } from "./create-test-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CreateTestPage() {
  const { data: users } = await supabaseAdmin
    .from("user")
    .select("id, name")
    .order("name");

  // Fetch test types
  const { data: types } = await supabaseAdmin.from("type").select("*");

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <Link
            href="/protected/tests"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tests
          </Link>
          <h1 className="text-3xl font-bold">Add New Test</h1>
        </div>

        <CreateTestForm users={users || []} types={types || []} />
      </div>
    </ProtectedRoute>
  );
}
