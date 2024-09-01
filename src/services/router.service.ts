import type { Router } from 'vue-router';
import type { RouterOptions } from '~/router';

import { createRouter } from '~/router';

export class RouterService {
  private static instance: Router;
  private static base: string = './';

  static get baseUrl() {
    return this.base;
  }

  static get router() {
    if (!RouterService.instance) throw new Error('Router not initialized');
    return RouterService.instance;
  }

  static init(options: RouterOptions) {
    if (RouterService.instance) return this.instance;
    this.base = options.baseUrl ?? this.base;
    RouterService.instance = createRouter(options);
    return RouterService.instance;
  }
}
