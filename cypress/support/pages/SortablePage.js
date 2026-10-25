import BasePage from './BasePage';

// Ordem numérica dos rótulos dos itens.
export const NUMBER_WORDS = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
];

const ITEMS = '#demo-tabpane-list .list-group-item';
const labelsOf = ($items) => [...$items].map((el) => el.innerText.trim());

class SortablePage extends BasePage {
  get selectors() {
    return { ...super.selectors, listTab: '#demo-tab-list' };
  }

  openListTab() {
    cy.get(this.selectors.listTab).click();
    return this;
  }

  currentOrder() {
    return cy.get(ITEMS).then(($items) => labelsOf($items));
  }

  // Posiciona cada item no seu lugar, do primeiro ao último, relendo a lista
  // a cada passo. Assim o item arrastado sempre sobe até a posição de destino.
  reorderTo(expected) {
    expected.forEach((label, index) => {
      cy.get(ITEMS).then(($items) => {
        const from = labelsOf($items).indexOf(label);
        if (from === index) return;

        cy.wrap($items[from]).dragTo($items[index]);
        cy.get(ITEMS).eq(index).should('have.text', label);
      });
    });
    return this;
  }

  assertOrder(expected) {
    cy.get(ITEMS).should(($items) => {
      expect(labelsOf($items)).to.deep.equal(expected);
    });
    return this;
  }
}

export default new SortablePage();
