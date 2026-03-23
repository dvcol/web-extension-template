import type { RouteObject } from 'react-router';

import { RouterHydrate } from '~/components/common/loading/RouteLoading';

export enum Route {
  Home = '/',
  Hello = '/hello',
  Goodbye = '/goodbye',
}

const HydrateFallback = RouterHydrate;

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
