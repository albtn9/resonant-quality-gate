import { faker } from '@faker-js/faker';

// Usuário único por execução. A senha atende a política da API:
// 8+ caracteres, maiúscula, minúscula, número e caractere especial.
export function buildCredentials() {
  return {
    userName: `qa_${Date.now()}_${faker.string.alphanumeric(4)}`,
    password: `Qa@1${faker.string.alphanumeric(8)}`,
  };
}
