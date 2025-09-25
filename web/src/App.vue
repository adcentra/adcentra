<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import { useThemeStore } from './stores/themeStore';

const themeStore = useThemeStore();
themeStore.initTheme();

</script>

<template>
  <Toaster
    closeButton
    :theme="themeStore.darkMode ? 'dark' : 'light'" />
  <RouterView />
</template>

<style scoped></style>
