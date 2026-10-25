// O DemoQA carrega anúncios que cobrem botões e geram erros que não são da aplicação.

const AD_SELECTORS = [
  '#fixedban',
  '#adplus-anchor',
  'footer',
  '.adsbygoogle',
  'iframe[id^="google_ads"]',
  '[id^="Ad.Plus"]',
];

// Esconde os banners a cada carregamento de página.
export function hideAdsOnLoad() {
  Cypress.on('window:load', (win) => {
    const style = win.document.createElement('style');
    style.setAttribute('data-qa', 'hide-ads');
    style.innerHTML = `${AD_SELECTORS.join(', ')} { display: none !important; }`;
    win.document.head.appendChild(style);
  });
}

// Só ignora erros conhecidos; qualquer outro derruba o teste.
//  - findDOMNode: defeito do próprio DemoQA (ver docs/defeitos.md)
//  - "Script error.": erro de script de outro domínio (anúncios)
export function isIgnorableError(err) {
  return (
    /findDOMNode is not a function/.test(err.message) ||
    err.message.includes('Script error.')
  );
}
