import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import BrowserWindowsPage from '../pages/BrowserWindowsPage';

When('eu clico no botão New Window', () => {
  BrowserWindowsPage.stubWindowOpen().clickNewWindow();
});

Then('uma nova janela deve ser aberta', () => {
  BrowserWindowsPage.assertNewWindowWasOpened();
});

Then('a nova janela deve exibir a mensagem {string}', (message) => {
  BrowserWindowsPage.visitOpenedWindow().assertSampleMessage(message);
});

When('eu fecho a nova janela', () => {
  BrowserWindowsPage.closeOpenedWindow();
});

Then('eu devo voltar para a página Browser Windows', () => {
  BrowserWindowsPage.assertIsOnBrowserWindowsPage();
});
