import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import MarketingView from '@/views/MarketingView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import MarketingLayout from '@/layouts/MarketingLayout.vue';
import { useAuthStore } from '@/stores/authStore';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
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
        requiresAuth: true,
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
    }
  ],
});

router.beforeEach((to) => {
  if (to.matched.length === 0) {
    return { name: 'not-found' };
  }

  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  } else {
    return true;
  }
});
export default router;
