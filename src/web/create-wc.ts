import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { Logger } from '~/services/logger.service';

import type { DefineOption } from '~/web/define-component';

export function createElementInstance(options: DefineOption, name: string) {
  return class AppWc extends HTMLElement {
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      // Inject global styles into the shadow root via adoptedStyleSheets
      import('~/components/container/container.global.scss?inline')
        .then(({ default: css }) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(css);
          shadowRoot.adoptedStyleSheets = [sheet];
        })
        .catch(err => Logger.error(`Failed to inject styles into '${name}'`, err));

      const mountPoint = document.createElement('div');
      mountPoint.style.cssText = 'display:contents';
      shadowRoot.appendChild(mountPoint);

      import('~/components/container/ContainerComponent')
        .then(({ ContainerComponent }) => {
          createRoot(mountPoint).render(createElement(ContainerComponent, options));
        })
        .catch(err => Logger.error(`Failed to mount '${name}'`, err));
    }
  };
}
