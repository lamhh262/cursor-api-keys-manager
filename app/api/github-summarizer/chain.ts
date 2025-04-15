import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// Define schema for structured output
const outputSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("A list of interesting facts about the repository")
});

const parser = StructuredOutputParser.fromZodSchema(outputSchema);

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
  });

  const chain = RunnableSequence.from([
    {
      readme_content: (input: string) => input,
      format_instructions: () => parser.getFormatInstructions()
    },
    prompt,
    model,
    parser
  ]);

  return await chain.invoke(readmeContent);
}
