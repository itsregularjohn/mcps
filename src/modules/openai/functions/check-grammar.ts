import { z } from "zod"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
})

export const checkGrammarInputSchema = z.object({
  text: z.string().describe("Text to check and improve grammar"),
  model: z.string().optional().default("gpt-3.5-turbo").describe("The OpenAI model to use for grammar checking")
})

export type CheckGrammarInput = z.infer<typeof checkGrammarInputSchema>

export async function checkGrammar({
  text,
  model = "gpt-3.5-turbo"
}: CheckGrammarInput): Promise<string> {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are a professional editor. Your task is to improve the grammar, spelling, and clarity of the text while preserving its meaning. Only return the corrected text without any explanations."
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  })

  return completion.choices[0]?.message?.content || text
}
