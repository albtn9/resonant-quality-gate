import BasePage from './BasePage';

class HomePage extends BasePage {
  get selectors() {
    return { ...super.selectors, card: '.card' };
  }

  visit() {
    cy.visit('/');
    cy.get(this.selectors.card).should('have.length.greaterThan', 0);
    return this;
  }

  chooseCard(name) {
    cy.contains(this.selectors.card, name).scrollIntoView();
    cy.contains(this.selectors.card, name).click();
    return this;
  }
}

export default new HomePage();
