import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PracticeFormPage from '../pages/PracticeFormPage';
import { buildStudent, formatBirthDate } from '../factories/studentFactory';
import { uiState } from '../utils/uiState';

const FIXTURES = 'cypress/fixtures';

const fillWithRandomStudent = () => {
  const student = buildStudent();
  uiState.student = student;
  cy.log(`Aluno gerado: ${JSON.stringify(student)}`);
  PracticeFormPage.fillForm(student);
};

Given('(que )eu submeti o formulário preenchido com valores aleatórios', () => {
  fillWithRandomStudent();
  PracticeFormPage.submit().assertModalIsOpen();
});

When('eu preencho todo o formulário com valores aleatórios', () => {
  fillWithRandomStudent();
});

When('eu faço o upload do arquivo {string}', (fileName) => {
  uiState.uploadedFile = fileName;
  PracticeFormPage.uploadFile(`${FIXTURES}/${fileName}`);
});

When('eu informo o celular {string}', (mobile) => {
  PracticeFormPage.fillMobile(mobile);
});

When('eu submeto o formulário', () => {
  PracticeFormPage.submit();
});

Then('um popup de confirmação deve ser aberto', () => {
  PracticeFormPage.assertModalIsOpen();
});

Then('o popup deve exibir os dados informados', () => {
  const { student, uploadedFile } = uiState;
  const expected = {
    'Student Name': `${student.firstName} ${student.lastName}`,
    'Student Email': student.email,
    Gender: student.gender,
    Mobile: student.mobile,
    'Date of Birth': formatBirthDate(student.birthDate),
    Subjects: student.subjects.join(', '),
    Hobbies: student.hobbies.join(', '),
    Picture: uploadedFile,
    Address: student.address,
    'State and City': `${student.state} ${student.city}`,
  };

  Object.entries(expected).forEach(([label, value]) =>
    PracticeFormPage.assertModalRow(label, value),
  );
});

When('eu fecho o popup com a tecla Esc', () => {
  PracticeFormPage.closeWithEscape();
});

When('eu fecho o popup pelo botão Close', () => {
  PracticeFormPage.closeWithButton();
});

Then('o popup não deve mais ser exibido', () => {
  PracticeFormPage.assertModalIsClosed();
});

Then('o popup de confirmação não deve ser aberto', () => {
  PracticeFormPage.assertSubmissionWasBlocked();
});

Then('os campos obrigatórios devem ser sinalizados como inválidos', () => {
  PracticeFormPage.assertRequiredFieldsAreInvalid();
});

Then('o campo de celular deve ser sinalizado como inválido', () => {
  PracticeFormPage.assertFieldIsInvalid(
    PracticeFormPage.selectors.mobile,
    'Mobile',
  );
});
