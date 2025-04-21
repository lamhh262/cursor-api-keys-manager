/**
 * Service for interacting with GitHub API
 */

/**
 * Fetches repository data including README, star count, and latest version
 * @param githubUrl The GitHub repository URL
 * @returns Repository data including README content, star count, and latest version
 */
export async function getGitHubRepoData(githubUrl: string): Promise<{
  readmeContent: string,
  repoData: {
    stargazers_count: number,
    latestVersion: string | null,
    homepage: string | null,
    license: {
      name: string | null,
      url: string | null
    } | null
  }
}> {
  try {
    // Extract owner and repo from GitHub URL
    const urlParts = githubUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Create base URL for API requests
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // Make all API requests in parallel
    const [readmeResponse, repoResponse, releaseResponse] = await Promise.all([
      // Fetch README content
      fetch(`${baseUrl}/readme`, {
        headers: {
          Accept: "application/vnd.github.v3.raw",
        },
      }),

      // Fetch repository metadata
      fetch(baseUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }),

      // Fetch latest release (this might fail for repos without releases)
      fetch(`${baseUrl}/releases/latest`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }).catch(() => new Response(null, { status: 404 })) // Handle missing releases gracefully
    ]);

    // Process README response
    if (!readmeResponse.ok) {
      throw new Error(`Failed to fetch README: ${readmeResponse.statusText}`);
    }
    const readmeContent = await readmeResponse.text();

    // Process repository metadata response
    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository data: ${repoResponse.statusText}`);
    }
    const repoData = await repoResponse.json();

    // Process release response
    let latestVersion = null;
    if (releaseResponse.ok) {
      const releaseData = await releaseResponse.json();
      latestVersion = releaseData.tag_name;
    }

    return {
      readmeContent,
      repoData: {
        stargazers_count: repoData.stargazers_count,
        latestVersion,
        homepage: repoData.homepage,
        license: repoData.license ? {
          name: repoData.license.name,
          url: repoData.license.url
        } : null
      }
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw new Error("Failed to fetch repository data");
  }
}
