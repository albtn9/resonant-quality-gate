import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import SortablePage, { NUMBER_WORDS } from '../pages/SortablePage';
import { uiState } from '../utils/uiState';

const byNumericValue = (a, b) =>
  NUMBER_WORDS.indexOf(a) - NUMBER_WORDS.indexOf(b);

// A lista já nasce em ordem crescente, então primeiro a embaralhamos
// (ordem decrescente, o pior caso) usando o próprio drag and drop.
Given('que os itens da lista estão fora de ordem', () => {
  SortablePage.openListTab();
  SortablePage.currentOrder().then((items) => {
    const ascending = [...items].sort(byNumericValue);
    const descending = [...ascending].reverse();
    uiState.ascendingOrder = ascending;

    SortablePage.reorderTo(descending).assertOrder(descending);
  });
});

When(
  'eu ordeno os itens da lista em ordem crescente usando drag and drop',
  () => {
    SortablePage.reorderTo(uiState.ascendingOrder);
  },
);

Then('os itens da lista devem estar em ordem crescente', () => {
  SortablePage.assertOrder(uiState.ascendingOrder);
});
