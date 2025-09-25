<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut } from 'lucide-vue-next';
import { logout } from '@/services/authService';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  profileIcon: string;
  displayName: string;
  email?: string;
}>();

const onLogout = async () => {
  await logout();
  router.push('/login');
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button
        class="flex items-center gap-2 rounded-full cursor-pointer px-0 md:pr-4 md:py-1 group hover:bg-muted active:scale-[98%] transition-all duration-100">
        <img :src="props.profileIcon" alt="User profile"
          class="h-8 w-8 rounded-full object-cover ring-2 ring-primary/70 group-hover:scale-105 transition-all duration-100 sm:h-9 sm:w-9 md:h-10 md:w-10" />
        <div class="hidden md:flex flex-col items-start justify-around">
          <span class="text-md font-medium">
            {{ props.displayName }}
          </span>
          <span class="text-sm font-normal text-muted-foreground">
            {{ props.email }}
          </span>
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <button @click="onLogout" class="flex items-center gap-4 w-full p-0 m-0 cursor-pointer">
          <LogOut class="w-4 h-4" />
          <span>Logout</span>
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>