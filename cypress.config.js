const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor');
const {
  createEsbuildPlugin,
} = require('@badeball/cypress-cucumber-preprocessor/esbuild');
require('dotenv').config();
const { recordBrowser } = require('./scripts/run-info.cjs');

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  // Valores não sensíveis: lidos nos testes com Cypress.expose('apiUrl')
  // Plano B para a API: https://bookstore.toolsqa.com
  expose: {
    apiUrl: process.env.API_URL || 'https://demoqa.com',
    // Execução padrão: tudo, menos os defeitos conhecidos do DemoQA.
    tags: 'not @known-bug',
  },
  // Anúncios de terceiros cobrem botões e geram ruído.
  blockHosts: [
    '*googlesyndication.com',
    '*doubleclick.net',
    '*googletagservices.com',
    '*googletagmanager.com',
    '*google-analytics.com',
  ],
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 8000,
    video: false,
    retries: { runMode: 1, openMode: 0 },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({ plugins: [createEsbuildPlugin(config)] }),
      );
      // Registra o navegador usado, para o relatório HTML.
      on('before:browser:launch', (browser, launchOptions) => {
        recordBrowser(browser);
        return launchOptions;
      });
      return config;
    },
  },
});
