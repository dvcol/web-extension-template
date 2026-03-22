import { lazy } from 'react';

export enum Route {
  Home = '/',
  Hello = '/hello',
  Goodbye = '/goodbye',
}

export const routes = [
  {
    path: Route.Hello,
    Component: lazy(async () => import('~/components/views/hello/HelloComponent').then(m => ({ default: m.HelloComponent }))),
  },
  {
    path: Route.Goodbye,
    Component: lazy(async () => import('~/components/views/goodbye/GoodbyeComponent').then(m => ({ default: m.GoodbyeComponent }))),
  },
];
