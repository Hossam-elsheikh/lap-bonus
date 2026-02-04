import { supabaseAdmin } from "./lib/supabase/admin";

async function test() {
  const { data, error } = await supabaseAdmin.from("tier").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Tier sample:", data);
  }

  const { data: users, error: userError } = await supabaseAdmin
    .from("user")
    .select("*")
    .limit(1);
  if (userError) {
    console.error("User Error:", userError);
  } else {
    console.log("User sample:", users);
  }
}

test();
