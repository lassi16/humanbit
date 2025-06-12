import { z } from "zod"

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"),
  RAPIDAPI_KEY: z.string().min(1, "RapidAPI key is required"),
  RAPIDAPI_HOST: z.string().min(1, "RapidAPI host is required"),
  NEXT_PUBLIC_BASE_URL: z.string().url("Valid base URL is required"),
})

export const env = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  RAPIDAPI_HOST: process.env.RAPIDAPI_HOST,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
})

export type Env = z.infer<typeof envSchema>
