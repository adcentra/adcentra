import { createFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse, ApiError } from '@/schema/api'
import camelKeys from '@/utils/camelKeys'
import snakeKeys from '@/utils/snakeKeys'
import router from '@/router'
import { RefreshTokenResponseSchema } from '@/schema/auth'
import { toast } from 'vue-sonner'
import i18n from '@/i18n'
import dayjs from 'dayjs'

const { t } = i18n.global

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/v1'

// Custom 'useFetch' composable instance with authentication
export const useAuthFetch = createFetch({
  baseUrl: API_BASE_URL,
  options: {
    async beforeFetch({ options, cancel }) {
      const authStore = useAuthStore()

      // Convert request body to snake_case if it exists
      if (options.body && typeof options.body === 'string') {
        options.body = JSON.stringify(snakeKeys(JSON.parse(options.body)))
      }

      // Add Authorization header if the auth token is valid
      // Not using the computed properties(like isTokenExpired) of authStore because they are
      // evaluated only once when the hook is initialized.
      if (
        !!authStore.accessToken &&
        !!authStore.tokenExpiresAt &&
        authStore.tokenExpiresAt.isAfter(dayjs().add(10, 'seconds'))
      ) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        }
        return { options }
      }

      // If token is expired, try to refresh it
      if (
        !!authStore.accessToken &&
        !!authStore.tokenExpiresAt &&
        authStore.tokenExpiresAt.isBefore(dayjs().add(10, 'seconds'))
      ) {
        try {
          await refreshToken()

          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json',
          }
          return { options }
        } catch {
          // If refresh fails, clear auth and cancel the request
          toast.error(t('errors.failedToRefreshToken'))
          authStore.clearAuth()
          router.push('/login')
          cancel()
          return { options }
        }
      }

      // For non-authenticated requests, just add content-type
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      }

      return { options }
    },

    afterFetch(ctx) {
      let data
      if (ctx.data) {
        data = camelKeys(ctx.data)
      }

      const response: ApiResponse = {
        data: data,
        status: ctx.response?.status,
      }

      ctx.data = response
      return ctx
    },

    onFetchError(ctx) {
      // Check if this is a network error (no response received)
      if (!ctx.response) {
        ctx.error = {
          message: t('errors.networkError'),
        } as ApiError
        return ctx
      }

      if (ctx.response?.status === 401) {
        const authStore = useAuthStore()
        // If the token is expired, try to refresh it
        // Not using the computed properties(like isTokenExpired) of authStore because they are
        // evaluated only once when the hook is initialized.
        if (
          !!authStore.accessToken &&
          !!authStore.tokenExpiresAt &&
          authStore.tokenExpiresAt.isBefore(dayjs().add(10, 'seconds'))
        ) {
          return new Promise((resolve) => {
            refreshToken().then(() => {
              ctx.context.options.headers = {
                ...ctx.context.options.headers,
                Authorization: `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/json',
              }
              ctx.execute().then(() => {
                resolve(ctx)
              })
            })
          })
        }

        toast.error(t('errors.unauthorizedAccess'))
        authStore.clearAuth()
        router.push('/login')
      }

      if (!ctx.data) {
        ctx.error = {
          message: t('errors.somethingWentWrong'),
        } as ApiError
        return ctx
      }

      // Error returned from the server
      const data = camelKeys(ctx.data) as { message?: string; fieldErrors?: Record<string, string> }

      const apiError: ApiError = {
        status: ctx.response?.status,
        message: data?.message || t('errors.somethingWentWrong'),
        fieldErrors: data?.fieldErrors,
      }

      ctx.error = apiError
      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
    credentials: 'include',
  },
})

async function refreshToken(): Promise<void> {
  const authStore = useAuthStore()

  try {
    // Use native fetch for the refresh call to avoid circular dependency
    const response = await fetch(`${API_BASE_URL}/tokens/refresh`, {
      method: 'POST',
      credentials: 'include', // Include HTTP-only refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(t('errors.failedToRefreshToken'))
    }

    const rawData = await response.json()
    const data = RefreshTokenResponseSchema.parse(camelKeys(rawData))

    // Update the access token in the store
    if (data.authenticationToken) {
      authStore.setAuth(data.user, data.authenticationToken)
    } else {
      throw new Error(t('errors.failedToRefreshToken'))
    }
  } catch (error) {
    // If refresh fails, clear the auth state
    authStore.clearAuth()
    throw error
  }
}

// Export the refresh token function for manual use if needed
export { refreshToken }
