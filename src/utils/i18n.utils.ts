import { get } from 'svelte/store';

import type { Locale, Locales } from '~/models/i18n.model';

import { I18nStore } from '~/stores/i18n-store.svelte';
import { useI18nTranslate } from '~/utils/browser/browser-i18n.utils';
import { chromeI18n } from '~/utils/browser/browser.utils';

export const initLocalI18n = () => {
  let promise: Promise<Locales | void> | undefined;
  if (import.meta.hot) {
    console.debug('Listening to i18n HMR changes');
    import.meta.hot.send('fetch:i18n');
    import.meta.hot.on('update:i18n', (data: { lang: string; locale: Locale }[]) => {
      data?.forEach(({ lang, locale }) => I18nStore.addLocale(locale, lang, true));
    });
  } else if (!I18nStore.locale) {
    promise = fetch(new URL(`./_locales/${I18nStore.lang}/messages.json`, new URL(import.meta.url).origin))
      .then(r => r.json())
      .then((locale: Locale) => I18nStore.addLocale(locale))
      .catch(err => console.error(`Failed to fetch locale '${I18nStore.lang}'`, err));
  }

  return { store: I18nStore, promise };
};

/**
 * Setup i18n function to either use chrome i18n resolver or a local store (for web use).
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export const useI18n = (...roots: string[]): ReturnType<typeof useI18nTranslate> => {
  if (!chromeI18n) {
    const { store } = initLocalI18n();
    return (value, ...modules) => get(store.i18n(value, ...(modules?.length ? modules : roots)));
  }

  return useI18nTranslate(...roots);
};
