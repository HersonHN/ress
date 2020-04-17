import Vue from 'vue';
import Router from 'vue-router';
import AllFeedsSection from '@/components/feeds/all-feeds-section';
import SingleFeedSection from '@/components/feeds/single-feed-section';
import ConfigSection from '@/components/config/config-section';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'all-feeds',
      component: AllFeedsSection
    },
    {
      path: '/feed/:feedId',
      name: 'single-feed',
      component: SingleFeedSection
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigSection
    }
  ]
});
