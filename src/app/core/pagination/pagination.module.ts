import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { PaginationComponent } from '../pagination/pagination.component';

@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
          return new TranslateHttpLoader(http, '/assets/translations/');
        },
        deps: [HttpClient],
      },
    }),
    NzSelectModule,
  ],
  exports: [PaginationComponent],
})
export class GPaginationModule {}
