import type { Locale, Locales } from '~/models/i18n.model';
import type { BrowserI18nInput } from '~/utils/browser/browser-i18n.utils';

const storeLang = 'en';
const storeLocales: Locales = {};
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export const I18nStore = {
  get lang(): string {
    return storeLang;
  },

  get locales(): Locales {
    return storeLocales;
  },

  get locale(): Locale | undefined {
    return storeLocales[storeLang];
  },

  addLocale(_locale: Locale, _lang = storeLang, merge = false): Locales {
    storeLocales[_lang] = merge ? { ...storeLocales[_lang], ..._locale } : _locale;
    notify();
    return storeLocales;
  },

  i18n(value: string | BrowserI18nInput, ...modules: string[]): string {
    const path: string = Array.isArray(modules) ? modules.join('__') : modules;

    let key: string;
    let substitution: string[] = [];
    if (typeof value === 'string') {
      key = path ? `${path}__${value}` : value;
    } else {
      key = path ? `${path}__${value.key}` : value.key;
      substitution = value?.substitutions;
    }

    let result: string = I18nStore.locale?.[key]?.message || key;

    if (substitution?.length) {
      for (let i = 0; i < substitution.length; i += 1) {
        result = result?.replace(`$${i + 1}`, substitution[i]);
      }
    }

    return result;
  },

  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
