import BasePage from './BasePage';

// O número no `for` dos labels segue a ordem das opções na tela.
const GENDER_INDEX = { Male: 1, Female: 2, Other: 3 };
const HOBBY_INDEX = { Sports: 1, Reading: 2, Music: 3 };

class PracticeFormPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      form: '#userForm',
      firstName: '#firstName',
      lastName: '#lastName',
      email: '#userEmail',
      genderInput: '#gender-radio-1',
      genderLabel: (index) => `label[for="gender-radio-${index}"]`,
      mobile: '#userNumber',
      birthDate: '#dateOfBirthInput',
      monthSelect: '.react-datepicker__month-select',
      yearSelect: '.react-datepicker__year-select',
      day: (day) =>
        `.react-datepicker__day--${String(day).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`,
      subjects: '#subjectsInput',
      subjectOption: '.subjects-auto-complete__option',
      // State e City não têm classe própria; as opções têm id react-select-N-option-M
      selectOption: '[id^="react-select-"][id*="-option-"]',
      hobbyLabel: (index) => `label[for="hobbies-checkbox-${index}"]`,
      upload: '#uploadPicture',
      address: '#currentAddress',
      stateInput: '#state input',
      cityInput: '#city input',
      submit: '#submit',
      modal: '.modal-content',
      modalTitle: '#example-modal-sizes-title-lg',
      closeButton: '#closeLargeModal',
    };
  }

  fillName({ firstName, lastName }) {
    this.fillInput(this.selectors.firstName, firstName);
    this.fillInput(this.selectors.lastName, lastName);
    return this;
  }

  selectGender(gender) {
    cy.get(this.selectors.genderLabel(GENDER_INDEX[gender])).click();
    return this;
  }

  fillMobile(mobile) {
    this.fillInput(this.selectors.mobile, mobile);
    return this;
  }

  selectBirthDate({ day, monthIndex, year }) {
    cy.get(this.selectors.birthDate).click();
    cy.get(this.selectors.yearSelect).select(String(year));
    cy.get(this.selectors.monthSelect).select(String(monthIndex));
    cy.get(this.selectors.day(day)).click();
    return this;
  }

  // Escolhe uma opção de um react-select digitando e CLICANDO na opção.
  // Evita `{enter}`: se o menu ainda não terminou de renderizar, o Enter não é
  // tratado pelo componente e vira envio implícito do formulário, abrindo o
  // popup de confirmação no meio do preenchimento.
  pickOption(inputSelector, optionSelector, text) {
    cy.get(inputSelector).type(text);
    cy.contains(optionSelector, new RegExp(`^${text}$`)).click();
    return this;
  }

  addSubjects(subjects) {
    subjects.forEach((subject) =>
      this.pickOption(
        this.selectors.subjects,
        this.selectors.subjectOption,
        subject,
      ),
    );
    return this;
  }

  selectHobbies(hobbies) {
    hobbies.forEach((hobby) =>
      cy.get(this.selectors.hobbyLabel(HOBBY_INDEX[hobby])).click(),
    );
    return this;
  }

  uploadFile(filePath) {
    cy.get(this.selectors.upload).selectFile(filePath);
    return this;
  }

  selectStateAndCity({ state, city }) {
    this.pickOption(
      this.selectors.stateInput,
      this.selectors.selectOption,
      state,
    );
    this.pickOption(
      this.selectors.cityInput,
      this.selectors.selectOption,
      city,
    );
    return this;
  }

  // Preenche todos os campos, exceto o upload (que tem passo próprio no BDD).
  fillForm(student) {
    this.fillName(student)
      .fillInput(this.selectors.email, student.email)
      .selectGender(student.gender)
      .fillMobile(student.mobile)
      .selectBirthDate(student.birthDate)
      .addSubjects(student.subjects)
      .selectHobbies(student.hobbies)
      .fillInput(this.selectors.address, student.address)
      .selectStateAndCity(student);
    return this;
  }

  submit() {
    cy.get(this.selectors.submit).scrollIntoView();
    cy.get(this.selectors.submit).click();
    return this;
  }

  // ---------- popup ----------

  assertModalIsOpen() {
    cy.get(this.selectors.modal).should('be.visible');
    cy.get(this.selectors.modalTitle).should(
      'have.text',
      'Thanks for submitting the form',
    );
    return this;
  }

  assertModalRow(label, expectedValue) {
    cy.contains('.modal-content td', new RegExp(`^${label}$`))
      .next('td')
      .should('have.text', expectedValue);
    return this;
  }

  // Esc fecha o popup sem erro (ver docs/defeitos.md, BUG-01).
  closeWithEscape() {
    cy.get('.modal').should('be.visible').type('{esc}');
    return this;
  }

  closeWithButton() {
    cy.get(this.selectors.closeButton).click();
    return this;
  }

  assertModalIsClosed() {
    cy.get(this.selectors.modal).should('not.exist');
    return this;
  }

  // `was-validated` prova que o submit aconteceu antes de checar o popup.
  assertSubmissionWasBlocked() {
    cy.get(this.selectors.form).should('have.class', 'was-validated');
    cy.get(this.selectors.modal).should('not.exist');
    return this;
  }

  assertRequiredFieldsAreInvalid() {
    this.assertFieldIsInvalid(this.selectors.firstName, 'First Name');
    this.assertFieldIsInvalid(this.selectors.lastName, 'Last Name');
    this.assertFieldIsInvalid(this.selectors.genderInput, 'Gender');
    this.assertFieldIsInvalid(this.selectors.mobile, 'Mobile');
    return this;
  }
}

export default new PracticeFormPage();
