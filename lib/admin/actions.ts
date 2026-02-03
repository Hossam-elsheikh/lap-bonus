"use server";

import { createClient } from "@supabase/supabase-js";
import { getCurrentUserRole } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

// Initialize Supabase Admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export interface CreateTestInput {
  user_id: string;
  type_id: string;
  cost: number;
  notes: string;
  createdAt: string;
  pdfFile: File;
}

export async function addTestResult(input: CreateTestInput) {
  try {
    // Check permissions
    const role = await getCurrentUserRole();
    if (role !== "admin" && role !== "superadmin") {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch user name
    const { data: userData, error: userError } = await supabaseAdmin
      .from("user")
      .select("name")
      .eq("id", input.user_id)
      .single();

    if (userError || !userData) {
      return { success: false, error: "User not found" };
    }

    // Fetch type title
    const { data: typeData, error: typeError } = await supabaseAdmin
      .from("type")
      .select("title")
      .eq("id", input.type_id)
      .single();

    if (typeError || !typeData) {
      return { success: false, error: "Test type not found" };
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await input.pdfFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Format date as YYYY-MM-DD
    const date = new Date(input.createdAt);
    const formattedDate = date.toISOString().split("T")[0];

    // Sanitize strings for filename (remove spaces and special characters)
    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "_");
    const userName = sanitize(userData.name || "unknown");
    const typeName = sanitize(typeData.title || "unknown");

    // Generate filename: username_testtype_date.pdf
    const fileName = `${userName}_${typeName}_${formattedDate}.pdf`;

    // Upload to Supabase storage bucket "results"
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("results")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get the file path
    const filePath = uploadData.path;

    // Insert test record into test table with file_path
    const { error: insertError } = await supabaseAdmin.from("test").insert([
      {
        user_id: input.user_id,
        type_id: input.type_id,
        file_path: filePath,
        cost: input.cost,
        notes: input.notes,
        createdAt: input.createdAt,
      },
    ]);

    if (insertError) {
      console.error("Error creating test record:", insertError);
      // Try to clean up the uploaded file
      await supabaseAdmin.storage.from("results").remove([fileName]);
      return { success: false, error: insertError.message };
    }

    // Calculate and add points to user
    // Formula: points = points + (cost / tier.pcr)

    // 1. Fetch user's current points and tier_id (we already have user_id)
    const { data: userPointsData, error: userPointsError } = await supabaseAdmin
      .from("user")
      .select("points, tier_id")
      .eq("id", input.user_id)
      .single();

    if (!userPointsError && userPointsData && userPointsData.tier_id) {
      // 2. Fetch tier's PCR
      const { data: tierData, error: tierError } = await supabaseAdmin
        .from("tier")
        .select("pcr")
        .eq("id", userPointsData.tier_id)
        .single();

      if (!tierError && tierData && tierData.pcr) {
        // 3. Calculate points
        // Assuming pcr is a number. If pcr is 10 (10%), logic is cost / 10?
        // User request: "divided by the pcr percentage"
        // We will use standard division.
        // Points to add = Cost / PCR
        const pointsToAdd = input.cost / tierData.pcr;
        const newPoints = (userPointsData.points || 0) + pointsToAdd;

        // 4. Update user points
        await supabaseAdmin
          .from("user")
          .update({ points: newPoints })
          .eq("id", input.user_id);
      }
    }

    revalidatePath("/protected/admin/tests");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
