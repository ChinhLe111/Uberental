import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { GButtonModule } from '@core';
import { ModalComponent } from './modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    GButtonModule,
    NzSpinModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
          return new TranslateHttpLoader(http, '/assets/translations/');
        },
        deps: [HttpClient],
      },
    }),
    NzModalModule,
  ],
  exports: [ModalComponent],
})
export class GModalModule {}
