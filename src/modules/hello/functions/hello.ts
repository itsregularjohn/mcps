
import { addExclamation } from "../utils/addExclamation"

import { z } from "zod"

export const helloInputSchema = z.object({
  who: z.string().optional().default("world!").describe("Who's the hello for")
})

export type HelloInput = z.infer<typeof helloInputSchema>

export function sayHello(input: HelloInput) {
  return addExclamation(`Hello, ${input.who}`)
}
