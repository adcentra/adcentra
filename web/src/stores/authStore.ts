import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthToken } from '@/schema/auth'
import dayjs, { type Dayjs } from 'dayjs'
import type { User } from '@/schema/user'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    // Stored in memory only and not persisted to localStorage for security
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)
    const tokenExpiresAt = ref<Dayjs | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!user.value && !!accessToken.value)

    const isTokenExpired = computed(() => {
      if (!tokenExpiresAt.value || !tokenExpiresAt.value.isValid()) return false
      // Add 10 seconds to the current time to account for clock skew
      return tokenExpiresAt.value.isBefore(dayjs().add(10, 'seconds'))
    })

    const isTokenValid = computed(() => {
      return isAuthenticated.value && !isTokenExpired.value
    })

    // Actions
    function setAuth(userData: User, authToken: AuthToken) {
      user.value = userData
      accessToken.value = authToken.token
      tokenExpiresAt.value = authToken.expiry // Already transformed to Dayjs
    }

    function setAccessToken(authToken: AuthToken) {
      accessToken.value = authToken.token
      tokenExpiresAt.value = authToken.expiry // Already transformed to Dayjs
    }

    function clearAuth() {
      user.value = null
      accessToken.value = null
      tokenExpiresAt.value = null
    }

    function updateUser(userData: Partial<User>) {
      if (user.value) {
        user.value = { ...user.value, ...userData }
      }
    }

    return {
      // State
      user,
      accessToken,
      tokenExpiresAt,

      // Getters
      isAuthenticated,
      isTokenExpired,
      isTokenValid,

      // Actions
      setAuth,
      setAccessToken,
      clearAuth,
      updateUser,
    }
  },
  {
    persist: {
      pick: ['user', 'accessToken', 'tokenExpiresAt'],
      afterHydrate: (context) => {
        if (context.store.tokenExpiresAt && typeof context.store.tokenExpiresAt == 'string') {
          context.store.tokenExpiresAt = dayjs(context.store.tokenExpiresAt)
        }
        if (context.store.user.lastLoginAt && typeof context.store.user.lastLoginAt == 'string') {
          context.store.user.lastLoginAt = dayjs(context.store.user.lastLoginAt)
        }
      },
      storage: sessionStorage,
    },
  },
)
