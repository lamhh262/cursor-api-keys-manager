"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ApiResponse {
  cool_facts: string[]
  summary: string
  stars: number
  latestVersion: string
  website: string
  license: {
    name: string
    url: string
  }
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
      "It supports research on local documents in various formats like PDF, Word, and Markdown.",
      "The project features a multi-agent assistant built with LangGraph for improved research depth and quality.",
      "The tool scrapes many opinions and will evenly explain diverse views that a biased person would never have read."
    ],
    summary: "GPT Researcher is an open-source AI agent designed for in-depth research, capable of generating detailed, unbiased reports from both web and local sources. It employs a planner-executor architecture, supports deep recursive research, and offers customizable frontends. The project also includes a multi-agent assistant for enhanced research capabilities and emphasizes reducing misinformation through comprehensive data aggregation.",
    stars: 21037,
    latestVersion: "v3.2.7",
    website: "https://gptr.dev",
    license: {
        name: "Apache License 2.0",
        url: "https://api.github.com/licenses/apache-2.0"
    }
  })
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check authentication status
      if (!session) {
        // If not authenticated, redirect to login
        router.push('/auth/signin?callbackUrl=/playground')
        return
      }

      // If authenticated, redirect to playground
      router.push('/playground')
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
              {loading ? "Loading..." : "Try It Out"}
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
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Stars:</h3>
                  <p className="text-sm">{response.stars}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Latest Version:</h3>
                  <p className="text-sm">{response.latestVersion}</p>
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
