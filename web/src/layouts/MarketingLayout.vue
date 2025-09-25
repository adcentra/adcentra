<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion } from 'motion-v'
import { Menu, X } from 'lucide-vue-next'
import lightLogoImage from '@/assets/images/logo/light-logo.png'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
  const isScrolled = window.scrollY > 50
  scrolled.value = isScrolled
}

const handleResize = () => {
  // Close mobile menu on window resize
  if (window.innerWidth >= 1024) {
    mobileMenuOpen.value = false
  }
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  mobileMenuOpen.value = false // Close mobile menu after navigation
}

const navItems = [
  { name: 'Home', id: 'hero' },
  { name: 'Solutions', id: 'solutions' },
  { name: 'Features', id: 'features' },
  { name: 'How It Works', id: 'how-it-works' },
  { name: 'Why Us', id: 'why-adcentra' },
]

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="bg-[#09080b] min-h-screen">
    <!-- Navbar -->
    <motion.nav :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.6 }" :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 mx-4 sm:mx-8 lg:mx-20 mt-4 border-0 border-amber-100/10 rounded-full',
      scrolled
        ? 'bg-[#3f2d45]/65 border-[0.5px] backdrop-blur-md shadow-lg'
        : 'bg-transparent'
    ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo -->
          <div class="flex items-center flex-shrink-0">
            <button @click="scrollToSection('hero')" class="transition-colors">
              <span class="flex items-center gap-2 sm:gap-3">
                <img :src="lightLogoImage" alt="adCentra" class="w-6 h-6 sm:w-8 sm:h-8" />
                <span class="text-lg sm:text-xl font-bold text-[#F5F5F5] hover:text-white">AdCentra</span>
              </span>
            </button>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden lg:flex items-center gap-6 lg:gap-8">
            <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
              class="text-[#F5F5F5] hover:cursor-pointer hover:font-bold hover:text-fuchsia-200 transition-all duration-200 text-md font-semibold">
              {{ item.name }}
            </button>
          </div>

          <!-- Right side - Login, CTA Button and Mobile Menu -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Login Button -->
            <router-link to="/login">
              <button
                class="hidden sm:block text-[#F5F5F5] hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20 hover:border-white/40 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all duration-200 whitespace-nowrap">
                Login
              </button>
            </router-link>

            <!-- CTA Button -->
            <button @click="scrollToSection('cta')"
              class="bg-white text-black px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 whitespace-nowrap">
              <span class="sm:inline">Get Started →</span>
            </button>

            <!-- Mobile Menu Button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
              class="lg:hidden p-2 text-[#F5F5F5] hover:text-white transition-colors mobile-menu-container"
              aria-label="Toggle mobile menu">
              <X v-if="mobileMenuOpen" class="w-5 h-5" />
              <Menu v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>

    <!-- Mobile Menu Overlay -->
    <motion.div v-if="mobileMenuOpen" :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -20 }" :transition="{ duration: 0.2 }" class="fixed top-20 left-4 right-4 z-40 lg:hidden">
      <div class="bg-[#3f2d45]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl mobile-menu-container">
        <div class="py-4">
          <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
            class="block w-full px-6 py-3 text-left text-[#F5F5F5] hover:text-fuchsia-200 hover:bg-white/5 transition-all duration-200 text-lg font-semibold">
            {{ item.name }}
          </button>
          <div class="border-t border-white/10 mt-2 pt-2">
            <router-link to="/login">
              <button
                class="block w-full px-6 py-3 text-left text-[#F5F5F5] hover:text-fuchsia-200 hover:bg-white/5 transition-all duration-200 text-lg font-semibold">
                Login
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </motion.div>

    <main>
      <RouterView />
    </main>
  </div>
</template>
