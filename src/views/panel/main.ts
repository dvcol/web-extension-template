import { Logger } from '~/services/logger.service';
import defineComponent from '~/web/define-component';

defineComponent({ baseUrl: import.meta.env.VITE_BASE, view: { panel: true, web: import.meta.env.VITE_WEB ?? false } })
  .then(() => Logger.info('Web Component defined'))
  .catch(err => Logger.error('Failed to define component', err));
