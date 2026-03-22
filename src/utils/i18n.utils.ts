import type { Locale, Locales } from '~/models/i18n.model';

import { Logger } from '~/services/logger.service';
import { RouterService } from '~/services/router.service';
import { I18nStore } from '~/stores/i18n.store';
import { useI18nTranslate } from '~/utils/browser/browser-i18n.utils';
import { chromeI18n } from '~/utils/browser/browser.utils';

let promise: Promise<Locales | void> | undefined;
let hotReload = false;
export function initLocalI18n(baseUrl = RouterService.baseUrl) {
  if (hotReload || promise) return { store: I18nStore, promise };
  if (import.meta.hot) {
    Logger.debug('Listening to i18n HMR changes');
    import.meta.hot.send('fetch:i18n');
    import.meta.hot.on('update:i18n', (data: { lang: string; locale: Locale }[]) => {
      data?.forEach(({ lang, locale }) => I18nStore.addLocale(locale, lang, true));
    });
    hotReload = true;
  } else if (!I18nStore.locales?.[I18nStore.lang]) {
    promise = fetch(new URL(`${baseUrl}_locales/${I18nStore.lang}/messages.json`, new URL(import.meta.url).origin))
      .then(async r => await r.json() as Promise<Locale>)
      .then((locale: Locale) => I18nStore.addLocale(locale))
      .catch(err => Logger.error(`Failed to fetch locale '${I18nStore.lang}'`, err));
  }

  return { store: I18nStore, promise };
}

/**
 * Setup i18n function to either use chrome i18n resolver or a local store (for web use).
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export function useI18n(...roots: string[]): ReturnType<typeof useI18nTranslate> {
  if (!chromeI18n) {
    initLocalI18n();
    return (value, ...modules) => I18nStore.i18n(value, ...(modules?.length ? modules : roots));
  }

  return useI18nTranslate(...roots);
}
