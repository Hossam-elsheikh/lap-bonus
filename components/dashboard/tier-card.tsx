"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface TierData {
  id: number;
  title: string;
  description: string;
  pcr: number;
  rcr: number;
}

interface TierCardProps {
  tier: TierData;
}

export function TierCard({ tier }: TierCardProps) {
  const t = useTranslations("Dashboard.tier_card");

  const tierColors: Record<
    number,
    { bg: string; text: string; border: string }
  > = {
    1: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
    2: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    3: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    4: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    5: {
      bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
    },
  };

  const colors = tierColors[tier.id] || tierColors[1];

  return (
    <Card className={`${colors.border} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("title")}</span>
          <Badge
            className={`${colors.bg} ${colors.text} text-lg px-4 py-1`}
            variant="outline"
          >
            {tier.title}
          </Badge>
        </CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t("pcr")}</p>
            <p className="text-2xl font-bold">{tier.pcr}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t("rcr")}</p>
            <p className="text-2xl font-bold">{tier.rcr}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
