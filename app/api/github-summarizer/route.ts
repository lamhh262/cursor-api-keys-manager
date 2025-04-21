import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { summarizeReadme } from "./chain";
import { checkRateLimit } from "@/app/lib/rate-limit";

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

    // Check rate limit
    const rateLimitResult = await checkRateLimit(apiKey);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.error;
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
