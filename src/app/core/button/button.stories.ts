// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { within, userEvent } from '@storybook/testing-library';
import { ButtonComponent } from './button.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Component/Button',
  component: ButtonComponent,
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    disabled: {
      name: 'Disabled',
      description: 'Switches between enabled and disabled button',
    },
    text: {
      name: 'Text',
      description: '',
    },
    extendClass: {
      name: 'Extend Class',
      description: '',
    },
    id: {
      name: 'ID Element',
      description: '',
    },
    icon: {
      name: 'Icon Class',
      description: '',
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Klm6pxIZSaJFiOMX5FpTul9F',
    },
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<ButtonComponent> = (props: ButtonComponent) => ({
  props,
});

export const Primary: Story<ButtonComponent> = Template.bind({});
Primary.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText('Primary'));
  // expect;
  // console.log({ canvasElement, args });
};
Primary.args = {
  disabled: false,
  text: 'Primary',
};

export const Disabled: Story<ButtonComponent> = Template.bind({});
Disabled.args = {
  disabled: true,
  text: 'Disabled',
};

export const Icon: Story<ButtonComponent> = Template.bind({});
Icon.args = {
  icon: 'las la-plus',
};

export const IconSpin: Story<ButtonComponent> = Template.bind({});
IconSpin.args = {
  icon: 'las la-spinner animate-spin',
};

export const IconText: Story<ButtonComponent> = Template.bind({});
IconText.args = {
  text: 'Icon Text',
  icon: 'las la-plus',
};
