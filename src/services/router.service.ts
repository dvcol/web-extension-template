import type { RouterOptions } from '~/router';

import { createRouter } from '~/router';

export class RouterService {
  private static instance: ReturnType<typeof createRouter>;
  private static base: string = './';

  static get baseUrl() {
    return this.base;
  }

  static get router(): ReturnType<typeof createRouter> {
    if (!RouterService.instance) throw new Error('Router not initialized');
    return RouterService.instance;
  }

  static init(options: RouterOptions): ReturnType<typeof createRouter> {
    if (RouterService.instance) return this.instance;
    this.base = options.baseUrl ?? this.base;
    RouterService.instance = createRouter(options);
    return RouterService.instance;
  }
}
