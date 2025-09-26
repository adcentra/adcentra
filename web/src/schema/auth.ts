import { z } from 'zod';
import dayjs from 'dayjs'
import { UserSchema } from './user'

export const AuthTokenSchema = z.object({
  token: z.string(),
  expiry: z.string().transform((val) => dayjs(val))
})

export type AuthToken = z.infer<typeof AuthTokenSchema>

export const CreateLoginRequestSchema = (t: (key: string) => string): z.ZodSchema<LoginRequest> => z.object({
  email: z.string().min(1, t('errors.emailRequired')).email(t('errors.invalidEmailAddress')),
  password: z.string().min(1, t('errors.passwordRequired')),
})

export type LoginRequest = {
  email: string
  password: string
}

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