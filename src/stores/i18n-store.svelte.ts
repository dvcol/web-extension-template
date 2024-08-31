import { derived, get, writable } from 'svelte/store';

import type { Locale, Locales } from '~/models/i18n.model';
import type { BrowserI18nInput } from '~/utils/browser/browser-i18n.utils';

export class I18nStore {
  private static _lang = writable<string>('en');
  private static _locales = writable<Locales>({});
  private static _locale = derived([this._locales, this._lang], ([$locales, $lang]) => $locales[$lang]);
  private static _ready = writable<boolean>(false);

  static async init() {
    if (import.meta.hot) {
      console.debug('Listening to i18n HMR changes');
      import.meta.hot.send('fetch:i18n');
      import.meta.hot.on('update:i18n', (data: { lang: string; locale: Locale }[]) => {
        data?.forEach(({ lang, locale }) => I18nStore.addLocale(locale, lang, true));
      });
    } else if (!I18nStore.locale) {
      try {
        const response = await fetch(new URL('./_locales/en/messages.json', new URL(import.meta.url).origin));
        const locale = await response.json();
        I18nStore.addLocale(locale, 'en');
        this._ready.set(true);
      } catch (err) {
        console.error('Failed to fetch locale', err);
      }
    }
    return this.ready;
  }

  static get ready() {
    return get(this._ready);
  }

  static get lang() {
    return get(this._lang);
  }

  static get locales() {
    return get(this._locales);
  }

  static get locale() {
    return get(this._locale);
  }

  static i18n = (value: string | BrowserI18nInput, ...modules: string[]) => {
    const path: string = Array.isArray(modules) ? modules.join('__') : modules;

    let key: string;
    let substitution: string[] = [];
    if (typeof value === 'string') {
      key = path ? `${path}__${value}` : value;
    } else {
      key = path ? `${path}__${value.key}` : value.key;
      substitution = value?.substitutions;
    }

    return derived(this._locale, $locale => {
      let result: string = $locale?.[key]?.message || key;

      if (substitution?.length) {
        for (let i = 0; i < substitution.length; i += 1) {
          result = result?.replace(`$${i + 1}`, substitution[i]);
        }
      }
      return result;
    });
  };

  static addLocale = (_locale: Locale, _lang = this.lang, merge = false) => {
    this._locales.set({
      ...this.locales,
      [_lang]: merge ? { ...this.locales[_lang], ..._locale } : _locale,
    });
    return this.locales;
  };
}
