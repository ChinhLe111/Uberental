import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './modal-form.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { GFormModule, GModalModule } from '@core';

@NgModule({
  declarations: [ModalFormComponent],
  imports: [
    CommonModule,
    GFormModule,
    GModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
          return new TranslateHttpLoader(http, '/assets/translations/');
        },
        deps: [HttpClient],
      },
    }),
  ],
  exports: [ModalFormComponent],
})
export class GModalFormModule {}
