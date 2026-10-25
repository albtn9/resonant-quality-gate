import js from '@eslint/js';
import globals from 'globals';
import cypress from 'eslint-plugin-cypress';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      'reports/',
      'cypress/screenshots/',
      'cypress/videos/',
    ],
  },
  js.configs.recommended,

  // Código dos testes: roda no navegador e é empacotado pelo esbuild (ESM).
  {
    files: ['cypress/**/*.js'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...cypress.configs.recommended.languageOptions?.globals,
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      'cypress/no-force': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-pause': 'error',
      'cypress/no-debug': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: 'error',
    },
  },

  // Configuração do Cypress e helpers de script: rodam no Node (CommonJS).
  {
    files: ['cypress.config.js', 'scripts/**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },

  // Scripts: Node com ESM (o gerador de relatório é um pacote ESM-only).
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },

  prettier,
];
