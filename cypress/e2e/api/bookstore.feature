# language: pt
@api
Funcionalidade: Fluxo de usuário e livros na Bookstore API
  Cria um usuário, autoriza, reserva livros e confere os detalhes,
  tudo em uma única execução.

  @fluxo-completo
  Cenário: Criar usuário, autorizar e reservar dois livros
    Dado um novo usuário criado pela API
    Quando eu gero um token de acesso
    Então o usuário está autorizado
    Quando eu listo os livros disponíveis
    E eu reservo 2 livros disponíveis
    Então os detalhes do usuário mostram os 2 livros reservados

  @negativo
  Cenário: Não permite criar usuário com senha fraca
    Quando eu tento criar um usuário com a senha "123"
    Então a API responde com status 400
    E a resposta contém uma mensagem de erro

  @negativo
  Cenário: Bloqueia consulta de usuário sem token
    Dado um novo usuário criado pela API
    Quando eu consulto os detalhes do usuário sem token
    Então a API responde com status 401
    E a resposta contém uma mensagem de erro
