import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import MarketingView from '@/views/MarketingView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import SignupView from '@/views/auth/SignupView.vue'
import ActivateView from '@/views/auth/ActivateView.vue'
import MarketingLayout from '@/layouts/MarketingLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/404',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/',
      component: MarketingLayout,
      children: [
        {
          path: '',
          name: 'marketing',
          component: MarketingView,
        },
      ],
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: {
        requiresActivation: true,
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        guestOnly: true,
      },
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      meta: {
        guestOnly: true,
      },
      component: SignupView,
    },
    {
      path: '/activate',
      name: 'activate',
      meta: {
        inactiveOnly: true,
      },
      component: ActivateView,
    },
  ],
})

router.beforeEach((to) => {
  if (to.matched.length === 0) {
    return { name: 'not-found' }
  }

  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  } else if (to.meta.requiresActivation && !authStore.isActivated) {
    return { name: 'activate' }
  } else if (to.meta.inactiveOnly && authStore.isActivated) {
    return { name: 'dashboard' }
  } else {
    return true
  }
})
export default router
