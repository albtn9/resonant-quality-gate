import { existsSync } from 'node:fs';
//import { release } from 'node:os';
import { createRequire } from 'node:module';
import { generate } from 'multiple-cucumber-html-reporter';

const { readRunInfo } = createRequire(import.meta.url)('./run-info.cjs');

// O JSON é gerado pelo preprocessor do Cucumber ao final de `npm test`.
const JSON_REPORT = 'reports/cucumber-report.json';

if (!existsSync(JSON_REPORT)) {
  console.error(
    `Relatório não gerado: ${JSON_REPORT} não existe. Rode os testes antes (npm test).`,
  );
  process.exit(1);
}

const PLATFORM_NAMES = { win32: 'windows', darwin: 'osx', linux: 'linux' };

// Navegador real, gravado pelo Cypress na última execução.
const runInfo = readRunInfo();
if (!runInfo) {
  console.warn(
    'Aviso: navegador desconhecido (.run-info.json ausente). O relatório mostrará "not known".',
  );
}

generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  pageTitle: 'Desafio QA Relatorio de execução',
  reportName: 'Relatório de execução - API e UI',
  displayDuration: true,
  ...(runInfo && {
    metadata: {
      browser: {
        name: runInfo.browser.name.toLowerCase(),
        version: runInfo.browser.version,
      },
      device: process.env.CI ? 'GitHub Actions' : 'Local',
      platform: {
        name: PLATFORM_NAMES[process.platform] ?? process.platform,
        version: '',
      },
      executionPlatform: 'local',
    },
  }),
});
