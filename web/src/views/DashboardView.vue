<script setup lang="ts">
import { onMounted } from 'vue'
import { getCurrentUser } from '@/services/authService'

onMounted(async () => {
  try {
    await getCurrentUser()
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <main>
  </main>
</template>
