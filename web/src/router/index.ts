import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import MarketingView from '@/views/MarketingView.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import MarketingLayout from '@/layouts/MarketingLayout.vue';
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
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

router.beforeEach((to) => {
  if (to.matched.length === 0) {
    return { name: 'not-found' };
  }
});
export default router;
