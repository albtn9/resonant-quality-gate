// Client dos endpoints da Bookstore API.
// Todas as chamadas usam failOnStatusCode:false; quem chama valida o status
// explicitamente (necessário para os cenários negativos).

const url = (path) => `${Cypress.expose('apiUrl')}${path}`;
const bearer = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const credentialsBody = ({ userName, password }) => ({ userName, password });

export const bookstoreApi = {
  createUser: (credentials) =>
    cy.api({
      method: 'POST',
      url: url('/Account/v1/User'),
      body: credentialsBody(credentials),
      failOnStatusCode: false,
    }),

  generateToken: (credentials) =>
    cy.api({
      method: 'POST',
      url: url('/Account/v1/GenerateToken'),
      body: credentialsBody(credentials),
      failOnStatusCode: false,
    }),

  isAuthorized: (credentials) =>
    cy.api({
      method: 'POST',
      url: url('/Account/v1/Authorized'),
      body: credentialsBody(credentials),
      failOnStatusCode: false,
    }),

  listBooks: () =>
    cy.api({
      method: 'GET',
      url: url('/BookStore/v1/Books'),
      failOnStatusCode: false,
    }),

  addBooks: (token, userId, isbns) =>
    cy.api({
      method: 'POST',
      url: url('/BookStore/v1/Books'),
      headers: bearer(token),
      body: { userId, collectionOfIsbns: isbns.map((isbn) => ({ isbn })) },
      failOnStatusCode: false,
    }),

  getUser: (userId, token) =>
    cy.api({
      method: 'GET',
      url: url(`/Account/v1/User/${userId}`),
      headers: bearer(token),
      failOnStatusCode: false,
    }),

  deleteUser: (userId, token) =>
    cy.api({
      method: 'DELETE',
      url: url(`/Account/v1/User/${userId}`),
      headers: bearer(token),
      failOnStatusCode: false,
    }),
};
