import { z } from 'zod';
import dayjs from 'dayjs'
import { UserSchema } from './user'

export const AuthTokenSchema = z.object({
  token: z.string(),
  expiry: z.string().transform((val) => dayjs(val))
})

export type AuthToken = z.infer<typeof AuthTokenSchema>

export const LoginRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResponseSchema = z.object({
  user: UserSchema,
  authenticationToken: AuthTokenSchema
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RefreshTokenResponseSchema = z.object({
  user: UserSchema,
  authenticationToken: AuthTokenSchema
})

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>

export const RegisterResponseSchema = z.object({
  user: UserSchema
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>