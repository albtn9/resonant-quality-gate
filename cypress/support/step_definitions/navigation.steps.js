import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';

Given('(que )eu acesso a página inicial do DemoQA', () => {
  HomePage.visit();
});

When('eu escolho a opção {string} na página inicial', (card) => {
  HomePage.chooseCard(card);
});

When('eu clico no submenu {string}', (submenu) => {
  HomePage.openSubmenu(submenu).assertPageTitle(submenu);
});
