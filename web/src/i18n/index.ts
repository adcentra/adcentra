import { useStorage } from '@vueuse/core'
import en from './en'
import es from './es'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: useStorage('lang', 'en').value,
  fallbackLocale: 'en',
  messages: {
    en: en,
    es: es,
  },
})

export default i18n
