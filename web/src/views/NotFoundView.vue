<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex h-svh flex-col px-6 sm:h-screen sm:px-12">
    <main class="h-full">
      <div class="flex h-full flex-col items-center justify-center gap-16">
        <div class="flex flex-col items-center justify-center gap-4">
          <h1 class="text-center text-3xl font-bold sm:text-6xl">{{ t('ui.youMustBeLost') }}</h1>
        </div>
        <RouterLink to="/" class="anchor mb-12 text-lg">{{ t('ui.goBackHome') }}</RouterLink>
      </div>
    </main>
  </div>
</template>
