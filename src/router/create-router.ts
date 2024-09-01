import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';

import type { Router } from 'vue-router';

import { routes } from '~/router/routes';

export type RouterOptions = { baseName?: string; baseUrl?: string };
export const createRouter = ({ baseName = '', baseUrl = import.meta.env.BASE_URL }: RouterOptions): Router => {
  return createVueRouter({
    history: createWebHashHistory(baseUrl),
    routes: routes.map(r => ({ ...r, path: `${baseName}${r.path}` })),
  });
};
