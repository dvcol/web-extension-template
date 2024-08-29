import { type CreateOptions, createWc } from './create-wc';

export enum WebComponents {
  WebExtensionTemplate = 'wc-web-extension-template',
}

export type DefineComponent = (options?: CreateOptions, component?: WebComponents) => Promise<CustomElementConstructor>;

export const defineComponent: DefineComponent = (options = {}, component = WebComponents.WebExtensionTemplate) => {
  if (customElements.get(component)) {
    console.warn(`Custom element '${component}' is already defined.`);
  } else {
    customElements.define(component, createWc(options));
  }
  return customElements.whenDefined(component);
};

export default defineComponent;

export const baseUrl = 'about-me';
