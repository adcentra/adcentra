import { z } from 'zod'
import dayjs from 'dayjs'
import { UserSchema } from './user'
import { HasLowerRX, HasUpperRX, HasSpecialRX, HasDigitRX } from '@/utils/regex'
import i18n from '@/i18n'
const { t } = i18n.global

export const AuthTokenSchema = z.object({
  token: z.string(),
  expiry: z.string().transform((val) => dayjs(val)),
})

export type AuthToken = z.infer<typeof AuthTokenSchema>

export const LoginRequestSchema = z.object({
  email: z.string().min(1, t('errors.emailRequired')).email(t('errors.invalidEmailAddress')),
  password: z.string().min(1, t('errors.passwordRequired')),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResponseSchema = z.object({
  user: UserSchema,
  authenticationToken: AuthTokenSchema,
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RefreshTokenResponseSchema = z.object({
  user: UserSchema,
  authenticationToken: AuthTokenSchema,
})

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>

export const RegisterRequestSchema = z
  .object({
    fullName: z
      .string()
      .min(1, t('errors.fullNameRequired'))
      .max(32, t('errors.fullNameMaxLength')),
    email: z.string().min(1, t('errors.emailRequired')).email(t('errors.invalidEmailAddress')),
    password: z
      .string()
      .nonempty(t('errors.passwordRequired'))
      .min(8, t('errors.passwordMinLength'))
      .max(72, t('errors.passwordMaxLength'))
      .regex(HasLowerRX, t('errors.passwordHasLowercase'))
      .regex(HasUpperRX, t('errors.passwordHasUppercase'))
      .regex(HasSpecialRX, t('errors.passwordHasSpecial'))
      .regex(HasDigitRX, t('errors.passwordHasDigit')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('errors.passwordConfirmation'),
    path: ['confirmPassword'],
  })

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const RegisterResponseSchema = z.object({
  user: UserSchema,
  authenticationToken: AuthTokenSchema,
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
