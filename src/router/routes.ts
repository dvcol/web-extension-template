import { lazy } from 'react';

export enum Route {
  Home = '/',
  Hello = '/hello',
  Goodbye = '/goodbye',
}

export const routes = [
  {
    path: Route.Hello,
    Component: lazy(() => import('~/components/views/hello/HelloComponent').then(m => ({ default: m.HelloComponent }))),
  },
  {
    path: Route.Goodbye,
    Component: lazy(() => import('~/components/views/goodbye/GoodbyeComponent').then(m => ({ default: m.GoodbyeComponent }))),
  },
];
