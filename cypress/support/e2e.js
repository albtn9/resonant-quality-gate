// Adiciona o comando cy.api(): mostra request/response no runner do Cypress
import 'cypress-plugin-api';
import './commands';
import { hideAdsOnLoad, isIgnorableError } from './utils/pageNoise';

hideAdsOnLoad();

Cypress.on('uncaught:exception', (err) => {
  if (isIgnorableError(err)) {
    Cypress.log({
      name: 'uncaught:exception',
      message: `Ignorado: ${err.message}`,
    });
    return false;
  }
  return true;
});
