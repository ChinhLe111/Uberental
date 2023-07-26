import { Story, Meta } from '@storybook/angular/types-6-0';
import { DataTableComponent } from './data-table.component';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

export default {
  title: 'Example/Data-table',
  component: DataTableComponent,
  decorators: [
    moduleMetadata({
      declarations: [DataTableComponent],
      imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
              return new TranslateHttpLoader(http, '/assets/translations/');
            },
            deps: [HttpClient],
          },
        }),
        NzTableModule,
        NzDropDownModule,
        NzCheckboxModule,
        NzRadioModule,
        NzPopconfirmModule,
        NzPopoverModule,
        NzSpinModule,
        NzDatePickerModule,
        NzSelectModule,
      ],
    }),
  ],
  args: {
    // columnsTable: ColumnRightGroupTable(null),
    isLoading: false,
    listData: [
      {
        name: 'name',
        code: 'code',
        description: 'description',
      },
    ],
    totalData: 1,
    showPagination: true,
    showSearch: true,
  },
} as Meta;

const Template: Story<DataTableComponent> = (args: DataTableComponent) => ({
  props: args,
  template: `<g-datatable
          [columns]="columnsTable"
          [loading]="isLoading"
          [data]="listData"
          [total]="totalData"
          [showPagination]="false"
          [showSearch]="false"
        ></g-datatable>`,
});
export const Default = Template.bind({});
