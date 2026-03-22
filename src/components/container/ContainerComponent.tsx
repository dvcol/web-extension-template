import type { DefineOption } from '~/web/define-component';

import { RouterProvider } from 'react-router-dom';

import { RouterService } from '~/services/router.service';

export function ContainerComponent(options: DefineOption) {
  const router = RouterService.init(options);

  return (
    <div id="app-container-root">
      <RouterProvider router={router} />
    </div>
  );
}
