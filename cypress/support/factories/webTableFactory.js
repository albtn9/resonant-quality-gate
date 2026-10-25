import { faker } from '@faker-js/faker';

const DEPARTMENTS = [
  'Insurance',
  'Compliance',
  'Legal',
  'QA',
  'Engineering',
  'Finance',
  'Marketing',
];

// O e-mail identifica o registro na tabela, por isso é sempre único.
export function buildRecord(overrides = {}) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `${faker.string.alphanumeric(10).toLowerCase()}@qa-teste.com`,
    age: String(faker.number.int({ min: 18, max: 65 })),
    salary: String(faker.number.int({ min: 1500, max: 25000 })),
    department: faker.helpers.arrayElement(DEPARTMENTS),
    ...overrides,
  };
}

export function buildRecords(quantity) {
  return Array.from({ length: quantity }, () => buildRecord());
}
