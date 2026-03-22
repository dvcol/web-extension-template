import { createHashRouter, redirect } from 'react-router-dom';

import { Route, routes } from '~/router/routes';

export interface RouterOptions {
  baseName?: string;
  baseUrl?: string;
}

export function createRouter({ baseName = '' }: RouterOptions = {}) {
  return createHashRouter([
    {
      path: '/',
      lazy: async () => {
        const { AppComponent } = await import('~/components/AppComponent');
        return { Component: AppComponent };
      },
      children: [
        {
          index: true,
          loader: () => redirect(`${baseName}${Route.Hello}`),
        },
        ...routes.map(r => ({ ...r, path: `${baseName}${r.path}` })),
      ],
    },
  ]);
}
