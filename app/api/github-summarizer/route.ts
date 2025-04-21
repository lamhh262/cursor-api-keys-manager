import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { summarizeReadme } from "./chain";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = request.headers.get("x-api-key");
    const { githubUrl } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!githubUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Check if the API key exists in the database
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, user_id")
      .eq("key", apiKey)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Check if the API key has a user_id (for backward compatibility)
    if (!data.user_id) {
      console.warn('API key found without user_id:', data.id);
    }

    const readmeContent = await getGitHubReadme(githubUrl);
    const summary = await summarizeReadme(readmeContent);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error processing GitHub summarizer request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function getGitHubReadme(githubUrl: string): Promise<string> {
  try {
    // Extract owner and repo from GitHub URL
    const urlParts = githubUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Fetch README content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.statusText}`);
    }

    const readmeContent = await response.text();
    return readmeContent;
  } catch (error) {
    console.error("Error fetching GitHub README:", error);
    throw new Error("Failed to fetch repository README");
  }
}
