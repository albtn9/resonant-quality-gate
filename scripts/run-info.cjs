// Guarda o navegador que o Cypress realmente abriu, para o relatório HTML
// mostrar o ambiente de execução (o JSON do Cucumber não traz essa informação).
const {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} = require('node:fs');
const { dirname } = require('node:path');

// Fica fora de `reports/`: o gerador lê todos os .json daquela pasta.
const RUN_INFO_FILE = '.run-info.json';

function recordBrowser(browser) {
  // Nunca pode derrubar a execução dos testes por causa de metadado.
  try {
    mkdirSync(dirname(RUN_INFO_FILE), { recursive: true });
    writeFileSync(
      RUN_INFO_FILE,
      JSON.stringify({
        browser: {
          name: browser.displayName || browser.name,
          version: browser.version,
          headless: Boolean(browser.isHeadless),
        },
      }),
    );
  } catch (error) {
    console.warn(`Não foi possível gravar ${RUN_INFO_FILE}: ${error.message}`);
  }
}

function readRunInfo() {
  try {
    return existsSync(RUN_INFO_FILE)
      ? JSON.parse(readFileSync(RUN_INFO_FILE, 'utf8'))
      : null;
  } catch {
    return null;
  }
}

module.exports = { RUN_INFO_FILE, recordBrowser, readRunInfo };
