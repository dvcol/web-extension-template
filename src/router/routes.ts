import wrap from 'svelte-spa-router/wrap';

import type { RouteDefinition, WrappedComponent } from 'svelte-spa-router';

export const Route: Record<
  string,
  {
    name: string;
    path: string;
    component: WrappedComponent;
  }
> = {
  Hello: {
    name: 'hello',
    path: '/hello',
    component: wrap({
      asyncComponent: () => import('~/components/hello/HelloComponent.svelte'),
    }),
  },
  Goodbye: {
    name: 'goodbye',
    path: '/goodbye',
    component: wrap({
      asyncComponent: () => import('~/components/goodbye/GoodbyeComponent.svelte'),
    }),
  },
} as const;

export const routeMap = Object.values(Route).map(route => ({ name: route.name, path: route.path }));

export const routeDefinition: RouteDefinition = {
  // Home
  '/': Route.Hello.component,

  // Routes
  [Route.Hello.path]: Route.Hello.component,
  [Route.Goodbye.path]: Route.Goodbye.component,

  // Catch-all
  '*': Route.Hello.component,
};
