# language: pt
@ui @web-tables
Funcionalidade: Elements - Web Tables
  Como um administrador
  Quero gerenciar os registros da tabela
  Para manter os dados dos funcionários atualizados

  Contexto:
    Dado que eu acesso a página inicial do DemoQA
    E eu escolho a opção "Elements" na página inicial
    E eu clico no submenu "Web Tables"
    E eu guardo os registros originais da tabela

  @fluxo-completo
  Cenário: Criar, editar e deletar um novo registro
    Quando eu crio um novo registro com dados aleatórios
    Então o registro criado deve ser exibido na tabela com os dados corretos
    Quando eu edito o registro criado
    Então o registro deve ser exibido com os dados atualizados
    Quando eu deleto o registro criado
    Então apenas os registros originais devem permanecer na tabela

  @negativo
  Esquema do Cenário: Não cadastrar registro com e-mail inválido "<email>"
    Quando eu tento criar um registro com o e-mail "<email>"
    Então o formulário de registro deve continuar aberto
    E o campo de e-mail do registro deve ser sinalizado como inválido

    Exemplos:
      | email            |
      | email-sem-arroba |
      | usuario@         |

  # Bônus: o DemoQA remove vários registros criados com um único Delete
  # (docs/defeitos.md, BUG-02). Estes cenários validam o resultado final pedido
  # pelo desafio: nenhum registro criado permanece e os originais são preservados.
  @bonus
  Cenário: Criar 12 registros dinamicamente e deletar todos
    Quando eu crio 12 registros com dados aleatórios
    Então os 12 registros criados devem ser exibidos na tabela
    Quando eu deleto todos os registros criados
    Então apenas os registros originais devem permanecer na tabela

  @bonus
  Cenário: Criar 12 registros a partir de uma tabela do Cucumber e deletar todos
    Quando eu crio os seguintes registros:
      | firstName | lastName  | email                   | age | salary | department  |
      | Ana       | Souza     | ana.souza@qa-teste.com  | 25  | 4500   | QA          |
      | Bruno     | Lima      | bruno.lima@qa-teste.com | 31  | 7200   | Engineering |
      | Carla     | Mendes    | carla.m@qa-teste.com    | 28  | 5100   | Legal       |
      | Diego     | Rocha     | diego.r@qa-teste.com    | 40  | 9800   | Finance     |
      | Elisa     | Martins   | elisa.m@qa-teste.com    | 22  | 3200   | Marketing   |
      | Fabio     | Costa     | fabio.c@qa-teste.com    | 35  | 8800   | Compliance  |
      | Gabriela  | Alves     | gabi.a@qa-teste.com     | 29  | 6100   | Insurance   |
      | Henrique  | Pereira   | henrique.p@qa-teste.com | 45  | 12000  | Engineering |
      | Isabela   | Ribeiro   | isabela.r@qa-teste.com  | 27  | 4700   | QA          |
      | Joao      | Carvalho  | joao.c@qa-teste.com     | 38  | 9100   | Finance     |
      | Karen     | Gomes     | karen.g@qa-teste.com    | 33  | 7600   | Legal       |
      | Lucas     | Fernandes | lucas.f@qa-teste.com    | 24  | 3900   | Marketing   |
    Então os 12 registros criados devem ser exibidos na tabela
    Quando eu deleto todos os registros criados
    Então apenas os registros originais devem permanecer na tabela

  # Defeito do DemoQA (BUG-02): deletar um registro criado remove os outros
  # registros criados. Fora da execução padrão: `npm run test:known-bugs`.
  @known-bug
  Cenário: Deletar um registro não deve remover os demais registros criados
    Quando eu crio 3 registros com dados aleatórios
    E eu deleto o primeiro registro criado
    Então os demais registros criados devem continuar na tabela
