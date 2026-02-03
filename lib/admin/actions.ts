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

    // 4. Call the RPC to handle database updates in a transaction
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
      "process_test_result",
      {
        p_user_id: input.user_id,
        p_type_id: input.type_id,
        p_file_path: filePath,
        p_cost: input.cost,
        p_notes: input.notes,
        p_created_at: input.createdAt,
      },
    );

    if (rpcError || !rpcData?.success) {
      console.error(
        "Error in process_test_result RPC:",
        rpcError || rpcData?.error,
      );
      // Try to clean up the uploaded file
      await supabaseAdmin.storage.from("results").remove([fileName]);
      return {
        success: false,
        error: rpcError?.message || rpcData?.error || "Transaction failed",
      };
    }

    revalidatePath("/protected/admin/tests");
    return {
      success: true,
      tierUpgraded: rpcData.tier_upgraded,
      pointsAdded: rpcData.points_added,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
