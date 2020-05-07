
// Polyfills for drag and drop on mobile
import './helpers/vendor/DragDropTouch';

// vue
import Vue from 'vue';
import App from './App';
import router from './router';

// "main" constroller with global properties
import mainController from './app-controller';

// custom filters
import DateFilter from './filters/date';

Vue.config.productionTip = false

Vue.filter('date', DateFilter);


mainController.preinit();
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
