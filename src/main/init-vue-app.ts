import { createPinia } from 'pinia';

import type { App, Component } from 'vue';
import { createApp, getCurrentInstance } from 'vue';

import { createRouter } from '~/router';
import { initServices } from '~/main/init-services';

export const initVueApp = (component: Component) => {
  const app = createApp(component);

  // check if an instance already exist, if not, create one
  let pinia = getCurrentInstance()?.appContext?.config?.globalProperties?.$pinia;
  if (!pinia) pinia = createPinia();
  app.use(pinia);

  let router = getCurrentInstance()?.appContext?.config?.globalProperties?.$router;
  if (!router) router = createRouter();
  app.use(router);

  initServices().then(() => console.info('Services initialized.'));

  return app;
};

export const mountVueApp = (id = '#app', component: Component): App => {
  const app = initVueApp(component);

  app.mount(id);

  return app;
};
