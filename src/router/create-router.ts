import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router';
import { routes } from '~/router/routes';

export const createRouter = () => {
  return createVueRouter({
    history: createWebHashHistory(),
    routes,
  });;
};
