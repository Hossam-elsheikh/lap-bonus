"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface UserData {
  name: string;
  email: string;
  phone: string;
  age: number;
}

interface UserDetailsCardProps {
  user: UserData;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const t = useTranslations("Dashboard.user_details");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("name")}</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("email")}</p>
            <p className="font-medium text-sm">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("phone")}</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("age")}</p>
            <p className="font-medium">{user.age}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
