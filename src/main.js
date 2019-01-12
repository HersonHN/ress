// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import mainController from './main-controller';

import DateFilter from './filters/date';

Vue.config.productionTip = false

Vue.filter('date', DateFilter);


mainController.preinit();
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
