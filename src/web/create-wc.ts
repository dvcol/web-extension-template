import type { DefineOption } from '~/web/define-component';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { Logger } from '~/services/logger.service';

export function createElementInstance(options: DefineOption, name: string) {
  return class AppWc extends HTMLElement {
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      const children = Array.from(this.children);

      // Inject global styles into the shadow root via adoptedStyleSheets
      import('~/components/container/container.global.scss?inline')
        .then(({ default: css }) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(css);
          shadowRoot.adoptedStyleSheets = [sheet];
        })
        .catch(err => Logger.error(`Failed to inject styles into '${name}'`, err));

      import('~/components/container/ContainerComponent')
        .then(({ ContainerComponent }) => {
          createRoot(shadowRoot).render(createElement(ContainerComponent, options));
          children?.forEach(child => child.remove());
        })
        .catch(err => Logger.error(`Failed to mount '${name}'`, err));
    }
  };
}
