# language: pt
@ui @progress-bar
Funcionalidade: Widgets - Progress Bar
  Como um usuário
  Quero controlar a barra de progresso
  Para acompanhar o andamento de um processo

  Contexto:
    Dado que eu acesso a página inicial do DemoQA
    E eu escolho a opção "Widgets" na página inicial
    E eu clico no submenu "Progress Bar"

  @fluxo-completo
  Cenário: Parar a barra antes de 25% e resetar ao atingir 100%
    Quando eu inicio a barra de progresso
    E eu paro a barra de progresso antes de atingir 25%
    Então o valor da barra de progresso deve ser menor ou igual a 25%
    Quando eu inicio a barra de progresso
    E eu aguardo a barra de progresso atingir 100%
    E eu reseto a barra de progresso
    Então a barra de progresso deve voltar para 0%
