import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define schema for structured output
const outputSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("A list of interesting facts about the repository")
});

const prompt = PromptTemplate.fromTemplate(
  `Summarize this github repository from this readme file content:
{readme_content}

{format_instructions}`
);

export async function summarizeReadme(readmeContent: string) {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY
  }).withStructuredOutput(outputSchema);

  const chain = prompt.pipe(model);

  return await chain.invoke({
    readme_content: readmeContent,
    format_instructions: "Please provide a summary and cool facts about the repository in JSON format with 'summary' and 'cool_facts' fields."
  });
}
