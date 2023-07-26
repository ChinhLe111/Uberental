import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormComponent } from '@src/app/core/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GButtonModule, GDraggableModule, GEditorModule, GEditorHtmlModule, GUploadModule } from '@core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
export default {
  title: 'Example/Form',
  component: FormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        GButtonModule,
        GDraggableModule,
        GEditorModule,
        GEditorHtmlModule,
        GUploadModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
              return new TranslateHttpLoader(http, '/assets/translations/');
            },
            deps: [HttpClient],
          },
        }),
        ReactiveFormsModule,
        NzFormModule,
        NzSelectModule,
        NzRadioModule,
        NzCheckboxModule,
        NzDatePickerModule,
        NzAutocompleteModule,
        NzUploadModule,
        NzTabsModule,
        NzSwitchModule,
        NzTreeSelectModule,
        NzSliderModule,
        NgxMaskDirective,
        NgxMaskPipe,
      ],
      providers: [provideNgxMask()],
    }),
  ],
  args: {
    // postColumns: ColumnRegisterForm(),
  },
} as Meta;

const Template: Story<FormComponent> = (args: FormComponent) => ({
  props: args,
  template: `<g-form [columns]="postColumns"  [widthLabel]="0"></g-form>`,
});
export const Default = Template.bind({});
