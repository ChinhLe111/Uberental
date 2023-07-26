import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ColorPickerModule } from 'ngx-color-picker';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { GButtonModule, GDraggableModule, GEditorModule, GEditorHtmlModule } from '@core';
import { GUploadModule } from '@core/upload/upload.module';

import { FormComponent } from './form.component';
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    NzSpinModule,
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
    ColorPickerModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  exports: [FormComponent],
})
export class GFormModule {}
