"use client";

import { useState } from "react";
import { createUserAction } from "@/lib/auth/actions";
import { useUserRole } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function CreateUserForm() {
  const t = useTranslations("CreateUserForm");
  const { role: currentUserRole } = useUserRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [tierId, setTierId] = useState("1");
  const [role, setRole] = useState<"user" | "admin" | "superadmin">("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createUserAction({
      email,
      password,
      name,
      role,
      phone,
      age: parseInt(age),
      tier_id: parseInt(tierId),
    });

    if (result.success) {
      setMessage({
        type: "success",
        text: t("messages.success", { email: result.user?.email || "" }),
      });
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setAge("");
      setTierId("1");
      setRole("user");
    } else {
      setMessage({
        type: "error",
        text: result.error || t("messages.error"),
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t("phone_placeholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">{t("age")}</Label>
              <Input
                id="age"
                type="number"
                placeholder={t("age_placeholder")}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tierId">{t("tier_id")}</Label>
              <Input
                id="tierId"
                type="number"
                placeholder={t("tier_id_placeholder")}
                value={tierId}
                onChange={(e) => setTierId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t("role")}</Label>
            <Select value={role} onValueChange={(value: any) => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t("roles.user")}</SelectItem>
                {currentUserRole === "superadmin" && (
                  <>
                    <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                    <SelectItem value="superadmin">
                      {t("roles.superadmin")}
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {message && (
            <div
              className={`p-3 rounded text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loading") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
