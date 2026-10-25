# language: pt
@ui @forms
Funcionalidade: Forms - Practice Form
  Como um estudante
  Quero preencher o formulário de cadastro
  Para registrar minhas informações

  Contexto:
    Dado que eu acesso a página inicial do DemoQA
    E eu escolho a opção "Forms" na página inicial
    E eu clico no submenu "Practice Form"

  @fluxo-completo
  Cenário: Preencher, enviar e fechar o formulário com valores aleatórios
    Quando eu preencho todo o formulário com valores aleatórios
    E eu faço o upload do arquivo "upload.txt"
    E eu submeto o formulário
    Então um popup de confirmação deve ser aberto
    E o popup deve exibir os dados informados
    Quando eu fecho o popup com a tecla Esc
    Então o popup não deve mais ser exibido

  @negativo
  Cenário: Não enviar o formulário sem os campos obrigatórios
    Quando eu submeto o formulário
    Então o popup de confirmação não deve ser aberto
    E os campos obrigatórios devem ser sinalizados como inválidos

  @negativo
  Esquema do Cenário: Não enviar o formulário com celular inválido "<celular>"
    Quando eu preencho todo o formulário com valores aleatórios
    E eu informo o celular "<celular>"
    E eu submeto o formulário
    Então o popup de confirmação não deve ser aberto
    E o campo de celular deve ser sinalizado como inválido

    Exemplos:
      | celular    |
      | abcdefghij |
      | 98765abcde |

  # Defeito do DemoQA (docs/defeitos.md, BUG-01): o botão Close não fecha o popup.
  # Fica fora da execução padrão; rode com `npm run test:known-bugs`.
  @known-bug
  Cenário: Fechar o popup pelo botão Close
    Dado que eu submeti o formulário preenchido com valores aleatórios
    Quando eu fecho o popup pelo botão Close
    Então o popup não deve mais ser exibido
