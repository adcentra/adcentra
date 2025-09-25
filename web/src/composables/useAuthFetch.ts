import { createFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse, ApiError } from '@/schema/api'
import camelKeys from '@/utils/camelKeys'
import router from '@/router'
import { RefreshTokenResponseSchema } from '@/schema/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/v1'

// Custom 'useFetch' composable instance with authentication
export const useAuthFetch = createFetch({
  baseUrl: API_BASE_URL,
  options: {
    async beforeFetch({ options, cancel }) {
      const authStore = useAuthStore()

      // Add Authorization header if the auth token is valid
      if (authStore.isTokenValid) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        }
        return { options }
      }

      // If token is expired, try to refresh it
      if (authStore.isAuthenticated && authStore.isTokenExpired) {
        try {
          await refreshToken()
          
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
          return { options }
        } catch {
          // If refresh fails, clear auth and cancel the request
          authStore.clearAuth()
          cancel()
          return { options }
        }
      }

      // For non-authenticated requests, just add content-type
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      }

      return { options }
    },
    
    afterFetch(ctx) {
      let data;
      if (ctx.data) {
        data = camelKeys(ctx.data)
      }

      const response: ApiResponse = {
        data: data,
        status: ctx.response?.status
      }
      
      ctx.data = response
      return ctx
    },

    onFetchError(ctx) {
      const authStore = useAuthStore()

      if (ctx.response?.status === 401) {
        // If the token is expired, try to refresh it
        if (authStore.isAuthenticated && authStore.isTokenExpired) {
          return new Promise((resolve) => {
            refreshToken().then(() => {
              ctx.context.options.headers = {
                ...ctx.context.options.headers,
                'Authorization': `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/json'
              }
              ctx.execute().then(() => {
                resolve(ctx)
              })
            })
          })
        }

        authStore.clearAuth()
        router.push('/login')
      }

      // Check if this is a network error (no response received)
      if (!ctx.response) {
        ctx.error = {
          message: 'Network error. Please check your internet connection and try again.',
        } as ApiError
        return ctx
      }

      let fieldErrors: Record<string, string> | undefined = undefined
      if (ctx.data?.fieldErrors) {
        fieldErrors = camelKeys(ctx.data.fieldErrors) as Record<string, string>
      }

      const apiError: ApiError = {
        status: ctx.response?.status,
        message: ctx.data?.message || 'An error occurred',
        fieldErrors: fieldErrors
      }

      ctx.error = apiError
      return ctx
    }
  },
  fetchOptions: {
    mode: 'cors',
  }
})


async function refreshToken(): Promise<void> {
  const authStore = useAuthStore()
  
  try {
    // Use native fetch for the refresh call to avoid circular dependency
    const response = await fetch(`${API_BASE_URL}/tokens/refresh`, {
      method: 'POST',
      credentials: 'include', // Include HTTP-only refresh token cookie
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const rawData = await response.json()
    const data = RefreshTokenResponseSchema.parse(camelKeys(rawData))

    // Update the access token in the store
    if (data.authenticationToken) {
      authStore.setAuth(data.user, data.authenticationToken)
    } else {
      throw new Error('No token received from refresh endpoint')
    }
  } catch (error) {
    // If refresh fails, clear the auth state
    authStore.clearAuth()
    throw error
  }
}

// Export the refresh token function for manual use if needed
export { refreshToken }
