<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
import { computed } from 'vue';
import { generateProfileIcon } from '@/utils';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { Button } from '@/components/ui/button';

const authStore = useAuthStore();

const { user, isAuthenticated } = storeToRefs(authStore);

const profileIcon = computed(() => {
  return (
    user?.value?.profileImageUrl ||
    generateProfileIcon(user?.value?.fullName || 'U', 32, '#e8f1fc', '#0c141f')
  );
});

const displayName = computed(() => {
  if (!user?.value?.fullName) {
    return 'User';
  }
  return user.value.fullName.charAt(0).toUpperCase() + user.value.fullName.slice(1);
});
</script>

<template>
  <div class="flex h-screen flex-col">
    <header>
      <AppNavbar>
        <template #right-content>
          <Button v-if="isAuthenticated" variant="ghost" class="rounded-full cursor-pointer px-0 py-6 group">
            <img :src="profileIcon" alt="User profile"
              class="h-6 w-6 rounded-full object-cover ring-2 ring-primary/70 group-hover:scale-105 group-active:scale-95 transition-all duration-100 sm:h-10 sm:w-10" />
            <span class="hidden md:block md:ml-2 text-[16px] font-medium">
              {{ displayName }}
            </span>
          </Button>
        </template>
      </AppNavbar>
    </header>
    <main class="flex-grow">
      <RouterView />
    </main>
  </div>
</template>
