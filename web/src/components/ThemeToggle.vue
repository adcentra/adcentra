<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore';
import { Sun, Moon } from 'lucide-vue-next';

const themeStore = useThemeStore();
</script>

<template>
  <button @click="themeStore.toggleDarkMode" class="bg-container-btn">
    <Sun class="h-5 w-5 md:h-6 md:w-6" v-if="themeStore.darkMode" />
    <Moon class="h-5 w-5 md:h-6 md:w-6" v-else />
  </button>
</template>
