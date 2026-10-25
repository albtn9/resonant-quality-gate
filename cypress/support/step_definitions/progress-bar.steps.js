import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ProgressBarPage from '../pages/ProgressBarPage';

// Precisa rodar antes de a página carregar.
Before({ tags: '@progress-bar' }, () => {
  ProgressBarPage.spyOnClearInterval();
});

When('eu inicio a barra de progresso', () => {
  ProgressBarPage.start();
});

When('eu paro a barra de progresso antes de atingir {int}%', (limit) => {
  ProgressBarPage.stopBefore(limit);
});

Then(
  'o valor da barra de progresso deve ser menor ou igual a {int}%',
  (limit) => {
    ProgressBarPage.assertValueAtMost(limit);
  },
);

When('eu aguardo a barra de progresso atingir 100%', () => {
  ProgressBarPage.waitUntilComplete();
});

When('eu reseto a barra de progresso', () => {
  ProgressBarPage.reset();
});

Then('a barra de progresso deve voltar para 0%', () => {
  ProgressBarPage.assertWasReset();
});
