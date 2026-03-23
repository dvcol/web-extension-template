import { createHashRouter, redirect } from 'react-router';

import { PageLoading } from '~/components/common/loading/PageLoading';
import { Route, routes } from '~/router/routes';

export interface RouterOptions {
  baseName?: string;
  baseUrl?: string;
}

export function createRouter({ baseName = '' }: RouterOptions = {}) {
  return createHashRouter([
    {
      path: Route.Home,
      HydrateFallback: PageLoading,
      lazy: async () => {
        const { AppComponent } = await import('~/components/AppComponent');
        return { Component: AppComponent };
      },
      children: [
        {
          index: true,
          loader: () => redirect(`${baseName}${Route.Hello}`),
          Component: PageLoading,
        },
        ...routes.map(r => ({ ...r, path: `${baseName}${r.path}` })),
      ],
    },
  ]);
}
