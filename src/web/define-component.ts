export const WebComponents = {
  WebExtensionTemplate: 'wc-web-extension-template',
} as const;

export type WebComponent = (typeof WebComponents)[keyof typeof WebComponents];

export interface DefineOption {
  baseName?: string;
  baseUrl?: string;
  view?: { option?: boolean; popup?: boolean; panel?: boolean; web?: boolean };
}
export type DefineComponent = (options?: DefineOption, component?: WebComponent) => Promise<CustomElementConstructor>;

export async function defineComponent(options: DefineOption = {}, component: WebComponent = WebComponents.WebExtensionTemplate) {
  if (customElements.get(component)) {
    console.warn(`Custom element '${component}' is already defined.`);
  } else {
    const [{ createElementInstance }, { initServices }] = await Promise.all([
      import('~/web/create-wc'),
      import('~/web/init-services'),
    ]);
    initServices(options.view).catch(console.error);
    const WebComponent = createElementInstance(options, component);
    customElements.define(component, WebComponent);
  }
  return customElements.whenDefined(component);
}

export default defineComponent;
