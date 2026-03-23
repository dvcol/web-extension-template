import type { DefineOption } from '~/web/define-component';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { Logger } from '~/services/logger.service';

const contextKey = Symbol.for(`${import.meta.env.PKG_NAME}`);

declare global {
  interface Window {
    [contextKey]: Record<symbol, HTMLElement>;
  }
}

window[contextKey] ??= {};

export function createElementInstance(options: DefineOption, name: string) {
  return class AppWc extends HTMLElement {
    readonly key = Symbol.for(name);
    async connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const children = Array.from(this.children);
      window[contextKey][this.key] = this;

      try {
        const { ContainerComponent } = await import('~/components/container/ContainerComponent');
        createRoot(shadowRoot).render(createElement(ContainerComponent, options));
        children?.forEach(child => child.remove());
      } catch (error) {
        Logger.error(`Failed to mount '${name}'`, error);
        throw error;
      }
    };

    disconnectedCallback() {
      delete window[contextKey][this.key];
    }
  };
}
