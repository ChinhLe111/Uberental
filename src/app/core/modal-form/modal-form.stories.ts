import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './modal-form.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GFormModule, GModalModule } from '@core';
export default {
  title: 'Example/ModalForm',
  component: ModalFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
              return new TranslateHttpLoader(http, '/assets/translations/');
            },
            deps: [HttpClient],
          },
        }),
        GFormModule,
        GModalModule,
        HttpClientModule,
      ],
    }),
  ],
  args: {
    // listOfColumnsType: ColumnRegisterForm(),
  },
} as Meta;

const Template: Story<ModalFormComponent> = (args: ModalFormComponent) => ({
  props: args,
  template: `
  <g-modal-form
  [visible]="isVisibleType"
  [title]="'title'"
  [columns]="listOfColumnsType"
  [width]="600"
  [okText]="'save'"
  [loading]="false"
>
</g-modal-form>`,
});
export const Default = Template.bind({});
