import App from '~/components/App.svelte';

export type CreateOptions = { baseUrl?: string; view?: { option?: boolean; popup?: boolean; web?: boolean } };
export const createWc = (options: CreateOptions) => {
  class AppWc extends HTMLElement {
    async connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      return new App({ target: shadowRoot, props: options });
    }
  }
  return AppWc;
};
