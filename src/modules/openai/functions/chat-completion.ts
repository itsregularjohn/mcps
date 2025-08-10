import { z } from "zod"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
})

export const chatCompletionInputSchema = z.object({
  prompt: z.string().describe("The prompt to send to GPT-4"),
  model: z.string().optional().default("gpt-4").describe("The OpenAI model to use"),
  temperature: z.number().optional().default(0.7).describe("Temperature for response randomness (0-2)"),
  maxTokens: z.number().optional().default(1000).describe("Maximum tokens in the response"),
  systemMessage: z.string().optional().describe("System message to set the context")
})

export type ChatCompletionInput = z.infer<typeof chatCompletionInputSchema>

export async function chatCompletion({
  prompt,
  model = "gpt-4",
  temperature = 0.7,
  maxTokens = 1000,
  systemMessage
}: ChatCompletionInput) {
  const messages: Array<{ role: string; content: string }> = []

  if (systemMessage) {
    messages.push({ role: "system", content: systemMessage })
  }

  messages.push({ role: "user", content: prompt })

  const completion = await openai.chat.completions.create({
    model,
    messages: messages as any,
    temperature,
    max_tokens: maxTokens
  })

  return completion.choices[0]?.message?.content || "No response generated"
}
