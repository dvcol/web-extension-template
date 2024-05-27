import { readdir, readFile, writeFile } from 'fs/promises';
import { dirname, join, relative } from 'path';
import { fileURLToPath, URL } from 'url';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

import pkg from './package.json';
import { isDev, port, resolveParent } from './scripts/utils';

import type { InputOption } from 'rollup';
import type { PluginOption } from 'vite';

const getInput = (hmr: boolean): InputOption => {
  if (hmr) return { background: resolveParent('src/scripts/background/index.ts') };

  return {
    background: resolveParent('src/scripts/background/index.ts'),
    options: resolveParent('src/views/options/index.html'),
    popup: resolveParent('src/views/popup/index.html'),
  };
};

const i18nRegex = /.*src\/i18n\/([a-zA-Z]+)\/.*\.json/;

const getPlugins = (): PluginOption[] => [
  svelte({
    preprocess: preprocess(),
    emitCss: false,
  }),
  checker({
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
  }),
  {
    name: 'i18n-hmr',
    configureServer: server => {
      console.info('server start');
      server.ws.on('fetch:i18n', async () => {
        const dir = await readdir('dist/_locales');
        const locales = dir.map(_lang =>
          readFile(`dist/_locales/${_lang}/messages.json`, { encoding: 'utf-8' }).then(locale => ({ lang: _lang, locale: JSON.parse(locale) })),
        );
        server.ws.send({
          type: 'custom',
          event: 'update:i18n',
          data: await Promise.all(locales),
        });
      });
    },
    handleHotUpdate: async ({ server, file, read, modules }) => {
      const lang = file.match(i18nRegex)?.[1];
      if (lang) {
        console.info('Emit new i18n', file);
        const locale = JSON.parse(await read());
        server.ws.send({
          type: 'custom',
          event: 'update:i18n',
          data: [{ lang, locale }],
        });
      }
      return modules;
    },
  },
  // rewrite assets to use relative path
  {
    name: 'assets-rewrite',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: (html, { path }) => html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets').replace(/\\/g, '/')}/`),
  },

  {
    name: 'write-to-disk',
    apply: 'serve',
    handleHotUpdate: async ({ file, server: { config } }) => {
      const srcDir = dirname(file);
      if (!srcDir?.endsWith('src/scripts/background')) return;
      const outPath = `${join(config.build.outDir, 'scripts/background')}.js`;
      await writeFile(outPath, `import 'http://localhost:3303/scripts/background/index.ts';`);
    },
  },
];

export default defineConfig(() => ({
  root: resolveParent('src'),
  envDir: resolveParent('env'),
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __DEV__: isDev,
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: isDev,
    'import.meta.env.PKG_VERSION': JSON.stringify(pkg.version),
    'import.meta.env.PKG_NAME': JSON.stringify(pkg.name),
  },
  plugins: getPlugins(),
  base: './',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  preview: {
    port: 3304,
    cors: true,
    open: true,
  },
  build: {
    outDir: resolveParent('dist'),
    sourcemap: isDev ? 'inline' : false,
    minify: false,
    rollupOptions: {
      input: getInput(isDev),
      output: {
        minifyInternalExports: false,
        chunkFileNames: 'chunks/[name]-[hash].chunk.js',
        entryFileNames: entry => {
          if (entry.name === 'background') return 'scripts/[name].js';
          return 'scripts/[name]-[hash].js';
        },
        assetFileNames: asset => {
          const format = '[name][extname]';
          if (asset.name?.endsWith('css')) return `styles/${format}`;
          return `assets/[name][extname]`;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reportsDirectory: '../coverage',
    },
    setupFiles: ['../vitest.setup.ts'],
  },
  optimizeDeps: {
    exclude: ['path', 'fast-glob'],
  },
}));
