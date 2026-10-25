import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { bookstoreApi } from '../api/bookstoreClient';
import { assertSchema, schemas } from '../api/schemas';
import { state } from '../api/state';
import { buildCredentials } from '../api/testData';

// ---------- Fluxo completo (happy path) ----------

Given('um novo usuário criado pela API', () => {
  state.credentials = buildCredentials();

  bookstoreApi.createUser(state.credentials).then((res) => {
    expect(res.status).to.eq(201);
    assertSchema(schemas.createUser, res.body);
    expect(res.body.username).to.eq(state.credentials.userName);
    state.userId = res.body.userID;
  });
});

When('eu gero um token de acesso', () => {
  bookstoreApi.generateToken(state.credentials).then((res) => {
    expect(res.status).to.eq(200);
    assertSchema(schemas.token, res.body);
    expect(res.body.status).to.eq('Success');
    state.token = res.body.token;
  });
});

Then('o usuário está autorizado', () => {
  bookstoreApi.isAuthorized(state.credentials).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body).to.eq(true);
  });
});

When('eu listo os livros disponíveis', () => {
  bookstoreApi.listBooks().then((res) => {
    expect(res.status).to.eq(200);
    assertSchema(schemas.bookList, res.body);
    expect(res.body.books).to.not.be.empty;
    state.books = res.body.books;
  });
});

When('eu reservo {int} livros disponíveis', (quantidade) => {
  state.reservedIsbns = state.books.slice(0, quantidade).map((b) => b.isbn);

  bookstoreApi
    .addBooks(state.token, state.userId, state.reservedIsbns)
    .then((res) => {
      expect(res.status).to.eq(201);
      assertSchema(schemas.addBooks, res.body);
      expect(res.body.books).to.have.length(quantidade);
    });
});

Then(
  'os detalhes do usuário mostram os {int} livros reservados',
  (quantidade) => {
    bookstoreApi.getUser(state.userId, state.token).then((res) => {
      expect(res.status).to.eq(200);
      assertSchema(schemas.userDetails, res.body);
      expect(res.body.userId).to.eq(state.userId);
      expect(res.body.books).to.have.length(quantidade);
      expect(res.body.books.map((b) => b.isbn)).to.have.members(
        state.reservedIsbns,
      );
    });
  },
);

// ---------- Cenários negativos ----------

When('eu tento criar um usuário com a senha {string}', (password) => {
  const credentials = { ...buildCredentials(), password };
  bookstoreApi.createUser(credentials).as('response');
});

When('eu consulto os detalhes do usuário sem token', () => {
  bookstoreApi.getUser(state.userId, undefined).as('response');
});

Then('a resposta contém uma mensagem de erro', () => {
  cy.get('@response')
    .its('body.message')
    .should('be.a', 'string')
    .and('not.be.empty');
});
