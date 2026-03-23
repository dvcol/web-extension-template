import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { PageLoading } from '~/components/common/loading/PageLoading';

export enum Route {
  Home = '/',
  Hello = '/hello',
  Goodbye = '/goodbye',
}

export const routes: RouteObject[] = [
  {
    path: Route.Hello,
    Component: lazy(async () => import('~/components/views/hello/HelloComponent').then(m => ({ default: m.HelloComponent }))),
  },
  {
    path: Route.Goodbye,
    Component: lazy(async () => import('~/components/views/goodbye/GoodbyeComponent').then(m => ({ default: m.GoodbyeComponent }))),
  },
].map(route => ({ ...route, HydrateFallback: PageLoading }));
