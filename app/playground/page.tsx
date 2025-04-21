'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/app/components/Sidebar';

type ResponseType = {
  summary: string;
  cool_facts: string[];
  stars: number;
  latestVersion: string | null;
  website: string | null;
  license: {
    name: string | null;
    url: string | null;
  } | null;
};

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ResponseType | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validateResponse = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({}),
      });

      const validateData = await validateResponse.json();

      if (validateResponse.ok) {
        const summarizeResponse = await fetch('/api/github-summarizer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({ githubUrl }),
        });

        const summarizeData = await summarizeResponse.json();

        if (summarizeResponse.ok) {
          setResponse({
            summary: summarizeData.summary,
            cool_facts: summarizeData.cool_facts,
            stars: summarizeData.stars,
            latestVersion: summarizeData.latestVersion,
            website: summarizeData.website,
            license: summarizeData.license
          });
        } else {
          setResponse(null);
        }
      } else {
        setResponse(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 p-4 md:p-8">
        <div className="w-full mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">API Playground</h2>
          <div className="rounded-lg border bg-background shadow-sm w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border-r border-b">
                <div className="mb-2 text-sm font-medium">Request</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">POST</span>
                  <span className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                    /api/github-summarizer
                  </span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Enter your API Key</Label>
                  <Input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    required
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="githubUrl">Enter GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-2 text-sm font-medium">Response</div>
                <Tabs defaultValue="pretty">
                  <TabsList className="mb-2">
                    <TabsTrigger value="pretty">Pretty</TabsTrigger>
                    <TabsTrigger value="raw">Raw</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pretty" className="mt-0">
                    <div className="rounded border p-4 bg-muted/30 h-[500px] overflow-auto">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Summary:</h3>
                        <p className="text-sm">{response?.summary}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Cool Facts:</h3>
                        <ul className="text-sm list-disc pl-5">
                          {response?.cool_facts?.map((fact, index) => (
                            <li key={index}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Stars:</h3>
                        <p className="text-sm">{response?.stars}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Latest Version:</h3>
                        <p className="text-sm">{response?.latestVersion}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Website:</h3>
                        <a href={response?.website || '#'} className="text-sm text-blue-500 underline">{response?.website || 'N/A'}</a>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">License:</h3>
                        <p className="text-sm">{response?.license?.name}</p>
                        <a href={response?.license?.url || '#'} className="text-sm text-blue-500 underline">{response?.license?.url || 'N/A'}</a>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="raw" className="mt-0">
                    <Textarea
                      readOnly
                      value={JSON.stringify({ response }, null, 2)}
                      className="font-mono text-sm h-[500px] resize-none"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
