import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { summarizeReadme } from "./chain";
import { checkRateLimit } from "@/app/lib/rate-limit";
import { getGitHubRepoData } from "./github-service";

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

    const { readmeContent, repoData } = await getGitHubRepoData(githubUrl);
    const summary = await summarizeReadme(readmeContent);

    return NextResponse.json({
      ...summary,
      stars: repoData.stargazers_count,
      latestVersion: repoData.latestVersion,
      website: repoData.homepage,
      license: repoData.license
    });
  } catch (error) {
    console.error("Error processing GitHub summarizer request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
