import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { GPaginationModule } from '@core/pagination/pagination.module';
import { DataTableComponent } from './data-table.component';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    GPaginationModule,
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
  exports: [DataTableComponent],
})
export class GDatatableModule {}
