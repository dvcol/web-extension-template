import type { RouteRecordRaw } from 'vue-router';

export enum Route {
  Home = 'home',
  Hello = 'hello',
  Goodbye = 'goodbye',
}

export const routes: RouteRecordRaw[] = [
  {
    path: `/`,
    name: Route.Home,
    redirect: { name: 'hello' },
  },
  {
    path: `/${Route.Hello}`,
    name: Route.Hello,
    component: () => import('~/components/views/hello/HelloComponent.vue'),
  },
  {
    path: `/${Route.Goodbye}`,
    name: Route.Goodbye,
    component: () => import('~/components/views/goodbye/GoodbyeComponent.vue'),
  },
];
