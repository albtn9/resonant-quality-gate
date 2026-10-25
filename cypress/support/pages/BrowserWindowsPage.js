import BasePage from './BasePage';

// O Cypress controla uma única aba. Em vez de abrir uma janela de verdade,
// interceptamos o window.open (stub): provamos que a página tentou abrir a
// nova janela e então visitamos a URL pedida na própria aba.
class BrowserWindowsPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      newWindowButton: '#windowButton',
      sampleHeading: '#sampleHeading',
    };
  }

  stubWindowOpen() {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    return this;
  }

  clickNewWindow() {
    cy.get(this.selectors.newWindowButton).click();
    return this;
  }

  assertNewWindowWasOpened() {
    cy.get('@windowOpen')
      .should('have.been.calledOnce')
      .its('firstCall.args.0')
      .should('include', '/sample');
    return this;
  }

  visitOpenedWindow() {
    cy.get('@windowOpen')
      .its('firstCall.args.0')
      .then((url) => cy.visit(url));
    return this;
  }

  assertSampleMessage(message) {
    cy.get(this.selectors.sampleHeading).should('have.text', message);
    return this;
  }

  // "Fechar" a janela = voltar para a página que a abriu.
  closeOpenedWindow() {
    cy.go('back');
    return this;
  }

  assertIsOnBrowserWindowsPage() {
    cy.location('pathname').should('eq', '/browser-windows');
    cy.get(this.selectors.newWindowButton).should('be.visible');
    return this;
  }
}

export default new BrowserWindowsPage();
