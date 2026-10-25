# language: pt
@ui @windows
Funcionalidade: Alerts, Frame & Windows - Browser Windows
  Como um usuário
  Quero abrir uma nova janela a partir da página
  Para visualizar o conteúdo de exemplo

  Contexto:
    Dado que eu acesso a página inicial do DemoQA
    E eu escolho a opção "Alerts, Frame & Windows" na página inicial
    E eu clico no submenu "Browser Windows"

  @fluxo-completo
  Cenário: Abrir uma nova janela e validar a mensagem exibida
    Quando eu clico no botão New Window
    Então uma nova janela deve ser aberta
    E a nova janela deve exibir a mensagem "This is a sample page"
    Quando eu fecho a nova janela
    Então eu devo voltar para a página Browser Windows
