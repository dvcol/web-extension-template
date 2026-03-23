import type { PluginOption } from 'vite';

import MagicString from 'magic-string';

export interface ShadowPreloadOptions {
  /** Package name used in `Symbol.for()` to locate the WC host. Defaults to `'@dvcol/web-extension-template'`. */
  packageName?: string;
  /** Web component tag name used in `Symbol.for()` to locate the WC instance. Defaults to `'wc-web-extension-template'`. */
  componentName?: string;
}

const PRELOAD_MARKER = '\0vite/preload-helper';
const VITE_CLIENT_REGEX = /vite\/dist\/client\/client\.mjs/;

/**
 * Generates the `getRoot` helper that resolves the shadow root of the web component,
 * falling back to `document[key]` or `document`.
 */
function buildGetRoot(packageName: string, componentName: string): string {
  return [
    '',
    'function getRoot(key) {',
    `\tconst root = window?.[Symbol.for('${packageName}')]?.[Symbol.for('${componentName}')]?.shadowRoot`,
    '\treturn root || document?.[key] || document;',
    '}',
  ].join('\n');
}

/**
 * Generates the `adoptSheet` helper that fetches CSS and adopts it
 * into the shadow root via `CSSStyleSheet` + `adoptedStyleSheets`.
 */
function buildAdoptSheet(): string {
  return [
    '',
    'async function adoptSheet(url, root) {',
    '\tconst res = await fetch(url);',
    '\tif (!res.ok) throw new Error(`Unable to preload CSS for ${dep}`);', // eslint-disable-line no-template-curly-in-string
    '\tconst css = await res.text();',
    '\tconst sheet = new CSSStyleSheet();',
    '\tsheet.replaceSync(css);',
    '\troot.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];',
    '}',
    '',
  ].join('\n');
}

/** Shadow DOM adoption guard injected before `document.createElement("link")`. */
const ADOPT_GUARD = [
  '// In Shadow DOM, we adopt the sheet if it isn\'t already instead of creating a stylesheet',
  '\t\t\tif(isCss && root instanceof ShadowRoot) {',
  '\t\t\t\treturn adoptSheet(dep, root)',
  '\t\t\t}',
  '',
  '',
  '',
].join('\n');

/**
 * Build plugin: transforms the preload-helper chunk to support Shadow DOM.
 *
 * Injects `getRoot()` / `adoptSheet()` helpers and rewrites DOM access calls
 * inside `__vitePreload` so CSS gets adopted via `adoptedStyleSheets` when the
 * application runs inside a web component's `ShadowRoot`.
 */
function shadowPreloadBuild(packageName: string, componentName: string): PluginOption {
  return {
    name: 'shadow-preload-build',
    enforce: 'post',
    apply: 'build',
    renderChunk(code, chunk) {
      if (!chunk.moduleIds?.some(id => id.includes(PRELOAD_MARKER)) && !code.includes('__vitePreload')) {
        return null;
      }

      const s = new MagicString(code);

      // 1. Inject getRoot + adoptSheet after `var seen = {};`
      s.replace('var seen = {};', `var seen = {};${buildGetRoot(packageName, componentName)}${buildAdoptSheet()}`);

      // 2. Replace document.getElementsByTagName("link") → getRoot().querySelectorAll("link")
      s.replace('document.getElementsByTagName("link")', 'getRoot().querySelectorAll("link")');

      // 3. Replace document.querySelector("meta[property=csp-nonce]") → getRoot().querySelector(...)
      s.replace(
        'document.querySelector("meta[property=csp-nonce]")',
        'getRoot().querySelector("meta[property=csp-nonce]")',
      );

      // 4. Insert `const root = getRoot();` + blank line before `if (!!importerUrl)`
      s.replace(
        'if (!!importerUrl)',
        'const root = getRoot();\n\n\t\t\tif (!!importerUrl)',
      );

      // 5. Replace `document.querySelector(...)` → `root.querySelector(...)` for link existence check
      s.replace(
        'document.querySelector(`link[href="${dep}"]${cssSelector}`)', // eslint-disable-line no-template-curly-in-string
        'root.querySelector(`link[href="${dep}"]${cssSelector}`)', // eslint-disable-line no-template-curly-in-string
      );

      // 6. Insert Shadow DOM adoption guard before `const link = document.createElement("link");`
      s.replace(
        'const link = document.createElement("link");',
        `${ADOPT_GUARD}\t\t\tconst link = document.createElement("link");`,
      );

      // 7. Replace document.head.appendChild(link) → getRoot('head').appendChild(link)
      s.replace('document.head.appendChild(link)', 'getRoot(\'head\').appendChild(link)');

      if (!s.hasChanged()) return null;

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    },
  };
}

/**
 * Dev plugin: transforms `@vite/client` so `updateStyle` / `removeStyle`
 * inject `<style>` elements into the web component's shadow root instead of `document.head`.
 */
function shadowPreloadDev(packageName: string, componentName: string): PluginOption {
  return {
    name: 'shadow-preload-dev',
    enforce: 'post',
    apply: 'serve',
    transform: {
      filter: { id: VITE_CLIENT_REGEX },
      handler(code) {
        if (!code.includes('updateStyle') || !code.includes('removeStyle')) return null;

        const s = new MagicString(code);

        // 1. Inject getRoot after `const linkSheetsMap = ...`
        s.replace(
          'const linkSheetsMap = /* @__PURE__ */ new Map();',
          `const linkSheetsMap = /* @__PURE__ */ new Map();${buildGetRoot(packageName, componentName)}`,
        );

        // 2. Init block – redirect style query to shadow root
        s.replace(
          'document.querySelectorAll("style[data-vite-dev-id]")',
          'getRoot().querySelectorAll("style[data-vite-dev-id]")',
        );

        // 3. Init block – redirect link stylesheet query to shadow root
        s.replace(
          'document.querySelectorAll("link[rel=\\"stylesheet\\"][data-vite-dev-id]")',
          'getRoot().querySelectorAll("link[rel=\\"stylesheet\\"][data-vite-dev-id]")',
        );

        // 4. updateStyle – append <style> to shadow root instead of document.head
        s.replace('document.head.appendChild(style)', 'getRoot(\'head\').appendChild(style)');

        // 5. removeStyle – search link stylesheets in shadow root
        s.replace(
          'document.querySelectorAll(`link[rel="stylesheet"][data-vite-dev-id]`)',
          'getRoot().querySelectorAll(`link[rel="stylesheet"][data-vite-dev-id]`)',
        );

        // 6. removeStyle – remove <style> from shadow root instead of document.head
        s.replace('document.head.removeChild(style)', 'getRoot(\'head\').removeChild(style)');

        // 7. CSS HMR update – search <link> elements in shadow root
        s.replace('document.querySelectorAll("link"))', 'getRoot().querySelectorAll("link"))');

        if (!s.hasChanged()) return null;

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }),
        };
      },
    },
  };
}

/**
 * Vite plugin(s) that add Shadow DOM support for both build (preload-helper)
 * and dev (`@vite/client` updateStyle/removeStyle) modes.
 */
export function shadowPreload({
  packageName = '@dvcol/web-extension-template',
  componentName = 'wc-web-extension-template',
}: ShadowPreloadOptions = {}): PluginOption[] {
  return [
    shadowPreloadBuild(packageName, componentName),
    shadowPreloadDev(packageName, componentName),
  ];
}
