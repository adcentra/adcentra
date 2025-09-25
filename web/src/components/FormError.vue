<script setup lang="ts">
const props = defineProps<{
  errorMessage: string | null
}>()
</script>

<template>
  <div v-if="props.errorMessage"
    class="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
    {{ props.errorMessage }}
  </div>
</template>