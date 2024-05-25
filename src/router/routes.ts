import type { RouteRecordRaw } from 'vue-router';


export const routes: RouteRecordRaw[] = [
  {
    path: `/`,
    name: 'home',
    redirect: { name: 'hello' },
  },
  {
    path: `/hello`,
    name: 'hello',
    component: () => import('../components/views/hello/HelloComponent.vue'),
  },
  {
    path: `/goodbye`,
    name: 'goodbye',
    component: () => import('../components/views/goodbye/GoodbyeComponent.vue'),
  }
];
