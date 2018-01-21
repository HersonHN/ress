import Vue from 'vue'
import Router from 'vue-router'
import AllFeedsSection from '@/components/all-feeds-section'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'all-feeds',
      component: AllFeedsSection
    }
  ]
})
