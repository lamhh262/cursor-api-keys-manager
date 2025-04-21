"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ExternalLink } from "lucide-react"

interface ApiResponse {
  cool_facts: string[]
  summary: string
}

export function ApiDemo() {
  const [loading, setLoading] = useState(false)
  const [requestPayload, setRequestPayload] = useState(
    JSON.stringify({ githubUrl: "https://github.com/assafelovic/gpt-researcher" }, null, 2),
  )
  const [response, setResponse] = useState<ApiResponse>({
    cool_facts: [
      "GPT Researcher is an open-source deep research agent that can perform web and local research on any given task.",
      "It generates detailed, factual, and unbiased research reports with citations.",
      "The architecture utilizes 'planner' and 'execution' agents for generating research questions and gathering information, respectively.",
      "It supports deep research with a tree-like exploration pattern, diving deeper into subtopics while maintaining a comprehensive view.",
      "The project offers both lightweight and production-ready frontend versions.",
      "It supports research on local documents in various formats like PDF, TXT, CSV, Excel, Markdown, PPTX, and DOCX.",
      "It features a multi-agent assistant built with LangGraph for improved research depth and quality.",
      "The project actively encourages contributions and has a roadmap available on Trello.",
    ],
    summary:
      "GPT Researcher is an open-source AI agent designed to automate and enhance research processes. It leverages a planner-executor architecture to generate detailed, unbiased reports from web and local sources. The tool offers features like deep research, multi-agent assistance, and customizable frontends, aiming to provide accurate and comprehensive information efficiently.",
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we'll simulate a response after a delay
      const payload = JSON.parse(requestPayload)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if the URL is valid
      if (!payload.githubUrl || !payload.githubUrl.includes("github.com/")) {
        throw new Error("Please enter a valid GitHub repository URL")
      }

      // Extract repo name for a more personalized response
      const repoPath = payload.githubUrl.split("github.com/")[1]
      const [owner, repo] = repoPath.split("/")

      // Generate a simulated response based on the repo
      const simulatedResponse: ApiResponse = {
        cool_facts: [
          `${repo} is an open-source project maintained by ${owner}.`,
          `This repository contains code for ${repo}, which appears to be a software project.`,
          `The project structure follows modern development practices.`,
          `It has documentation that explains its features and usage.`,
          `The codebase is well-organized and follows best practices.`,
          `It supports multiple platforms and environments.`,
          `The project has an active community of contributors.`,
          `Regular updates and maintenance keep the project current with industry standards.`,
        ],
        summary: `${repo} is an open-source project developed by ${owner} that provides a comprehensive solution for its target use case. The repository contains well-structured code, documentation, and examples that demonstrate its capabilities. The project is actively maintained and welcomes contributions from the community.`,
      }

      setResponse(simulatedResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">API Request Demo</div>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.open("/docs", "_blank")}>
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Documentation</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-4 border-r border-b">
          <div className="mb-2 text-sm font-medium">Request</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">POST</span>
            <span className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
              https://api.github-analyzer.com/analyze
            </span>
          </div>
          <Textarea
            value={requestPayload}
            onChange={(e) => setRequestPayload(e.target.value)}
            className="font-mono text-sm h-[300px] resize-none"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        </div>
        <div className="p-4">
          <div className="mb-2 text-sm font-medium">Response</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">200 OK</span>
            <span className="text-xs text-muted-foreground">1.02 KB</span>
          </div>
          <Tabs defaultValue="pretty">
            <TabsList className="mb-2">
              <TabsTrigger value="pretty">Pretty</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            <TabsContent value="pretty" className="mt-0">
              <div className="rounded border p-4 bg-muted/30 h-[300px] overflow-auto">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Cool Facts:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {response.cool_facts.map((fact, index) => (
                      <li key={index} className="text-sm">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Summary:</h3>
                  <p className="text-sm">{response.summary}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-0">
              <Textarea
                readOnly
                value={JSON.stringify(response, null, 2)}
                className="font-mono text-sm h-[300px] resize-none"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
