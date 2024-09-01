import { I18nStore } from '~/stores/i18n-store.svelte';
import { useI18nTranslate } from '~/utils/browser/browser-i18n.utils';
import { chromeI18n } from '~/utils/browser/browser.utils';

/**
 * Setup i18n function to either use chrome i18n resolver or a local store (for web use).
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export const useI18n = (...roots: string[]): ReturnType<typeof useI18nTranslate> => {
  if (!chromeI18n) {
    I18nStore.init().catch(err => console.error('Failed to initialize i18n store', err));
    return (value, ...modules) => I18nStore.i18n(value, ...(modules?.length ? modules : roots));
  }

  return useI18nTranslate(...roots);
};

export const waitI18nReady = async (): Promise<boolean> => {
  if (!chromeI18n) return I18nStore.init();
  return Promise.resolve(true);
};
