// @ts-expect-error chrome issue
import type { chrome } from 'chrome';

import type { DefineComponent, WebComponents } from '~/web';

export const baseUrl = 'web-extension-template';

type WebExtensionTemplate = {
  WebComponents: WebComponents;
  defineComponent: DefineComponent;
  default: DefineComponent;
};

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

export type { WebExtensionTemplate, DefineComponent, WebComponents };
