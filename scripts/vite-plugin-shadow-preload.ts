import type { PluginOption } from 'vite';

import MagicString from 'magic-string';

export interface ShadowPreloadOptions {
  /** Package name used in `Symbol.for()` to locate the WC host. Defaults to `'@dvcol/web-extension-template'`. */
  packageName?: string;
  /** Web component tag name used in `Symbol.for()` to locate the WC instance. Defaults to `'wc-web-extension-template'`. */
  componentName?: string;
}

const PRELOAD_MARKER = '\0vite/preload-helper';

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
 * Vite plugin that transforms the generated preload-helper chunk to support Shadow DOM.
 *
 * Injects `getRoot()` / `adoptSheet()` helpers and rewrites DOM access calls
 * inside `__vitePreload` so CSS gets adopted via `adoptedStyleSheets` when the
 * application runs inside a web component's `ShadowRoot`.
 */
export function shadowPreload(options: ShadowPreloadOptions = {}): PluginOption {
  const {
    packageName = '@dvcol/web-extension-template',
    componentName = 'wc-web-extension-template',
  } = options;

  return {
    name: 'shadow-preload',
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
