import defineComponent from '~/web/define-component';

defineComponent({ baseUrl: import.meta.env.VITE_BASE, view: { popup: true, web: import.meta.env.VITE_WEB } })
  .then(() => console.info('Web Component defined'))
  .catch(err => console.error('Failed to define component', err));
