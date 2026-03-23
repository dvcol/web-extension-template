import type { DefineOption } from '~/web/define-component';

import { RouterProvider } from 'react-router';

import { RouterService } from '~/services/router.service';

import './container.global.scss';

export function ContainerComponent(options: DefineOption) {
  const router = RouterService.init(options);

  return (
    <div id="app-container-root" style={{ width: '100%', height: '100%' }}>
      <RouterProvider router={router} />
    </div>
  );
}
