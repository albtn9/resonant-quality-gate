import BasePage from './BasePage';

class ProgressBarPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      startStopButton: '#startStopButton',
      resetButton: '#resetButton',
      progressBar: '#progressBar [role="progressbar"]',
    };
  }

  // A barra sobe ~1% a cada 100 ms. Este spy em clearInterval avisa quando o
  // timer da barra realmente parou (ver docs/defeitos.md, observação da Progress Bar).
  spyOnClearInterval() {
    cy.on('window:before:load', (win) => {
      cy.spy(win, 'clearInterval').as('clearInterval');
    });
    return this;
  }

  start() {
    cy.get('@clearInterval').invoke('resetHistory');
    cy.get(this.selectors.startStopButton).should('have.text', 'Start').click();
    return this;
  }

  // Espera a barra chegar perto do limite e para. A margem absorve a latência
  // entre ler o valor e clicar em Stop, sem usar espera fixa.
  stopBefore(limit, margin = 15) {
    cy.get(this.selectors.progressBar).should(($bar) => {
      expect(Number($bar.attr('aria-valuenow')), 'progresso').to.be.gte(
        limit - margin,
      );
    });
    cy.get(this.selectors.startStopButton).should('have.text', 'Stop').click();
    cy.get(this.selectors.startStopButton).should('have.text', 'Start');
    return this;
  }

  assertValueAtMost(limit) {
    cy.get(this.selectors.progressBar).should(($bar) => {
      expect(Number($bar.attr('aria-valuenow')), 'progresso').to.be.at.most(
        limit,
      );
    });
    return this;
  }

  waitUntilComplete() {
    cy.get(this.selectors.progressBar, { timeout: 30000 }).should(
      'have.attr',
      'aria-valuenow',
      '100',
    );
    // A tela mostra 100% um ciclo antes de o timer parar; resetar antes disso
    // pode reiniciar a barra.
    cy.get('@clearInterval').should('have.been.called');
    return this;
  }

  reset() {
    cy.get(this.selectors.resetButton).should('be.visible').click();
    return this;
  }

  assertWasReset() {
    cy.get(this.selectors.progressBar).should(
      'have.attr',
      'aria-valuenow',
      '0',
    );
    cy.get(this.selectors.startStopButton).should('have.text', 'Start');
    return this;
  }
}

export default new ProgressBarPage();
