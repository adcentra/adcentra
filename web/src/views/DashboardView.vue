<script setup lang="ts">
import { onMounted } from 'vue'
import { getCurrentUser } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

onMounted(async () => {
  try {
    const user = await getCurrentUser()
    const authStore = useAuthStore()
    authStore.updateUser(user)
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <main></main>
</template>
