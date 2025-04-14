import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  stylistic: {
    semi: true,
  },
  svelte: true,
  rules: {
    'antfu/curly': 'off',
    'antfu/if-newline': 'off',
    'node/prefer-global/process': ['error', 'always'],
  },
  overrides: {
    stylistic: {
      'style/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: 'avoidEscape',
        },
      ],
      'style/brace-style': ['error', '1tbs'],
    },
    typescript: {
      'ts/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
    },
    svelte: {
      'svelte/html-quotes': [
        'error',
        {
          prefer: 'double',
        },
      ],
    },
  },
});
