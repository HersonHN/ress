import { createMemoryHistory, createRouter } from 'vue-router';

import AllFeedsSection from '@/components/feeds/all-feeds-section.vue';
import SingleFeedSection from '@/components/feeds/single-feed-section.vue';
// import ConfigSection from '@/components/config/config-section';

const routes = [
  {
    path: '/',
    name: 'all-feeds',
    params: { feedId: '' },
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
    // component: ConfigSection
    component: AllFeedsSection,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
