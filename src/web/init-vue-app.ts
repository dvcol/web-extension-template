import type { App, Component } from 'vue';

import type { RouterOptions } from '~/router';

import { createPinia } from 'pinia';
import { createApp, getCurrentInstance } from 'vue';

import { Logger } from '~/services/logger.service';
import { RouterService } from '~/services/router.service';
import { initServices } from '~/web/init-services';

export type InitVueAppOption = RouterOptions & { view?: { option?: boolean; popup?: boolean; panel?: boolean; web?: boolean } };
export function initVueApp(component: Component, options: InitVueAppOption = {}) {
  const app = createApp(component);

  // check if an instance already exist, if not, create one
  let pinia = getCurrentInstance()?.appContext?.config?.globalProperties?.$pinia;
  if (!pinia) pinia = createPinia();
  app.use(pinia);

  let router = getCurrentInstance()?.appContext?.config?.globalProperties?.$router;
  if (!router) router = RouterService.init(options);
  app.use(router);

  initServices(options.view).catch(error => Logger.error('Failed to initialized services.', error));

  return app;
}

export function mountVueApp(id = '#app', component: Component, options?: InitVueAppOption): App {
  const app = initVueApp(component, options);

  app.mount(id);

  return app;
}
