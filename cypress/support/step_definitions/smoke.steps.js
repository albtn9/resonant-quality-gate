import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('eu consulto a lista de livros', () => {
  cy.api({
    method: 'GET',
    url: `${Cypress.expose('apiUrl')}/BookStore/v1/Books`,
  }).as('response');
});

Then('a API responde com status {int}', (status) => {
  cy.get('@response').its('status').should('eq', status);
});

Then('a resposta contém uma lista de livros', () => {
  cy.get('@response')
    .its('body.books')
    .should('be.an', 'array')
    .and('not.be.empty');
});
