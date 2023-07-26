import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { GButtonModule } from '@core';
import { UploadComponent } from './upload.component';
@NgModule({
  declarations: [UploadComponent],
  exports: [UploadComponent],
  imports: [
    CommonModule,
    GButtonModule,
    NzSpinModule,
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('ng-language') || 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
          return new TranslateHttpLoader(http, 'assets/translations/');
        },
        deps: [HttpClient],
      },
    }),
    NzPopconfirmModule,
    NzPopoverModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GUploadModule {}
