import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

export { store };

export function setupStore(app: App<Element>) {
  app.use(store);
}
