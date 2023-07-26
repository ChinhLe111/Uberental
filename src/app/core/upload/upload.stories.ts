import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { UploadComponent } from './upload.component';
import { GButtonModule } from '@core';

import { StorybookModule } from '@src/app/storybook.module';

export default {
  title: 'Component/Upload',
  component: UploadComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookModule, GButtonModule],
    }),
  ],
  args: {
    title: '',
    pasteTitle: '',
    multiple: false,
  },
  argTypes: {
    title: {
      name: 'Title',
      description: 'Title inside upload area',
    },
    pasteTitle: {
      name: 'Paste Title',
      description: 'Title in paste area',
    },
    multiple: {
      name: 'Multiple',
      description: 'Multiple uploaded files',
    },
    url: {
      name: 'URL',
      description: 'URL of file',
      control: {
        type: null,
      },
    },
    customReq: {
      control: {
        type: null,
      },
    },
    isUploading: {
      control: {
        type: null,
      },
    },
    onChange: {
      control: {
        type: null,
      },
    },
    onTouch: {
      control: {
        type: null,
      },
    },
    writeValue: {
      control: {
        type: null,
      },
    },
    handSave: {
      control: {
        type: null,
      },
    },
    onPaste: {
      control: {
        type: null,
      },
    },
    registerOnChange: {
      control: {
        type: null,
      },
    },
    registerOnTouched: {
      control: {
        type: null,
      },
    },
    removeImage: {
      control: {
        type: null,
      },
    },
  },
} as Meta;

const Template: Story<UploadComponent> = (props: UploadComponent) => ({ props });
export const Title: Story<UploadComponent> = Template.bind({});
Title.args = {
  title: 'Custom Title',
};

export const CustomPasteText: Story<UploadComponent> = Template.bind({});
CustomPasteText.args = {
  pasteTitle: 'Custom paste area text',
};

export const Multiple: Story<UploadComponent> = Template.bind({});
Multiple.args = {
  multiple: true,
  url: ['https://angular.io/assets/images/logos/angular/angular.svg'],
};
