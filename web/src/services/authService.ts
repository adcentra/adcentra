import { useAuthFetch, refreshToken } from '@/composables/useAuthFetch'
import { useAuthStore } from '@/stores/authStore'
import { 
  LoginResponseSchema,
  RegisterResponseSchema,
  type LoginRequest,
  type LoginResponse,
} from '@/schema/auth'
import { 
  type ApiResponse,
  type ApiError,
  ApiMessageResponseSchema,
} from '@/schema/api'
import { GetCurrentUserResponseSchema, type User } from '@/schema/user'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const authStore = useAuthStore()
  
  const { data, error } = await useAuthFetch('/tokens/authentication').post(credentials).json<ApiResponse>()

  if (error.value) {
    throw new Error((error.value as ApiError)?.message || 'Login failed')
  }

  if (data.value?.data) {
    const loginResponse = LoginResponseSchema.parse(data.value.data)
    authStore.setAuth(loginResponse.user, loginResponse.authenticationToken)
    return loginResponse
  }

  throw new Error('Invalid response from login endpoint')
}

export async function logout() {
  const authStore = useAuthStore()
  
  try {
    await useAuthFetch('/tokens/authentication').delete().json()
  } catch (error) {
    console.warn('Logout API call failed:', error)
  } finally {
    // Always clear local auth state
    authStore.clearAuth()
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data, error } = await useAuthFetch('/me').get().json<ApiResponse>()

  if (error.value) {
    throw new Error((error.value as ApiError)?.message || 'Failed to get current user')
  }

  if (data.value?.data) {
    const getCurrentUserResponse = GetCurrentUserResponseSchema.parse(data.value.data)
    const authStore = useAuthStore()
    authStore.updateUser(getCurrentUserResponse.user)
    return getCurrentUserResponse.user
  }

  throw new Error('Invalid response from user endpoint')
}

export async function register(userData: {
  email: string
  password: string
  fullName?: string
}): Promise<User> {
  const { data, error } = await useAuthFetch('/users').post(userData).json<ApiResponse>()

  if (error.value) {
    throw new Error((error.value as ApiError)?.message || 'Registration failed')
  }

  if (data.value?.data) {
    const registerResponse = RegisterResponseSchema.parse(data.value.data)
    return registerResponse.user
  }

  throw new Error('Invalid response from user endpoint')
}

export async function activateAccount(token: string): Promise<string> {
  const { data, error } = await useAuthFetch('/users/activation').put({ token }).json<ApiResponse>()

  if (error.value) {
    throw new Error((error.value as ApiError)?.message || 'Account activation failed')
  }

  if (data.value?.data) {
    const apiMessageResponse = ApiMessageResponseSchema.parse(data.value.data)
    return apiMessageResponse.message
  }

  throw new Error('Invalid response from user activation endpoint')
}

export async function requestPasswordReset(email: string): Promise<string> {
  const { data, error } = await useAuthFetch('/tokens/password-reset').post({ email }).json<ApiResponse>()

  if (error.value) {
    throw new Error((error.value as ApiError)?.message || 'Password reset request failed')
  }

  if (data.value?.data) {
    const apiMessageResponse = ApiMessageResponseSchema.parse(data.value.data)
    return apiMessageResponse.message
  }

  throw new Error('Invalid response from password reset endpoint')
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const { error } = await useAuthFetch('/users/password').put({ token, newPassword }).json()

  if (error.value) {
    throw new Error((error.value as ApiError)?.message || 'Password reset failed')
  }
}

export async function refreshAccessToken() {
  try {
    await refreshToken()
    return true
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    return false
  }
}

export function isAuthenticated() {
  const authStore = useAuthStore()
  return authStore.isTokenValid
}
