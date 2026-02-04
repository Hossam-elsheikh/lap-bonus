"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface DashboardStats {
  usersCount: number;
  testsCount: number;
  topTests: { name: string; count: number }[];
  tierDistribution: { name: string; count: number }[];
  pointsEarned: number;
  totalProfits: number;
  lastMonthProfits: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // 1. Users Count
  const { count: usersCount, error: usersError } = await supabaseAdmin
    .from("user")
    .select("*", { count: "exact", head: true });

  if (usersError) {
    console.error("Error fetching users count:", usersError);
  }

  // 2. Tests Count
  const { count: testsCount, error: testsError } = await supabaseAdmin
    .from("test")
    .select("*", { count: "exact", head: true });

  if (testsError) {
    console.error("Error fetching tests count:", testsError);
  }

  // 4. Tier Distribution & Points Earned (Safe Join)
  const { data: usersData, error: usersDataError } = await supabaseAdmin
    .from("user")
    .select("id, points, tier_id");

  if (usersDataError) {
    console.error("Error fetching users data:", usersDataError);
  }

  // Fetch all tiers to ensure we have names for all possible IDs
  const { data: tiersData, error: tiersError } = await supabaseAdmin
    .from("tier")
    .select("id, title");

  if (tiersError) {
    console.error("Error fetching tiers:", tiersError);
  }

  let tierDistribution: { name: string; count: number }[] = [];
  let pointsEarned = 0;

  if (usersData) {
    const tierMap = new Map<number, string>();
    const tierCounts: Record<string, number> = {};

    // Initialize map and counts with all tiers from database to ensure 0-count tiers are visible
    if (tiersData) {
      tiersData.forEach((t) => {
        tierMap.set(Number(t.id), t.title);
        tierCounts[t.title] = 0;
      });
    }

    usersData.forEach((u) => {
      // Aggregate total points
      pointsEarned += u.points || 0;

      const tierId = u.tier_id;
      if (tierId) {
        // Find tier name by ID (ensure key is treated as number)
        const tierName = tierMap.get(Number(tierId));
        if (tierName) {
          tierCounts[tierName]++;
        } else {
          tierCounts["Unknown"] = (tierCounts["Unknown"] || 0) + 1;
        }
      } else {
        tierCounts["Unknown"] = (tierCounts["Unknown"] || 0) + 1;
      }
    });

    // Convert to array and sort by count DESC
    tierDistribution = Object.entries(tierCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // 3. Top 5 Tests Types (Safe Join)
  // Fetch all tests with type_id
  const { data: testsData, error: testsDataError } = await supabaseAdmin
    .from("test")
    .select("type_id, cost, createdAt");

  // Fetch all types
  const { data: typesData, error: typesError } = await supabaseAdmin
    .from("type")
    .select("id, title");

  let topTests: { name: string; count: number }[] = [];
  let totalProfits = 0;
  let lastMonthProfits = 0;

  if (!testsDataError && testsData) {
    // Create Map of Type ID to Title
    const typeMap = new Map<string, string>();
    if (typesData) {
      typesData.forEach((t) => typeMap.set(t.id, t.title));
    }

    const typeCounts: Record<string, number> = {};
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    testsData.forEach((t) => {
      // Top Tests Logic
      if (t.type_id) {
        const title = typeMap.get(t.type_id) || "Unknown";
        typeCounts[title] = (typeCounts[title] || 0) + 1;
      }

      // Profits Logic
      const cost = t.cost || 0;
      totalProfits += cost;

      if (t.createdAt) {
        const testDate = new Date(t.createdAt);
        if (testDate >= thirtyDaysAgo && testDate <= now) {
          lastMonthProfits += cost;
        }
      }
    });

    topTests = Object.entries(typeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  return {
    usersCount: usersCount || 0,
    testsCount: testsCount || 0,
    topTests,
    tierDistribution,
    pointsEarned,
    totalProfits,
    lastMonthProfits,
  };
}
