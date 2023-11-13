import { createSSRApp } from 'vue';
import App from './App.vue';
import { setupHttp } from './http';
import { setupStore } from './stores';

export function createApp() {
  const app = createSSRApp(App);

  setupHttp();

  setupStore(app);

  return {
    app,
  };
}
