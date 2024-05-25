import { initLocalI18n } from '~/utils/i18n.utils';

export const initServices = async () => {
  await initLocalI18n().promise
};
