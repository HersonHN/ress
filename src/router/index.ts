import { createRouter, createWebHistory } from 'vue-router';

import AllFeedsSection from '@/components/feeds/all-feeds-section.vue';
import SingleFeedSection from '@/components/feeds/single-feed-section.vue';
import ConfigSection from '@/components/config/config-section.vue';

const routes = [
  {
    path: '/',
    name: 'all-feeds',
    component: AllFeedsSection,
  },
  {
    path: '/feed/:feedId',
    name: 'single-feed',
    component: SingleFeedSection,
  },
  {
    path: '/config',
    name: 'config',
    component: ConfigSection,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
