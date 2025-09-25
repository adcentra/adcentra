<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';
import lightLogoImage from '@/assets/images/logo/light-logo.png'
</script>

<template>
  <nav class="bg-surface flex items-center justify-between px-4 md:px-6 py-2 border-border border-b">
    <RouterLink to="/" class="text-lg md:text-xl font-semibold flex items-center gap-1 md:gap-2">
      <img :src="lightLogoImage" alt="adCentra" class="h-6 w-6 md:h-8 md:w-8" />
      AdCentra
    </RouterLink>

    <div class="flex items-center gap-4">
      <ThemeToggle />
      <slot name="right-content"></slot>
    </div>
  </nav>
</template>
