import App from '~/components/App.svelte';

export const createApp = (targetOrId: HTMLElement | string = document.body) => {
  const target = typeof targetOrId === 'string' ? document.getElementById(targetOrId) : targetOrId;

  if (!target) throw new Error(`Target was not found.`);

  const frag = document.createDocumentFragment();
  const component = new App({ target: frag });

  target.innerHTML = '';
  target.appendChild(frag);

  return component;
};

export default createApp;
