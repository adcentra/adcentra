import { useAuthFetch, refreshToken } from '@/composables/useAuthFetch'
import {
  LoginResponseSchema,
  RegisterResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type RegisterResponse,
} from '@/schema/auth'
import { type ApiResponse, type ApiError, ApiMessageResponseSchema } from '@/schema/api'
import { GetCurrentUserResponseSchema, type User } from '@/schema/user'
import ServiceError from './serviceError'
import i18n from '@/i18n'

const { t } = i18n.global

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data, error } = await useAuthFetch('/tokens/authentication')
    .post(credentials)
    .json<ApiResponse>()

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }

  try {
    const loginResponse = LoginResponseSchema.parse(data.value?.data)
    return loginResponse
  } catch (error) {
    console.error('Failed to parse the response' + error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function logout(scope: 'local' | 'global' | 'others' = 'local') {
  try {
    await useAuthFetch(`/tokens/authentication?scope=${scope}`).delete()
  } catch (error) {
    console.warn('Logout API call failed:', error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data, error } = await useAuthFetch('/me').get().json<ApiResponse>()

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }

  try {
    const getCurrentUserResponse = GetCurrentUserResponseSchema.parse(data.value?.data)
    return getCurrentUserResponse.user
  } catch (error) {
    console.error('Failed to parse the response: ' + error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function register(userData: {
  email: string
  password: string
  fullName?: string
}): Promise<RegisterResponse> {
  const { data, error } = await useAuthFetch('/users').post(userData).json<ApiResponse>()

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }

  try {
    const registerResponse = RegisterResponseSchema.parse(data.value?.data)
    return registerResponse
  } catch (error) {
    console.error('Failed to parse the response:', error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function requestActivationToken(email: string): Promise<string> {
  const { data, error } = await useAuthFetch('/tokens/activation')
    .post({ email })
    .json<ApiResponse>()

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }

  try {
    const apiMessageResponse = ApiMessageResponseSchema.parse(data.value?.data)
    return apiMessageResponse.message
  } catch (error) {
    console.error('Failed to parse the response:', error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function activateAccount(token: string): Promise<void> {
  const { error } = await useAuthFetch('/users/activate').put({ token })

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }
}

export async function requestPasswordReset(email: string): Promise<string> {
  const { data, error } = await useAuthFetch('/tokens/password-reset')
    .post({ email })
    .json<ApiResponse>()

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }

  try {
    const apiMessageResponse = ApiMessageResponseSchema.parse(data.value?.data)
    return apiMessageResponse.message
  } catch (error) {
    console.error('Failed to parse the response:', error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<string> {
  const { data, error } = await useAuthFetch('/users/password')
    .put({ token, newPassword })
    .json<ApiResponse>()

  if (error.value) {
    throw new ServiceError(
      (error.value as ApiError)?.message,
      (error.value as ApiError)?.fieldErrors,
    )
  }

  try {
    const apiMessageResponse = ApiMessageResponseSchema.parse(data.value?.data)
    return apiMessageResponse.message
  } catch (error) {
    console.error('Failed to parse the response:', error)
    throw new ServiceError(t('errors.somethingWentWrong'))
  }
}

export async function refreshAccessToken() {
  try {
    await refreshToken()
  } catch (error) {
    console.error('Failed to refresh access token:', error)
  }
}
