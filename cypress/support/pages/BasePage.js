// Comportamentos comuns a todas as páginas do DemoQA.
export default class BasePage {
  get selectors() {
    return {
      // `a` quando o menu envolve o texto em link; `.text` como alternativa
      menuItem: '.menu-list li a, .menu-list li .text',
      pageTitle: '.main-header, h1',
    };
  }

  openSubmenu(name) {
    cy.contains(this.selectors.menuItem, name).scrollIntoView();
    cy.contains(this.selectors.menuItem, name).click();
    return this;
  }

  fillInput(selector, value) {
    cy.get(selector).clear();
    cy.get(selector).type(value);
    return this;
  }

  // Validação nativa do HTML5 (atributos required, pattern etc.)
  assertFieldIsInvalid(selector, fieldName = selector) {
    cy.get(selector).should(($field) => {
      expect($field[0].checkValidity(), `campo "${fieldName}" inválido`).to.be
        .false;
    });
    return this;
  }

  assertPageTitle(title) {
    cy.get(this.selectors.pageTitle).should('contain.text', title);
    return this;
  }
}
