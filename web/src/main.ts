import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import './style.css'
import 'vue-sonner/style.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { en, es } from './i18n'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

app.use(pinia);
app.use(router)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    'en': en,
    'es': es
  }
})
app.use(i18n)

app.mount('#app')
