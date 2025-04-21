import { supabase } from "./supabase";
import { NextResponse } from "next/server";

interface RateLimitResponse {
  allowed: boolean;
  error?: NextResponse;
}

export async function checkRateLimit(apiKey: string): Promise<RateLimitResponse> {
  try {
    // Check if the API key exists and get its usage and limit
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, usage, monthly_limit")
      .eq("key", apiKey)
      .single();

    if (error || !data) {
      return {
        allowed: false,
        error: NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      };
    }

    // Check if usage has reached the limit
    if ((data.usage || 0) >= data.monthly_limit) {
      return {
        allowed: false,
        error: NextResponse.json(
          { error: "Rate limit exceeded. Please upgrade your plan or wait until next month." },
          { status: 429 }
        )
      };
    }

    // Increment the usage counter
    const { error: updateError } = await supabase
      .from("api_keys")
      .update({ usage: (data.usage || 0) + 1 })
      .eq("id", data.id);

    if (updateError) {
      console.error("Error updating API key usage:", updateError);
      return {
        allowed: false,
        error: NextResponse.json(
          { error: "Failed to update API key usage" },
          { status: 500 }
        )
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return {
      allowed: false,
      error: NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      )
    };
  }
}
