"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  role?: "user" | "admin" | "superadmin";
}

export async function createUserAction(input: CreateUserInput) {
  try {
    // Validate inputs
    if (!input.email || !input.password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    if (input.password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    console.log("Creating user with email:", input.email);

    // Create user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        role: input.role || "user",
      },
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      
      // Check if user already exists
      if (authError.message.includes("already registered") || authError.message.includes("User already exists")) {
        return {
          success: false,
          error: "This email is already registered",
        };
      }
      
      throw new Error(`Failed to create user in Auth: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("User creation returned no user data");
    }

    console.log("Auth user created:", authData.user.id);

    // Create user record in user table
    const { error: dbError } = await supabaseAdmin.from("user").insert([
      {
        id: authData.user.id,
        email: input.email,
        name: input.name || input.email.split("@")[0],
        role: input.role || "user",
      },
    ]);

    if (dbError) {
      console.error("Database insertion error:", dbError);
      
      // Try to delete the auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      throw new Error(`Failed to create user profile: ${dbError.message}`);
    }

    console.log("User successfully created:", authData.user.email);

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create user";
    console.error("createUserAction error:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
