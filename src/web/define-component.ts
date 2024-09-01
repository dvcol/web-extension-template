import { Logger } from '~/services/logger.service';

export enum WebComponents {
  WebExtensionTemplate = 'wc-web-extension-template',
}

export type DefineOption = { baseName?: string; baseUrl?: string; view?: { option?: boolean; popup?: boolean; web?: boolean } };
export type DefineComponent = (options?: DefineOption, component?: WebComponents) => Promise<CustomElementConstructor>;

export const defineComponent = async (options: DefineOption = {}, component: WebComponents = WebComponents.WebExtensionTemplate) => {
  if (customElements.get(component)) {
    Logger.warn(`Custom element '${component}' is already defined.`);
  } else {
    const [{ createElementInstance }, { lazyComponent }] = await Promise.all([import('~/web/create-wc'), import('~/utils/lazy.utils')]);
    const ContainerComponent = lazyComponent(() => import('~/components/container/ContainerComponent.ce.vue'));
    const WebComponent = createElementInstance(ContainerComponent, { name: component, ...options });
    customElements.define(component, WebComponent);
  }
  return customElements.whenDefined(component);
};

export default defineComponent;
