# Desafio QA Automation

[![Testes](https://github.com/albtn9/resonant-quality-gate/actions/workflows/cypress.yml/badge.svg)](https://github.com/albtn9/resonant-quality-gate/actions/workflows/cypress.yml)

Automação de **API** (Bookstore) e **UI** (DemoQA) com **Cypress + Cucumber (BDD em português)**.

- **Parte 1 – API:** fluxo completo em código, numa única execução: criar usuário, gerar token, confirmar autorização, listar livros, reservar 2 e conferir os detalhes do usuário.
- **Parte 2 – UI:** Practice Form, Browser Windows, Web Tables (com o bônus de 12 registros), Progress Bar e Sortable.

## Pré-requisitos

- Node.js 22 ou superior (`nvm use` lê o `.nvmrc`) e npm
- Google Chrome (o Electron está deprecado no Cypress 16)

## Versões

- **Node.js 22 (LTS):** versão suportada (manutenção até abr/2027) e o mínimo exigido pelo Cypress 16 e por dois plugins do projeto. O `.nvmrc` e o campo `engines` fixam isso.
- **Cypress 16:** nesta versão `Cypress.env()` foi removido; os valores de configuração usam `Cypress.expose()` e `--expose`.

## Instalação

```bash
npm install
cp .env.example .env   # opcional: troca as URLs
```

## Execução

| Comando                   | O que faz                                                      |
| ------------------------- | -------------------------------------------------------------- |
| `npm run cy:open`         | Abre o Cypress no modo interativo                              |
| `npm test`                | Roda tudo, exceto os defeitos conhecidos (`@known-bug`)        |
| `npm run test:api`        | Só os cenários `@api`                                          |
| `npm run test:ui`         | Só os cenários `@ui`                                           |
| `npm run test:smoke`      | Só o smoke test                                                |
| `npm run test:known-bugs` | Só os cenários que documentam defeitos do DemoQA (falham hoje) |
| `npm run report`          | Gera o relatório HTML em `reports/html`                        |
| `npm run lint`            | ESLint (inclui regras que proíbem `force: true` e `cy.wait`)   |
| `npm run format:check`    | Confere a formatação com Prettier                              |

## Cenários

| Parte | Tela / fluxo    | Cenários                                                                                         |
| ----- | --------------- | ------------------------------------------------------------------------------------------------ |
| API   | Bookstore       | Fluxo completo; senha fraca (400); consulta sem token (401)                                      |
| UI    | Practice Form   | Fluxo completo (upload `.txt`, popup, fechar com Esc); sem campos obrigatórios; celular inválido |
| UI    | Browser Windows | Abrir nova janela, validar "This is a sample page" e voltar                                      |
| UI    | Web Tables      | Criar, editar e deletar; e-mail inválido; **bônus:** 12 registros (faker e tabela do Cucumber)   |
| UI    | Progress Bar    | Parar antes de 25%, validar, continuar até 100% e resetar                                        |
| UI    | Sortable        | Embaralhar a lista e ordenar em ordem crescente com drag and drop                                |

Tags: `@api`, `@ui`, `@smoke`, `@negativo`, `@bonus`, `@fluxo-completo` e `@known-bug`.

## Rastreabilidade: desafio → testes

### Parte 1 – API

O fluxo roda como **um único cenário contínuo** (`bookstore.feature` → _Criar usuário, autorizar e reservar dois livros_), como o desafio pede.

| Passo do desafio                          | Endpoint                         | Step no cenário                                         |
| ----------------------------------------- | -------------------------------- | ------------------------------------------------------- |
| 1. Criar um usuário                       | `POST /Account/v1/User`          | `um novo usuário criado pela API`                       |
| 2. Gerar um token de acesso               | `POST /Account/v1/GenerateToken` | `eu gero um token de acesso`                            |
| 3. Confirmar se o usuário está autorizado | `POST /Account/v1/Authorized`    | `o usuário está autorizado`                             |
| 4. Listar os livros disponíveis           | `GET /BookStore/v1/Books`        | `eu listo os livros disponíveis`                        |
| 5. Alugar dois livros                     | `POST /BookStore/v1/Books`       | `eu reservo 2 livros disponíveis`                       |
| 6. Listar os detalhes do usuário          | `GET /Account/v1/User/{userId}`  | `os detalhes do usuário mostram os 2 livros reservados` |

Além do fluxo: senha fraca (400), consulta sem token (401) e o smoke test (`smoke.feature`).

### Parte 2 – UI

| Tela            | Passo do desafio                                      | Onde está coberto                                                                                         |
| --------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Practice Form   | Preencher todo o formulário com valores aleatórios    | `practice-form.feature` → _Preencher, enviar e fechar o formulário com valores aleatórios_ (faker)        |
| Practice Form   | Upload de um `.txt` presente no repositório           | `cypress/fixtures/upload.txt`                                                                             |
| Practice Form   | Submeter e garantir que o popup abriu                 | `um popup de confirmação deve ser aberto` e `o popup deve exibir os dados informados`                     |
| Practice Form   | Fechar o popup                                        | `eu fecho o popup com a tecla Esc` (o botão Close é o BUG-01, cenário `@known-bug`)                       |
| Browser Windows | Abrir a nova janela e validar "This is a sample page" | `browser-windows.feature` → _Abrir uma nova janela e validar a mensagem exibida_ (stub de `window.open`)  |
| Browser Windows | Fechar a nova janela                                  | `eu fecho a nova janela` e `eu devo voltar para a página Browser Windows`                                 |
| Web Tables      | Criar, editar e deletar um registro                   | `web-tables.feature` → _Criar, editar e deletar um novo registro_                                         |
| Web Tables      | **Bônus:** 12 registros dinâmicos via Cucumber        | _Criar 12 registros dinamicamente…_ e _Criar 12 registros a partir de uma tabela do Cucumber…_ (`@bonus`) |
| Web Tables      | **Bônus:** deletar todos os registros criados         | Mesmos cenários `@bonus` (ver a ressalva do BUG-02)                                                       |
| Progress Bar    | Parar antes de 25% e validar que é ≤ 25%              | `progress-bar.feature` → _Parar a barra antes de 25% e resetar ao atingir 100%_                           |
| Progress Bar    | Iniciar de novo, chegar a 100% e resetar              | Mesmo cenário                                                                                             |
| Sortable        | Ordenar os itens em ordem crescente (drag and drop)   | `sortable.feature` → _Ordenar os itens da lista em ordem crescente com drag and drop_                     |

## Estrutura

```
cypress/
  e2e/
    api/                   features da API (Gherkin)
    ui/                    features da UI
  support/
    api/                   client dos endpoints, schemas (Ajv), massa e estado
    pages/                 Page Objects (BasePage + uma classe por tela)
    factories/             geração de dados com faker
    step_definitions/      steps e hooks
    utils/                 estado de UI e tratamento de ruído do site
    commands.js            comando customizado dragTo
  fixtures/upload.txt      arquivo usado no upload do Practice Form
docs/
  defeitos.md              defeitos do DemoQA, reprodução e evidências
  evidencias/              screenshots dos defeitos
.github/workflows/         CI (lint, testes de API e UI, relatório)
```

## Decisões técnicas

- **BDD em português** com `@badeball/cypress-cucumber-preprocessor` e bundler esbuild. Cada passo do enunciado vira um step legível.
- **Page Object** (`BasePage` + uma classe por tela) e **factories** com faker: o teste conta a história, o Page Object conhece os seletores.
- **API em código, com `cy.api`** (`cypress-plugin-api`): mostra request, response e headers direto no runner. Um client único (`bookstoreClient`) concentra os endpoints.
- **Contrato com Ajv:** cada resposta do fluxo é validada contra um schema mínimo (campos obrigatórios e tipos), além do status e das regras de negócio.
- **Isolamento e cleanup:** cada cenário começa com estado zerado, usa um usuário único e, ao final, remove o usuário criado (hook `After`), mesmo se falhar.
- **Configuração por ambiente:** `BASE_URL` e `API_URL` vêm do `.env`. Plano B da API: `https://bookstore.toolsqa.com`.
- **Seletores estáveis:** ids, atributo `for` dos labels e `title` dos botões, evitando classes geradas (`css-xxxx`) e posição na lista.
- **Sem `force: true` e sem `cy.wait` fixo:** o ESLint (`eslint-plugin-cypress`) barra os dois. Esperas usam o retry do Cypress.
- **Opções do react-select** (matéria, estado, cidade) são escolhidas digitando e clicando na opção, nunca com `{enter}`: o Enter pode enviar o formulário antes da hora.
- **Browser Windows:** o Cypress controla uma única aba. O teste intercepta `window.open` (stub), prova que a página tentou abrir `/sample`, visita essa URL na própria aba e "fecha" voltando à página anterior.
- **Progress Bar:** em tempo real. Para antes de 25% com uma margem para a latência e, antes de resetar, espera o timer da barra ser cancelado (spy em `clearInterval`).
- **Sortable:** o site usa o drag and drop nativo do HTML5, então o comando `dragTo` dispara os eventos de drag com um `DataTransfer` compartilhado. A lista nasce ordenada; por isso o teste a embaralha antes.
- **Anúncios:** hosts de anúncios bloqueados (`blockHosts`) e banners escondidos por CSS, pois cobriam botões. Só são ignorados o erro `findDOMNode` (defeito do site, ver BUG-01) e os erros de scripts de outros domínios (anúncios); qualquer outro erro derruba o teste.

## Defeitos conhecidos do DemoQA

Os cenários afetados ficam com a tag `@known-bug`, fora da execução padrão, e **falham de propósito** (`npm run test:known-bugs`). Cada defeito tem relatório completo (passos, esperado, observado, causa provável e evidência) em [docs/defeitos.md](docs/defeitos.md).

| ID     | Tela          | Severidade | Status | Reproduzido aqui | Como a automação lida                                                        |
| ------ | ------------- | ---------- | ------ | ---------------- | ---------------------------------------------------------------------------- |
| BUG-01 | Practice Form | Média      | Aberto | Sim              | O fluxo fecha o popup com Esc; o botão Close fica em `@known-bug`            |
| BUG-02 | Web Tables    | Alta       | Aberto | Sim              | O bônus valida o resultado final; a exclusão individual fica em `@known-bug` |
| BUG-03 | Progress Bar  | Baixa      | Aberto | Não (observação) | O teste espera o timer parar antes de resetar                                |

O bônus da Web Tables **não prova** a exclusão individual, por causa do BUG-02; isso está dito no relatório do defeito.

## CI

O workflow `.github/workflows/cypress.yml` roda em push, pull request e manualmente: lint e formatação, depois API e UI em paralelo no Chrome, publicando o relatório e, nas falhas, os screenshots. Cada execução publica o relatório HTML como artefato (`relatorio-api` e `relatorio-ui`), disponível na página do run. Para trocar de ambiente sem alterar código, defina as variáveis `BASE_URL` e `API_URL` em _Settings > Secrets and variables > Actions > Variables_.
