// Polyfills for drag and drop on mobile
import './helpers/vendor/drag-and-drop-touch';

// vue
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import mainController from './app-controller';

mainController.preinit();

const app = createApp(App);
app.use(router);
app.mount('#app');
