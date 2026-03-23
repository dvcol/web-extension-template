import type { RouteObject } from 'react-router';

import { PageLoading } from '~/components/common/loading/PageLoading';

export enum Route {
  Home = '/',
  Hello = '/hello',
  Goodbye = '/goodbye',
}

const HydrateFallback = PageLoading;

export const routes: RouteObject[] = [
  {
    path: Route.Hello,
    HydrateFallback,
    lazy: async () => {
      const { HelloComponent } = await import('~/components/views/hello/HelloComponent');
      return { Component: HelloComponent };
    },
  },
  {
    path: Route.Goodbye,
    HydrateFallback,
    lazy: async () => {
      const { GoodbyeComponent } = await import('~/components/views/goodbye/GoodbyeComponent');
      return { Component: GoodbyeComponent };
    },
  },
];
