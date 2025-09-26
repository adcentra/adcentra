import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore(
  'themeStore',
  () => {
    // State
    const darkMode = ref<boolean | null>(null)

    // Actions
    function initTheme() {
      if (darkMode.value === null) {
        darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        setDarkMode()
      } else {
        setDarkMode()
      }
    }

    function toggleDarkMode() {
      darkMode.value = !darkMode.value
      setDarkMode()
    }

    function setDarkMode() {
      const body = document.body
      if (darkMode.value) {
        body.classList.add('dark')
      } else {
        body.classList.remove('dark')
      }
    }

    return {
      darkMode,
      initTheme,
      toggleDarkMode,
    }
  },
  {
    persist: {
      pick: ['darkMode'],
    },
  },
)
