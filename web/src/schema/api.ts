import { z } from 'zod'

export const ApiErrorSchema = z.object({
  status: z.number().optional(),
  message: z.string(),
  fieldErrors: z.record(z.string(), z.string()).optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

export const ApiResponseSchema = z.object({
  status: z.number().optional(),
  data: z.any().optional(),
})

export type ApiResponse = z.infer<typeof ApiResponseSchema>

export const ApiMessageResponseSchema = z.object({
  message: z.string(),
})

export type ApiMessageResponse = z.infer<typeof ApiMessageResponseSchema>
