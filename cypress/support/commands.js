// cy.get(item).dragTo(alvo)
// O Sortable do DemoQA usa o drag and drop nativo do HTML5 (react-dnd), então
// eventos de mouse não funcionam: é preciso disparar os eventos de drag com um
// DataTransfer compartilhado e a posição do ponteiro sobre o alvo.
Cypress.Commands.add(
  'dragTo',
  { prevSubject: 'element' },
  (subject, target) => {
    cy.wrap(subject).scrollIntoView();

    cy.window().then((win) => {
      const source = subject[0];
      const destination = Cypress.$(target)[0];
      const from = source.getBoundingClientRect();
      const to = destination.getBoundingClientRect();

      // O item só troca de lugar quando o ponteiro passa do meio do alvo:
      // para baixo, na metade inferior; para cima, na metade superior.
      const movingDown = to.top > from.top;
      const pointer = {
        clientX: to.left + to.width / 2,
        clientY: to.top + to.height * (movingDown ? 0.75 : 0.25),
      };
      const dataTransfer = new win.DataTransfer();
      const withPointer = { dataTransfer, ...pointer };

      // O react-dnd só processa o dragover no frame seguinte.
      const nextFrame = () =>
        cy.then(
          () =>
            new Cypress.Promise((resolve) =>
              win.requestAnimationFrame(resolve),
            ),
        );

      cy.wrap(source).trigger('dragstart', { dataTransfer });
      cy.wrap(destination).trigger('dragenter', withPointer);
      cy.wrap(destination).trigger('dragover', withPointer);
      nextFrame();
      cy.wrap(destination).trigger('drop', withPointer);
      cy.wrap(source).trigger('dragend', { dataTransfer });
    });
  },
);
