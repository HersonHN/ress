import Vue from 'vue'
import Router from 'vue-router'
import AllEntriesSection from '@/components/all-entries-section'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'all-entries',
      component: AllEntriesSection
    }
  ]
})
