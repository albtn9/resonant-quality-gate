import BasePage from './BasePage';

const ROWS = '.web-tables-wrapper tbody tr';

// Ordem das colunas na tabela (a última coluna, Action, não entra).
const COLUMNS = [
  'firstName',
  'lastName',
  'age',
  'email',
  'salary',
  'department',
];

// Ordem dos campos no formulário.
const FORM_FIELDS = {
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  age: '#age',
  salary: '#salary',
  department: '#department',
};

// E-mails (coluna 4) das linhas que têm dados; ignora linhas de preenchimento.
const emailsOf = ($rows) =>
  [...$rows]
    .map((row) => row.querySelectorAll('td')[3]?.textContent.trim())
    .filter(Boolean);

class WebTablesPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      addButton: '#addNewRecordButton',
      searchBox: '#searchBox',
      modal: '.modal-content',
      submit: '#submit',
      editButton: '[title="Edit"]',
      deleteButton: '[title="Delete"]',
    };
  }

  // ---------- busca ----------

  // A busca por e-mail evita depender da paginação (10 linhas por página).
  search(term) {
    cy.get(this.selectors.searchBox).clear();
    if (term) cy.get(this.selectors.searchBox).type(term);
    return this;
  }

  // ---------- formulário ----------

  fillRecordForm(record) {
    cy.get(this.selectors.modal).should('be.visible');
    Object.entries(FORM_FIELDS).forEach(([field, selector]) => {
      this.fillInput(selector, record[field]);
    });
    return this;
  }

  submitRecordForm() {
    cy.get(this.selectors.submit).click();
    return this;
  }

  assertFormIsClosed() {
    cy.get(this.selectors.modal).should('not.exist');
    return this;
  }

  assertFormIsOpen() {
    cy.get(this.selectors.modal).should('be.visible');
    cy.get(this.selectors.submit).should('be.visible');
    return this;
  }

  assertFieldIsInvalid(field) {
    return super.assertFieldIsInvalid(FORM_FIELDS[field], field);
  }

  // ---------- ações ----------

  addRecord(record) {
    this.tryAddRecord(record).submitRecordForm();
    return this.assertFormIsClosed();
  }

  // Abre o formulário e preenche, mas não envia (usado nos negativos).
  tryAddRecord(record) {
    this.search('');
    cy.get(this.selectors.addButton).click();
    return this.fillRecordForm(record);
  }

  editRecord(email, changes) {
    this.search(email);
    cy.contains(ROWS, email).find(this.selectors.editButton).click();
    this.fillRecordForm(changes).submitRecordForm();
    return this.assertFormIsClosed();
  }

  deleteRecord(email) {
    this.search(email);
    cy.contains(ROWS, email).find(this.selectors.deleteButton).click();
    return this;
  }

  // O DemoQA remove vários registros criados com um único Delete (docs/defeitos.md,
  // BUG-02). Por isso, o "deletar todos" só clica nos que ainda estão na tabela.
  deleteRecordIfListed(email) {
    this.search(email);
    cy.get('body').then(($body) => {
      const listed = [...$body.find(`${ROWS} td`)].some(
        (td) => td.textContent.trim() === email,
      );
      if (listed) {
        cy.contains(ROWS, email).find(this.selectors.deleteButton).click();
      } else {
        cy.log(`Já removido pela aplicação: ${email}`);
      }
    });
    return this;
  }

  // ---------- verificações ----------

  assertRecordIsListed(record) {
    this.search(record.email);
    cy.contains(ROWS, record.email)
      .find('td')
      .should(($cells) => {
        const shown = [...$cells]
          .slice(0, COLUMNS.length)
          .map((cell) => cell.textContent.trim());
        expect(shown).to.deep.equal(COLUMNS.map((c) => String(record[c])));
      });
    return this;
  }

  assertRecordIsNotListed(email) {
    this.search(email);
    cy.contains(ROWS, email).should('not.exist');
    return this;
  }

  // E-mails de todos os registros visíveis (sem filtro de busca).
  listedEmails() {
    this.search('');
    return cy.get(ROWS).then(($rows) => emailsOf($rows));
  }

  assertOnlyTheseRecordsRemain(emails) {
    this.search('');
    cy.get(ROWS).should(($rows) => {
      expect(emailsOf($rows)).to.deep.equal(emails);
    });
    return this;
  }
}

export default new WebTablesPage();
