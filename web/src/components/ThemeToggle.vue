<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore';
import { Sun, Moon } from 'lucide-vue-next';

const themeStore = useThemeStore();
</script>

<template>
  <button @click="themeStore.toggleDarkMode"
    class="bg-container-btn cursor-pointer hover:bg-muted p-2 md:p-3 rounded-full hover:scale-105 active:scale-[98%] transition-all duration-100">
    <Sun class="h-5 w-5 md:h-6 md:w-6" v-if="themeStore.darkMode" />
    <Moon class="h-5 w-5 md:h-6 md:w-6" v-else />
  </button>
</template>
