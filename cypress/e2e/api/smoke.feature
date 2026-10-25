# language: pt
@api @smoke
Funcionalidade: Smoke test do ambiente
  Garante que o projeto esta configurado e que a API esta acessivel

  Cenário: Listar livros disponíveis na API
    Quando eu consulto a lista de livros
    Então a API responde com status 200
    E a resposta contém uma lista de livros
