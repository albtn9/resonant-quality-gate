import { faker } from '@faker-js/faker';

const GENDERS = ['Male', 'Female', 'Other'];
const HOBBIES = ['Sports', 'Reading', 'Music'];
const SUBJECTS = [
  'Maths',
  'English',
  'Physics',
  'Chemistry',
  'Computer Science',
  'History',
  'Biology',
];
// O campo City depende do State escolhido.
const CITIES_BY_STATE = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function buildStudent() {
  const state = faker.helpers.objectKey(CITIES_BY_STATE);

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `${faker.string.alphanumeric(10).toLowerCase()}@qa-teste.com`,
    gender: faker.helpers.arrayElement(GENDERS),
    mobile: `9${faker.string.numeric(9)}`, // 10 dígitos, como o campo exige
    // Dia entre 10 e 28: existe em todos os meses e tem sempre 2 dígitos.
    birthDate: {
      day: faker.number.int({ min: 10, max: 28 }),
      monthIndex: faker.number.int({ min: 0, max: 11 }),
      year: faker.number.int({ min: 1960, max: 2005 }),
    },
    subjects: faker.helpers.arrayElements(SUBJECTS, { min: 1, max: 3 }),
    // Pelo menos um hobby, na ordem em que o popup os lista.
    hobbies: faker.helpers
      .arrayElements(HOBBIES, { min: 1, max: 3 })
      .sort((a, b) => HOBBIES.indexOf(a) - HOBBIES.indexOf(b)),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    state,
    city: faker.helpers.arrayElement(CITIES_BY_STATE[state]),
  };
}

// Formato exibido no popup: "15 March,1990"
export function formatBirthDate({ day, monthIndex, year }) {
  return `${String(day).padStart(2, '0')} ${MONTHS[monthIndex]},${year}`;
}
