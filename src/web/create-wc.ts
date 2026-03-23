import type { DefineOption } from '~/web/define-component';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { Logger } from '~/services/logger.service';

export function createElementInstance(options: DefineOption, name: string) {
  return class AppWc extends HTMLElement {
    async connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      const children = Array.from(this.children);

      try {
        const { ContainerComponent } = await import('~/components/container/ContainerComponent');
        createRoot(shadowRoot).render(createElement(ContainerComponent, options));
        children?.forEach(child => child.remove());
      } catch (error) {
        Logger.error(`Failed to mount '${name}'`, error);
        throw error;
      }
    };
  };
}
