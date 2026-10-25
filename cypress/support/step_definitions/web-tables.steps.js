import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import WebTablesPage from '../pages/WebTablesPage';
import { buildRecord, buildRecords } from '../factories/webTableFactory';
import { uiState } from '../utils/uiState';

// ---------- contexto ----------

When('eu guardo os registros originais da tabela', () => {
  WebTablesPage.listedEmails().then((emails) => {
    uiState.originalEmails = emails;
  });
});

// ---------- CRUD de um registro ----------

When('eu crio um novo registro com dados aleatórios', () => {
  uiState.record = buildRecord();
  WebTablesPage.addRecord(uiState.record);
});

Then(
  'o registro criado deve ser exibido na tabela com os dados corretos',
  () => {
    WebTablesPage.assertRecordIsListed(uiState.record);
  },
);

When('eu edito o registro criado', () => {
  const { email } = uiState.record;
  // Mantém o e-mail: é ele que localiza o registro na tabela.
  uiState.record = buildRecord({ email });
  WebTablesPage.editRecord(email, uiState.record);
});

Then('o registro deve ser exibido com os dados atualizados', () => {
  WebTablesPage.assertRecordIsListed(uiState.record);
});

When('eu deleto o registro criado', () => {
  WebTablesPage.deleteRecord(uiState.record.email);
});

Then('apenas os registros originais devem permanecer na tabela', () => {
  WebTablesPage.assertOnlyTheseRecordsRemain(uiState.originalEmails);
});

// ---------- bônus: vários registros ----------

const createRecords = (records) => {
  uiState.records = records;
  records.forEach((record) => WebTablesPage.addRecord(record));
};

When('eu crio {int} registros com dados aleatórios', (quantity) => {
  createRecords(buildRecords(quantity));
});

When('eu crio os seguintes registros:', (dataTable) => {
  createRecords(dataTable.hashes());
});

Then('os {int} registros criados devem ser exibidos na tabela', (quantity) => {
  expect(uiState.records, 'registros criados no cenário').to.have.length(
    quantity,
  );
  uiState.records.forEach((record) =>
    WebTablesPage.assertRecordIsListed(record),
  );
});

When('eu deleto todos os registros criados', () => {
  uiState.records.forEach(({ email }) =>
    WebTablesPage.deleteRecordIfListed(email),
  );
});

// ---------- defeito conhecido (BUG-02) ----------

When('eu deleto o primeiro registro criado', () => {
  WebTablesPage.deleteRecord(uiState.records[0].email);
});

Then('os demais registros criados devem continuar na tabela', () => {
  uiState.records
    .slice(1)
    .forEach((record) => WebTablesPage.assertRecordIsListed(record));
});

// ---------- negativos ----------

When('eu tento criar um registro com o e-mail {string}', (email) => {
  WebTablesPage.tryAddRecord(buildRecord({ email })).submitRecordForm();
});

Then('o formulário de registro deve continuar aberto', () => {
  WebTablesPage.assertFormIsOpen();
});

Then('o campo de e-mail do registro deve ser sinalizado como inválido', () => {
  WebTablesPage.assertFieldIsInvalid('email');
});
