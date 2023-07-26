// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { PaginationComponent } from './pagination.component';
import { moduleMetadata } from '@storybook/angular';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { StorybookModule } from '@src/app/storybook.module';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Component/Pagination',
  component: PaginationComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookModule, FormsModule, NzSelectModule],
    }),
  ],
  args: {
    pageSizeOptions: [5, 10, 20],
    total: 100,
    pageSize: 5,
    pageIndex: 10,
  },
  argTypes: {
    pageSizeOptions: {
      name: 'Page Size Options',
      description: '',
    },
    total: {
      name: 'Total',
      description: '',
    },
    pageSize: {
      name: 'Page Size',
      description: '',
    },
    pageIndex: {
      name: 'Page Index',
      description: '',
    },
    showSizeChanger: {
      name: 'Show Size Changer',
      description: '',
    },
    showTotal: {
      name: 'Show Total',
      description: '',
    },
    listOfPageItem: {
      control: {
        type: null,
      },
    },
    ranges: {
      control: {
        type: null,
      },
    },
    pageIndexChange: {
      control: {
        type: null,
      },
    },
    pageSizeChange: {
      control: {
        type: null,
      },
    },
    queryParams: {
      control: {
        type: null,
      },
    },
    buildIndexes: {
      control: {
        type: null,
      },
    },
    getLastIndex: {
      control: {
        type: null,
      },
    },
    getListOfPageItem: {
      control: {
        type: null,
      },
    },
    ngOnChanges: {
      control: {
        type: null,
      },
    },
    ngOnInit: {
      control: {
        type: null,
      },
    },
    onPageIndexChange: {
      control: {
        type: null,
      },
    },
    onPageSizeChange: {
      control: {
        type: null,
      },
    },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Klm6pxIZSaJFiOMX5FpTul9F',
    },
  },
} as Meta;
// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<PaginationComponent> = (props: PaginationComponent) => ({
  props,
});
export const OnlyPagination: Story<PaginationComponent> = Template.bind({});
OnlyPagination.args = {
  showSizeChanger: false,
  showTotal: false,
};
export const SizePage: Story<PaginationComponent> = Template.bind({});
SizePage.args = {
  showSizeChanger: true,
  showTotal: false,
};
export const Full: Story<PaginationComponent> = Template.bind({});
Full.args = {
  showSizeChanger: true,
  showTotal: true,
};
