// The step definitions will use the page objects
import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import Common from '../page_objects/Common';

const common = new Common();

Before(() => {
  common.state = {};
});
Given('User go to login page', () => {
  // cy.readFile('cypress/fixtures/example.json').then((data) => {
  //   if (!data || data.bots === undefined) {
  //     cy.writeFile('cypress/fixtures/example.json', { bots: [{ name: Cypress.currentTest.title, count: 1 }] });
  //   } else {
  //     let check = false;
  //     data.bots.map((i: { name: string; count: number }) => {
  //       if (!check && i.name === Cypress.currentTest.title) {
  //         check = true;
  //         i.count += 1;
  //       }
  //       return i;
  //     });
  //     if (!check) data.bots.push({ name: Cypress.currentTest.title, count: 1 });
  //     console.log(data);
  //     cy.writeFile('cypress/fixtures/example.json', data);
  //   }
  // });
  cy.visit('/vn/auth/login');
});
When('Click "{}" button', common.clickTextButton);
When('Login to admin', () => {
  cy.visit('/vn/auth/login');
  common.typeInputByName('email', 'Email', 'admin@gmail.com');
  common.typeInputByName('text', 'Mật khẩu', '123123');
  common.clickTextButton('Đăng nhập');
  common.verifyMessageSwal2('Success');
});
When('Click "{}" menu', common.clickTextMenu);
When('Click "{}" sub menu to "{}"', common.clickTextSubMenu);
When('Click "{}" tab button', common.clickTextTabBtn);
When('Click on the "{}" button in the "{}" table line', common.clickButtonTableByName);
When('Select on the "{}" item line', common.clickItemByName);
When('Click on the "{}" button in the "{}" item line', common.clickButtonItemByName);
Then('User look message "{}" popup', common.verifyMessageSwal2);

When('Enter "{}" in "{}" with "{}"', common.typeInputByName);
When('Enter "{}" in placeholder "{}" with "{}"', common.typeInputByPlaceholder);
When('Enter "{}" in textarea "{}" with "{}"', common.typeTextareaByName);
When('Enter "{}" in editor "{}" with "{}"', common.typeEditorByName);
When('Enter "{}" in editor HTML "{}" with "{}"', common.typeEditorHtmlByName);
When('Select file in "{}" with "{}"', common.selectFileByName);
When('Enter date in "{}" with "{}"', common.typePickerInputByName);
When('Click switch "{}" to be activated', common.clickSwitchByName);
When('Click radio "{}" in line "{}"', common.clickRadioByName);
When('Click select "{}" with "{}"', common.clickSelectByName);
Then('Required message "{}" displayed under "{}" field', common.verifyErrorByName);

When('Click assign list "{}"', common.clickCheckboxWrapper);
When('Click tree select "{}" with "{}"', common.clickTreeSelectByName);
When('Click on the previously created "{}" tree to edit', common.clickTreeByName);
When('Click on the previously created "{}" tree to delete', common.clickRemoveTreeByName);
