import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

Cypress.Commands.add(
  'iframe', // @ts-ignore
  { prevSubject: 'element' },
  ($iframe) => new Cypress.Promise((resolve) => $iframe.on('load', () => resolve($iframe.contents().find('body')))),
);
Cypress.Commands.add('typeRandom', { prevSubject: 'element' }, (element, text, state, type): any => {
  const random = '_RANDOM_';
  const input = cy.wrap(element).clear();

  if (text.indexOf('_@') > -1 && text.indexOf('@_') > -1)
    input.type(state[text.replace('_@', '').replace('@_', '')].toString());
  else {
    if (text.indexOf(random) > -1) {
      switch (type) {
        case 'test name':
          text = text.replace(random, `${Cypress.currentTest.title.split(' ')[0]} ${faker.lorem.sentence(3)}`);
          break;
        case 'number':
          text = text.replace(random, faker.number.int({ min: 1, max: 100000000 }).toString());
          break;
        case 'percentage':
          text = text.replace(random, faker.number.int({ min: 1, max: 100 }).toString());
          break;
        case 'paragraph':
          text = text.replace(random, faker.lorem.paragraph());
          break;
        case 'email':
          text = text.replace(random, faker.internet.email().toLowerCase());
          break;
        case 'phone':
          text = text.replace(random, faker.helpers.replaceCreditCardSymbols('#{8,12}'));
          break;
        case 'color':
          text = text.replace(random, faker.color.rgb({ casing: 'upper' }));
          break;
        case 'date':
          text = text.replace(random, dayjs(faker.date.anytime()).format('DD-MM-YYYY'));
          break;
        case 'word':
          text = text.replace(random, faker.lorem.sentence(2));
          break;
        default:
          text = text.replace(random, faker.lorem.sentence());
          break;
      }
    }
    if (text) input.type(text, { parseSpecialCharSequences: false });
  }
});
