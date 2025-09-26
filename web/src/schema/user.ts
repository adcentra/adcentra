import { z } from 'zod'
import dayjs from 'dayjs'

export const UserSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  profileImageUrl: z.string().optional(),
  activated: z.boolean(),
  lastLoginAt: z
    .string()
    .optional()
    .transform((val) => (val ? dayjs(val) : undefined)),
})

export type User = z.infer<typeof UserSchema>

export const GetCurrentUserResponseSchema = z.object({
  user: UserSchema,
})

export type GetCurrentUserResponse = z.infer<typeof GetCurrentUserResponseSchema>
