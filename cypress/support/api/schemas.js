import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

const str = { type: 'string' };

// Contratos mínimos: campos obrigatórios e tipos.
export const schemas = {
  createUser: {
    type: 'object',
    required: ['userID', 'username', 'books'],
    properties: { userID: str, username: str, books: { type: 'array' } },
  },
  token: {
    type: 'object',
    required: ['token', 'expires', 'status', 'result'],
    properties: { token: str, expires: str, status: str, result: str },
  },
  bookList: {
    type: 'object',
    required: ['books'],
    properties: {
      books: {
        type: 'array',
        items: {
          type: 'object',
          required: ['isbn', 'title', 'author'],
          properties: { isbn: str, title: str, author: str },
        },
      },
    },
  },
  addBooks: {
    type: 'object',
    required: ['books'],
    properties: {
      books: {
        type: 'array',
        items: {
          type: 'object',
          required: ['isbn'],
          properties: { isbn: str },
        },
      },
    },
  },
  userDetails: {
    type: 'object',
    required: ['userId', 'username', 'books'],
    properties: {
      userId: str,
      username: str,
      books: {
        type: 'array',
        items: {
          type: 'object',
          required: ['isbn'],
          properties: { isbn: str },
        },
      },
    },
  },
};

export function assertSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  expect(valid, `contrato inválido: ${JSON.stringify(validate.errors)}`).to.be
    .true;
}
