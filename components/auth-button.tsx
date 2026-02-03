import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getTranslations } from "next-intl/server";

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations("Navbar");

  // Get authenticated user
  const { data: authData } = await supabase.auth.getUser();
  const authUser = authData.user;

  if (!authUser) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">{t("login")}</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">{t("signup")}</Link>
        </Button>
      </div>
    );
  }

  // Get user data from user table
  const { data: userData, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", authUser.id)
    .single();

  // Get role from user metadata (custom JWT claims)
  const role = authUser.user_metadata?.role || "user";
  const userName = userData?.name || authUser.email?.split("@")[0] || "User";

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">{userName}</span>
        <span className="text-xs text-muted-foreground">{role}</span>
      </div>
      <LogoutButton />
    </div>
  );
}
