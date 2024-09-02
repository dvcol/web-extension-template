import { type RouteDefinition, type WrappedComponent } from 'svelte-spa-router';

import wrap from 'svelte-spa-router/wrap';

export const Route = {
  Hello: 'hello',
  Goodbye: 'goodbye',
} as const;

export const Routes: Record<
  string,
  {
    name: string;
    path: string;
    component: WrappedComponent;
  }
> = {
  Hello: {
    name: Route.Hello,
    path: `/${Route.Hello}`,
    component: wrap({
      asyncComponent: () => import('~/components/hello/HelloComponent.svelte'),
    }),
  },
  Goodbye: {
    name: Route.Goodbye,
    path: `/${Route.Goodbye}`,
    component: wrap({
      asyncComponent: () => import('~/components/goodbye/GoodbyeComponent.svelte'),
    }),
  },
} as const;

export const routeMap = Object.values(Routes).map(route => ({ name: route.name, path: route.path }));

export const routeDefinition: RouteDefinition = {
  // Home
  '/': Routes.Hello.component,

  // Routes
  [Routes.Hello.path]: Routes.Hello.component,
  [Routes.Goodbye.path]: Routes.Goodbye.component,

  // Catch-all
  '*': Routes.Hello.component,
};
