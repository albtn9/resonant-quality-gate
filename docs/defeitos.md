# Defeitos conhecidos no DemoQA

Cenários afetados ficam com a tag `@known-bug`, fora da execução padrão.
Para executá-los: `npm run test:known-bugs`.

## BUG-01 — Botão Close não fecha o popup do Practice Form

**Página:** https://demoqa.com/automation-practice-form

**Reprodução**

1. Preencher o formulário com dados válidos e enviar.
2. Conferir o popup "Thanks for submitting the form".
3. Clicar em **Close**.

**Esperado:** o popup fecha.

**Observado:** o popup permanece aberto e o console registra um erro de
`findDOMNode is not a function`.

**Tratamento na automação:** o passo de fechamento do desafio usa a tecla
**Esc**, que fecha o popup sem erro. O clique no botão Close fica no cenário
`@known-bug`. O erro de `findDOMNode` é o único erro de aplicação ignorado em
`cypress/support/utils/pageNoise.js`.

**Evidência (execução de 24/10/2026, Cypress 16.2.0, Chrome 155 headless):**
o cenário `@known-bug` "Fechar o popup pelo botão Close" falhou com
`Expected <div.modal-content> not to exist in the DOM, but it was continuously found`
após 8 s de tentativas. Screenshot: `docs/evidencias/bug-01-close-popup.png`.

## BUG-02 — Deletar um registro remove outros registros adicionados (Web Tables)

**Página:** https://demoqa.com/webtables

**Reprodução**

1. Criar 3 ou mais registros com e-mails diferentes.
2. Pesquisar pelo e-mail do primeiro registro criado e clicar em **Delete**.
3. Limpar a pesquisa e conferir a tabela.

**Esperado:** apenas o registro selecionado é removido.

**Observado:** os demais registros criados também desaparecem; ficam só os
registros originais.

**Tratamento na automação:** o bônus (12 registros) valida o resultado final
pedido pelo desafio: nenhum registro criado permanece e os originais são
preservados. O "deletar todos" só clica nos registros ainda listados e registra
no log os que já foram removidos. Isso **não comprova** a exclusão individual
com vários registros; o cenário `@known-bug` cobre essa expectativa.

**Evidência (execução de 24/10/2026, Cypress 16.2.0, Chrome 155 headless):**
o cenário `@known-bug` "Deletar um registro não deve remover os demais registros
criados" falhou ao procurar um dos registros criados depois do primeiro
(`Expected to find content: '<e-mail>' within the selector:
'.web-tables-wrapper tbody tr' but never did`). Screenshot:
`docs/evidencias/bug-02-delete-remove-varios.png`.

## Observação — Progress Bar: reset imediato em 100%

**Página:** https://demoqa.com/progress-bar

A tela exibe 100% um ciclo antes de o timer da barra ser cancelado. Clicar em
**Reset** nesse instante pode fazer a barra voltar a crescer.

**Tratamento na automação:** antes de resetar, o teste espera o cancelamento
do timer (spy em `clearInterval`) e só então clica em Reset. Depois valida que
o valor é exatamente `0`.

_(Observação a confirmar na sua execução: sem a espera pelo `clearInterval`,
o reset logo após 100% pode falhar de forma intermitente.)_
