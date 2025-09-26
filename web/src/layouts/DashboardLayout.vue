<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import { computed } from 'vue'
import { generateProfileIcon } from '@/utils'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import ProfileDropdown from '@/components/ProfileDropdown.vue'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const profileIcon = computed(() => {
  return (
    user?.value?.profileImageUrl ||
    generateProfileIcon(user?.value?.fullName || 'U', 32, '#e8f1fc', '#0c141f')
  )
})

const displayName = computed(() => {
  if (!user?.value?.fullName) {
    return 'User'
  }
  return user.value.fullName.charAt(0).toUpperCase() + user.value.fullName.slice(1)
})
</script>

<template>
  <div class="flex h-screen flex-col">
    <header>
      <AppNavbar>
        <template #right-content>
          <ProfileDropdown
            :profileIcon="profileIcon"
            :displayName="displayName"
            :email="user?.email"
          />
        </template>
      </AppNavbar>
    </header>
    <main class="flex-grow">
      <RouterView />
    </main>
  </div>
</template>
