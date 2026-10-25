# language: pt
@ui @interactions
Funcionalidade: Interactions - Sortable
  Como um usuário
  Quero reorganizar os itens da lista arrastando e soltando
  Para deixá-los na ordem desejada

  Contexto:
    Dado que eu acesso a página inicial do DemoQA
    E eu escolho a opção "Interactions" na página inicial
    E eu clico no submenu "Sortable"

  @fluxo-completo
  Cenário: Ordenar os itens da lista em ordem crescente com drag and drop
    Dado que os itens da lista estão fora de ordem
    Quando eu ordeno os itens da lista em ordem crescente usando drag and drop
    Então os itens da lista devem estar em ordem crescente
